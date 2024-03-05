import Fastify, { FastifyInstance } from "fastify";
import {
  // deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
} from "./torrentMetaParser.js";

import { discoverPeers } from "./torrentStream.js";

import * as fs from "node:fs";

const fastify: FastifyInstance = Fastify({
  logger: false,
});

interface TorrentDownloadBody {
  torrentUrl: string;
}

fastify.get("/ping", async (_request, reply) => {
  reply.code(200).send({ pong: "pong" });
});

fastify.post("/download-torrent", async (request, reply) => {
  try {
    const { torrentUrl }: TorrentDownloadBody =
      request.body as TorrentDownloadBody;

    console.log(`Downloading .torrent at: ${torrentUrl}`);
    const torrentPath = await downloadTorrentMeta(torrentUrl);

    const torrentMetaData = await parseTorrentMeta(torrentPath);
    const trackerResponse = await discoverPeers(torrentMetaData);

    // deleteTorrentMeta(torrentPath);

    reply.code(200).send({ movie: trackerResponse });
  } catch (error: unknown) {
    console.error(error);
    reply.code(404).send("Torrent is currently unavailable");
  }
});

const start = async () => {
  try {
    await fastify.listen({
      host: "0.0.0.0",
      port: 8001,
    });
    fs.readFile("jojo.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log(data);
    });
  } catch (error) {
    fastify.log.error(`Error: ${error}`);
  }
};

start();
