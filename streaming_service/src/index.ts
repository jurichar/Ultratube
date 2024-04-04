"use strict";
import express from "express";
import path from "node:path";
const app = express();

import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
  generateMagnetURI,
} from "./bittorent-client/metadataHandler.js";

import torrentStream from "torrent-stream";
import fs from "node:fs";

app.get("/stream/:movieId", async (request, response) => {
  const { movieId } = request.params as {
    movieId: string;
  };

  console.log(movieId);

  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMetaData = await parseTorrentMeta(torrentPath);
  const magnetURI = generateMagnetURI(torrentMetaData, torrentUrl);

  const torrentDir = `${path.resolve()}/torrents/${torrentMetaData.name}`;
  try {
    await fs.promises.mkdir(torrentDir);
  } catch (error) {
    console.error("THIS IS AN ERROR LOL: ", error.message);
  }

  await deleteTorrentMeta(torrentPath);

  const engine = torrentStream(magnetURI, { path: "./torrents/" });
  const range = request.headers.range;
  let video: TorrentStream.TorrentFile;

  engine.on("ready", () => {
    engine.files.forEach((file) => {
      if (file.name.endsWith("mp4")) {
        file.select();
        if (!range) {
          response.status(400).send("Require Range header");
        }
        fs.promises
          .writeFile(path.join(torrentDir, file.name), "", { flag: "a+" })
          .then(() => {
            video = file;
            const videoSize = video.length;
            const chunkSize = 10 ** 6;
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + chunkSize, videoSize - 1);
            const contentLength = end - start + 1;
            const headers = {
              "Content-Range": `bytes ${start}-${end}/${videoSize}`,
              "Accept-Ranges": "bytes",
              "Content-Length": contentLength,
              "Content-Type": "video/mp4",
            };

            const videoStream = fs.createReadStream(
              path.join(torrentDir, file.name),
              { start, end },
            );

            response.writeHead(206, headers);
            videoStream.pipe(response);
          })
          .catch((err) => {
            console.log("WSH WSH WSH");
            console.log(err);
          });
      } else {
        file.deselect();
      }
    });
  });

  engine.on("download", () => {});
});

app.listen(8001, async () => {
  console.log(`Server app listening on http://localhost:8001`);
});
