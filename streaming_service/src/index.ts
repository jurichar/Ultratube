"use strict";
import express from "express";
import Fastify, { FastifyInstance } from "fastify";
import { downloadTorrentMeta, generateMagnetURI, parseTorrentMeta } from "./bittorent-client/metadataHandler.js";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import torrentStream from "torrent-stream";
import cors from "cors";
const app = express();
import fs from "fs";
import path from "path";
app.use(cors());

interface TorrentDownloadBody {
  torrentUrl: string;
}

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
    console.log(responseJson);
    return responseJson.torrent_hash;
  } catch (error) {
    return null;
  }
}
app.get("/download/:id", async (request, response) => {
  const { id: torrentId } = request.params;

  const hash = await getTorrentUrl(torrentId);
  const info = await parseTorrent(Buffer.from(hash, "hex"));
  const uri = toMagnetURI({
    infoHash: info.infoHash,
  });
  console.log(info);

  const engine = torrentStream(uri, { path: "./torrents/" + torrentId });

  engine.on("ready", () => {
    console.log("here");
    const file = engine.files.find((file) => file.name.endsWith(".mp4"));
    if (!file) {
      response.status(404).send("Video file not found");
      return;
    }
    file.select();
    console.log("here");
    const name = path.parse(file.name).name;
    console.log(file.path);
    // fs.stat("./torrents" + name, (error, stats) => {
    //   console.log(stats);
    // });
    const fileSize = file.length;
    const range = request.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = Number(end - start + 1);
      const fileTmp = file.createReadStream({ start: start, end: end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
        "Keep-Alive": "timeout=1000 max=100000",
      };
      fileTmp.on("data", function (chunk) {
        // console.log(chunk.toString());
      });
      response.status(206).set(head);
      fileTmp.pipe(response);
    }
    // engine.on("download", (piece) => {
    //   console.log(piece);
    //   fs.stat("./torrents/" + name.replace(".", " ") + "/" + file.name, (error, stats) => {
    //     console.log(error);
    //     console.log(stats);
    //   });
    // });
  });
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
