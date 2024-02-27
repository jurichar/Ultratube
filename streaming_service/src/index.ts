import Fastify, { FastifyInstance } from "fastify";
import {
  deleteTorrent,
  downloadTorrent,
  getDecodedTorrentFile,
} from "./torrentMetaParser.js";

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

    const torrentPath = await downloadTorrent(torrentUrl);
    const torrentMetaData = getDecodedTorrentFile(torrentPath);
    // download movie
    // const movie = await queryTracker(torrentPath, torrentMetaData);
    // then stream it
    // delete .torrent file
    deleteTorrent(torrentPath);
    // save movie path in db

    reply.code(200).send({ torrent: torrentMetaData });
  } catch (error) {
    console.error(`Error when downloading torrent: ${error}`);
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
