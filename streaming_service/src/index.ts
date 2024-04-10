"use strict";
import express from "express";
const app = express();

import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
  generateMagnetURI,
} from "./bittorent-client/metadataHandler.js";

import { TORRENT_PATH, downloadMovie } from "./streaming.js";

import fs from "node:fs";
import path from "node:path";
import pump from "pump";
import ffmpeg from "fluent-ffmpeg";

app.get("/stream", async (request, response) => {
  const range = request.headers.range;
  if (!range) {
    response.status(400).send("range header required");
  }

  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMetaData = await parseTorrentMeta(torrentPath);
  const magnetURI = generateMagnetURI(torrentMetaData, torrentUrl);
  await deleteTorrentMeta(torrentPath);

  const videoFile = await downloadMovie(magnetURI, torrentMetaData.announce);
  const ismp4 = videoFile.name.endsWith(".mp4");

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoFile.length - 1);

  const headers = ismp4
    ? {
        "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "video/mp4",
      }
    : {
        "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
        "Accept-Ranges": "bytes",
        "Content-Type": "video/webm",
      };

  const videoStream = fs.createReadStream(
    path.join(TORRENT_PATH, videoFile.path),
    { start, end },
  );

  response.writeHead(206, headers);
  if (ismp4) {
    console.log("Streaming as mp4...");
    pump(videoStream, response);
  } else {
    console.log("Streaming as webm");
    ffmpeg(videoStream).format("webm").pipe(response);
  }
});

app.listen(8001, async () => {
  console.log(`Server app listening on http://localhost:8001`);
});
