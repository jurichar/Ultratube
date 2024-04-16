"use strict";
import express from "express";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import torrentStream from "torrent-stream";
import cors from "cors";
const app = express();
import bodyparser from "body-parser";
import fs from "node:fs";
import yifysubtitles from "./api-subtitle.js";

app.use(cors());
app.use(bodyparser.json());

type MovieObject = {
  torrent_hash: string;
  torrent: string;
};

async function getTorrentUrl(idTorrent) {
  try {
    const res = await fetch(`http://localhost:8000/api/movies/${idTorrent}/`, {
      method: "GET",
    });
    const responseJson: MovieObject = await res.json();
    console.log("hello", responseJson, idTorrent);
    return responseJson.torrent_hash;
  } catch (error) {
    return null;
  }
}
app.get("/subtitles/:id", async (request, response) => {
  const { id: subTitleId } = request.params;
  try {
    const res = await fetch(`http://localhost:8000/api/subtitles/${subTitleId}/`, {
      method: "GET",
    });
    const resSubtitles: { location: string } = await res.json();

    const stream = fs.createReadStream(resSubtitles.location);
    response.setHeader("Content-Type", "text/vtt");
    stream.pipe(response);
  } catch (error) {
    return response.status(500).send("Erreur lors de la récupération des sous-titres");
  }
});
app.post("/subtitles", async (request, response) => {
  const { imdb_code, movie_id } = request.body;
  console.log("HELLO", imdb_code);
  try {
    const results = await yifysubtitles(imdb_code, {
      path: "./subtitles",
      langs: ["en", "fr", "es"],
    });
    for (const sub of results) {
      await fetch("http://localhost:8000/api/subtitles/", {
        method: "POST",
        body: JSON.stringify({
          location: sub.path,
          language: sub.langShort,
          movie: movie_id,
        }),
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
      });
    }
    if (results.length > 0) {
      return response.status(200).send("subtitles created");
    }
  } catch (error) {
    console.log(error);
  }
  return response.status(200).send("no subtitles ");
});

app.get("/download/:id", async (request, response) => {
  const { id: torrentId } = request.params;
  const streamingRanges = [];
  const hash = await getTorrentUrl(torrentId);
  const info = await parseTorrent(Buffer.from(hash, "hex"));
  const uri = toMagnetURI({
    infoHash: info.infoHash,
  });
  console.log("here info", info);

  const engine = torrentStream(uri, { path: "./torrents/" });
  let fileDl;
  engine.on("ready", async () => {
    const file = engine.files.find((file) => file.name.endsWith(".mp4"));
    if (!file) {
      response.status(404).send("Video file not found");
      return;
    }
    fileDl = file;
    const range = request.headers.range;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    // const stats = await fs.promises.stat("./torrents/" + fileDl.path);
    const fileSize = fileDl.length;
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    // check if file already exist if we only stream it  else  create read stream on le file
    fileDl.createReadStream({ start, end });
    try {
      await fs.promises.writeFile(`./torrents/${fileDl.path}`, "", {
        flag: "a+",
      });
    } catch (error) {}
  });
  let isStreaming = false;

  engine.on("idle", () => {
    console.log("end of downloading");
    // engine.destroy();
  });
  engine.on("download", async () => {
    console.log(Math.floor(engine.swarm.downloaded * fileDl.length) / 100);
    if (!isStreaming && engine.swarm.downloaded > 4936832) {
      const range = request.headers.range;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const stats = await fs.promises.stat("./torrents/" + fileDl.path);
      const fileSize = fileDl.length;
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const requestedRange = [start, end].join("-");
      if (streamingRanges.includes(requestedRange)) {
        console.log("Already streaming the requested range");
        return;
      }
      streamingRanges.push(requestedRange);
      const chunksize = Number(end - start + 1);
      const fileTmp = fs.createReadStream("./torrents/" + fileDl.path, {
        start: start,
        end: end,
      });
      // const fileTmp = fileDl.createReadStream({ start: start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
        "Keep-alive": "timeout=10000",
      };
      response.status(206).set(head);
      fileTmp.pipe(response);
      isStreaming = true;
    }
    response.on("close", () => {
      console.log("Connexion closed, stop streaming...");
      engine.destroy();
    });
  });
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
