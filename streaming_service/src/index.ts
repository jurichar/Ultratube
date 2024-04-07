"use strict";
import express from "express";
const app = express();

import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
  generateMagnetURI,
} from "./bittorent-client/metadataHandler.js";

import {
  TORRENT_PATH,
  downloadMovie,
  getStreamingHeaders,
} from "./streaming.js";

import fs from "node:fs";
import path from "node:path";

app.get("/stream", async (request, response) => {
  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMetaData = await parseTorrentMeta(torrentPath);
  const magnetURI = generateMagnetURI(torrentMetaData, torrentUrl);

  await deleteTorrentMeta(torrentPath);

  const videoFile = await downloadMovie(magnetURI);

  const range = request.headers.range;
  if (!range) {
    response.status(400).send("range header required");
  }
  const headers = getStreamingHeaders(range, videoFile);

  const videoStream = fs.createReadStream(
    path.join(TORRENT_PATH, videoFile.path),
  );

  response.status(206).set(headers);
  videoStream.pipe(response);
});

app.listen(8001, async () => {
  console.log(`Server app listening on http://localhost:8001`);
});
