import Fastify, { FastifyInstance } from "fastify";
import {
  downloadTorrent,
  getDecodedTorrentFile,
  deleteTorrent,
} from "./ft_torrent.js";

const fastify: FastifyInstance = Fastify({
  logger: true,
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

    // call download .torrent handler
    const torrentPath = downloadTorrent(torrentUrl);
    // decode .torrent
    const torrentMetaData = getDecodedTorrentFile(torrentPath);
    // parse .torrent
    // connect to peers
    // download movie
    // then stream it
    // delete .torrent file
    deleteTorrent(torrentPath);
    // save movie path in db

    reply.code(200).send({ torrent: torrentMetaData });
  } catch (error) {
    console.error(`Error when downloading torrent: ${error}`);
    reply.code(500).send("Internal server error");
  }
});

const start = async () => {
  try {
    await fastify.listen({
      host: process.env.ADDRESS,
      port: parseInt(process.env.PORT, 10),
    });
  } catch (error) {
    fastify.log.error(`Error: ${error}`);
  }
};

start();

// "https://torrents.yts.rs/torrent/download/CDC5A3E045636502C8D4485E547B2D45D3F2DF41";
