"use strict";
import express from "express";
const app = express();
import pump from "pump";
import process from "node:process";
import ffmpeg from "fluent-ffmpeg";
import cors from "cors";
import bodyparser from "body-parser";
import fs from "node:fs";
import torrentStream from "torrent-stream";
import yifysubtitles from "./api-subtitle.js";
import { flushMoviesJob } from "./jobs/flushMovies.js";

app.use(cors());
app.use(bodyparser.json());

flushMoviesJob();

const TORRENT_PATH = "./torrents";

import { getTorrentMetadata, generateMagnetURI } from "./bittorent-client/metadataHandler.js";

import { downloadMovie, streamDirectly } from "./streaming.js";
app.get("/big-buck-buck-mkv", async (request, response) => {
  const range = request.headers.range;
  const stat = await fs.promises.stat("./BigBuckBunny_320x180.mkv");
  if (stat.size) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const videoStream = fs.createReadStream("./BigBuckBunny_320x180.mkv", {
      start,
      end,
    });
    const converted = ffmpeg(videoStream)
      .videoCodec("libvpx")
      .videoBitrate(1024)
      .audioCodec("libopus")
      .audioBitrate(128)
      .format("webm")
      .outputOptions(["-crf 50", "-deadline realtime"])
      .on("error", (err) => { });

    converted.pipe(response);
  } else {
    return response.status(400).send("error");
  }
});
app.get("/stream/:id", async (request, response) => {
  const { id: torrentId } = request.params;

  const range = request.headers.range;
  if (!range) {
    return response.status(400).send("range header required");
  }

  const { torrent: torrentUrl, path: moviePath } = await getTorrentUrl(torrentId);

  if (moviePath !== "") {
    const { videoStream, headers } = await streamDirectly(moviePath, range)
    response.writeHead(206, headers);
    pump(videoStream, response);
  }

  const torrentMetaData = await getTorrentMetadata(torrentUrl);
  const magnetURI = generateMagnetURI(torrentMetaData, torrentUrl);
  const engine = torrentStream(magnetURI, {
    path: TORRENT_PATH,
    trackers: torrentMetaData.announce,
  });

  let videoFile: TorrentStream.TorrentFile;
  try {
    videoFile = await downloadMovie(engine);
  } catch (error) {
    return response.status(404).send(error.message);
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoFile.length - 1;
  const chunksize = Number(end - start + 1);
  const extension = videoFile.name.split(".").pop();
  const videoStream = videoFile.createReadStream({ start, end });

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": `video/${extension.match(/mp4|webm|ogg/) ? extension : "webm"}`,
    "Keep-alive": "timeout=10000",
  };

  try {
    await fs.promises.writeFile(`./torrents/${videoFile.path}`, "", {
      flag: "a+",
    });
  } catch (error) {
    console.error(error);
  }

  let isStreaming = false;

  engine.on("download", async () => {
    if (!isStreaming && engine.swarm.downloaded > 4936832) {
      const fileTmp = fs.createReadStream("./torrents/" + videoFile.path, {
        start: start,
        end: end,
      });

      if (extension.match(/mp4|webm|ogg/)) {
        response.writeHead(206, headers);
        pump(videoStream, response);
      } else {
        const converted = ffmpeg(videoStream)
          .videoCodec("libvpx")
          .videoBitrate(1024)
          .audioCodec("libopus")
          .audioBitrate(128)
          .format("webm")
          .outputOptions(["-crf 50", "-deadline realtime"])
          .on("error", () => { });
        converted.pipe(response);
      }
      isStreaming = true;
    }
  });

  engine.on("idle", async () => {
    await fetch(`http://backend:8000/api/movie/${torrentId}/`, {
      method: "PATCH",
      body: JSON.stringify({ path: "./torrents/" + videoFile.path }),
    });
  });

  response.on("close", () => {
    console.log("Connexion closed, stop streaming...");
    engine.destroy(() => { });
    response.end();
  });
});

type MovieObject = {
  torrent_hash: string;
  torrent: string;
  path: string
};

async function getTorrentUrl(idTorrent: string) {
  try {
    const res = await fetch(`http://backend:8000/api/movies/${idTorrent}/`, {
      method: "GET",
    });
    const responseJson: MovieObject = await res.json();
    return responseJson;
  } catch (error) {
    return null;
  }
}

app.get("/subtitles/:id", async (request, response) => {
  const { id: subTitleId } = request.params;
  try {
    const res = await fetch(`http://backend:8000/api/subtitles/${subTitleId}/`, {
      method: "GET",
    });
    const resSubtitles: { location: string } = await res.json();

    const stream = fs.createReadStream(resSubtitles.location);
    response.setHeader("Content-Type", "text/vtt");
    pump(stream, response);
  } catch (error) {
    return response.status(500).send("Erreur Subtitles");
  }
});

app.post("/subtitles", async (request, response) => {
  const { imdb_code, movie_id } = request.body;
  try {
    const results = await yifysubtitles(imdb_code, {
      path: "./subtitles",
      langs: ["en", "fr", "es"],
    });
    for (const sub of results) {
      await fetch("http://backend:8000/api/subtitles/", {
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
    console.error(error);
  }
  return response.status(200).send("no subtitles ");
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, async () => {
  console.log(`Server app listening on http://localhost:${PORT}`);
});
