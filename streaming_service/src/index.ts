"use strict";
import express from "express";
const app = express();

import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
  generateMagnetURI,
} from "./bittorent-client/metadataHandler.js";

// import torrentStream from "torrent-stream";
// import fs from "node:fs";

app.get("/stream/:movieId", async (request, response) => {
  const { movieId } = request.params as {
    movieId: string;
  };

  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMetaData = await parseTorrentMeta(torrentPath);
  const magnetURI = generateMagnetURI(torrentMetaData, torrentUrl);

  console.log(magnetURI);

  await deleteTorrentMeta(torrentPath);
  //
  // const range = request.headers.range;
  // if (!range) {
  //   return response.status(400).send("Require Range header");
  // } else {
  //   const path = `./torrents/video.mp4`;
  //   const videoSize = fs.statSync(path).size;
  //   const chunkSize = 10 ** 6;
  //   const start = Number(range.replace(/\D/g, ""));
  //   const end = Math.min(start + chunkSize, videoSize - 1);
  //   const contentLength = end - start + 1;
  //   const headers = {
  //     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
  //     "Accept-Ranges": "bytes",
  //     "Content-Length": contentLength,
  //     "Content-Type": "video/mp4",
  //   };
  //
  //   const videoStream = fs.createReadStream(path, { start, end });
  //
  //   response.writeHead(206, headers);
  //   return videoStream.pipe(response);
  // }
  response.status(200).send(movieId);
});

app.listen(8001, async () => {
  console.log(`Server app listening on http://localhost:8001`);
});
