"use strict";
import express from "express";
const app = express();
import pump from "pump";

import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
  generateMagnetURI,
} from "./bittorent-client/metadataHandler.js";

import { downloadMovie } from "./streaming.js";

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

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoFile.length - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4",
  };

  const videoStream = videoFile.createReadStream({ start, end });

  response.writeHead(206, headers);
  pump(videoStream, response);
});

app.listen(8001, async () => {
  console.log(`Server app listening on http://localhost:8001`);
});
