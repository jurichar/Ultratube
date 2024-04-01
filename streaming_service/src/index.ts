"use strict";
import express from "express";
const app = express();

import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
} from "./bittorent-client/metadataHandler.js";

import torrentStream from "torrent-stream";
import { toMagnetURI } from "parse-torrent";

interface TorrentDownloadBody {
  torrentUrl: string;
}

import fs from "node:fs";

app.post("/download-torrent", async (request, response) => {
  try {
    const { torrentUrl }: TorrentDownloadBody =
      request.body as TorrentDownloadBody;

    console.log(`Downloading .torrent at: ${torrentUrl}`);

    const torrentPath = await downloadTorrentMeta(torrentUrl);
    const torrentMetaData = await parseTorrentMeta(torrentPath);

    await deleteTorrentMeta(torrentPath);

    response.status(200).send({ movie: torrentMetaData });
  } catch (error: unknown) {
    console.error(error);
    response.status(404).send("Torrent is currently unavailable");
  }
});

app.get("/stream/:movieId", async (request, response) => {
  const { movieId } = request.params as {
    movieId: string;
  };

  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMetaData = await parseTorrentMeta(torrentPath);
  const magnetURI = toMagnetURI({
    infoHashBuffer: torrentMetaData.infoHashBuffer,
  });

  const engine = torrentStream(magnetURI, { path: "./torrents" });
  let filename: string;

  engine.on("ready", () => {
    console.log("WE ARE READY");
    engine.files.forEach((file: any) => {
      if (file.name.endsWith(".mp4")) {
        filename = file.name;
        file.select();
        // generate file path
        // check if file exist
        // if file exist create the readStream and pipeIT
        const path = `./torrents/${torrentMetaData.name}/${file.name}`;
        console.log(path);
        const stream = file.createReadStream();
        response.status(200).send(stream);
      } else {
        file.deselect();
      }
    });
  });

  engine.on("download", (pieceIndex: number) => {
    console.log("downloading piece...", pieceIndex);
  });

  engine.on("idle", () => {
    console.log("Downloaded");
  });

  await deleteTorrentMeta(torrentPath);

  const range = request.headers.range;
  if (!range) {
    response.status(400).send("Require Range header");
  }

  console.log("Range: ", range);

  const path = `./torrents/video.mp4`;
  const videoSize = fs.statSync(path).size;
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

  const videoStream = fs.createReadStream(path, { start, end });

  response.writeHead(206, headers);
  videoStream.pipe(response);
});

app.listen(8001, () => {
  console.log(`Server app listening on http://localhost:8001`);
});
