"use strict";
import express from "express";
const app = express();
import pump from "pump";
import process from "node:process";
import ffmpeg from "fluent-ffmpeg";

import {
  getTorrentMetadata,
  generateMagnetURI,
} from "./bittorent-client/metadataHandler.js";

import { downloadMovie } from "./streaming.js";

app.get("/stream", async (request, response) => {
  const range = request.headers.range;
  if (!range) {
    response.status(400).send("range header required");
  }

  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentMetaData = await getTorrentMetadata(torrentUrl);
  const magnetURI = generateMagnetURI(torrentMetaData, torrentUrl);
  const videoFile = await downloadMovie(magnetURI, torrentMetaData.announce);

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoFile.length - 1;
  const chunksize = Number(end - start + 1);
  const extension = videoFile.name.split(".").pop();

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": `video/${extension.match(/mp4|webm|ogg/) ? extension : "webm"}`,
  };

  const videoStream = videoFile.createReadStream({ start, end });

  if (extension.match(/mp4|webm|ogg/)) {
    console.log("streaming movie");
    response.writeHead(206, headers);
    pump(videoStream, response);
  } else {
    console.log("Converting and streaming movie");
    const converted = ffmpeg(videoStream)
      .videoCodec("libvpx")
      .videoBitrate(1024)
      .audioCodec("libopus")
      .audioBitrate(128)
      .format("webm")
      .outputOptions(["-crf 50", "-deadline realtime"])
      .on("error", () => {});
    pump(converted as any, response);
  }
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, async () => {
  console.log(`Server app listening on http://localhost:${PORT}`);
});
