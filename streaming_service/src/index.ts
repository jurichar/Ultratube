"use strict";
import Fastify, { FastifyInstance } from "fastify";
import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
} from "./bittorent-client/metadataHandler.js";

import fs from "node:fs";

import torrentStream from "torrent-stream";
import { toMagnetURI } from "parse-torrent";

const fastify: FastifyInstance = Fastify({
  logger: false,
});

interface TorrentDownloadBody {
  torrentUrl: string;
}

fastify.post("/download-torrent", async (request, reply) => {
  try {
    const { torrentUrl }: TorrentDownloadBody =
      request.body as TorrentDownloadBody;

    console.log(`Downloading .torrent at: ${torrentUrl}`);

    const torrentPath = await downloadTorrentMeta(torrentUrl);
    const torrentMetaData = await parseTorrentMeta(torrentPath);

    await deleteTorrentMeta(torrentPath);

    reply.code(200).send({ movie: torrentMetaData });
  } catch (error: unknown) {
    console.error(error);
    reply.code(404).send("Torrent is currently unavailable");
  }
});

fastify.get("/stream/:movieId", async (request, reply) => {
  const { movieId } = request.params as {
    movieId: string;
  };
  const torrentUrl = "https://webtorrent.io/torrents/big-buck-bunny.torrent";
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMetaData = await parseTorrentMeta(torrentPath);
  const magnetURI = toMagnetURI({
    infoHashBuffer: Buffer.from(torrentMetaData.infoHash),
  });

  const engine = torrentStream(magnetURI, { path: "./torrents" });
  let filename: string;

  engine.on("ready", () => {
    engine.files.forEach((file: any) => {
      if (file.name.endsWith(".mp4")) {
        filename = file.name;
        file.select();
        const stream = file.createReadStream();
        reply.code(200).send(stream);
      } else {
        file.deselect();
      }
    });
  });

  engine.on("download", (pieceIndex: number) => {
    console.log("downloading piece...", pieceIndex);
  });

  engine.on("idle", () => {
    console.log("We got it boy!");
  });

  const range = request.headers.range;
  if (!range) {
    reply.code(400).send("Require Range header");
  }
  const path = `./torrents/${torrentMetaData.info.file.name}/Big Buck Bunny.mp4`;
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
  reply.code(206).headers(headers).send(videoStream);
});

const start = async () => {
  try {
    await fastify.listen({
      host: "0.0.0.0",
      port: 8001,
    });
  } catch (error) {
    fastify.log.error(`Error: ${error}`);
  }
};

start();
