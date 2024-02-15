import Fastify, { FastifyInstance } from "fastify";
import { downloadTorrent, getDecodedTorrentFile } from "./ft_torrent.js";

/* Api routes needed
 * post : download movie
 * get: stream movie
 */

const fastify: FastifyInstance = Fastify({
  logger: true,
});

interface TorrentDownloadBody {
  torrentUrl: string;
}

fastify.post("/download-torrent", async (request, reply) => {
  try {
    const { torrentUrl }: TorrentDownloadBody =
      request.body as TorrentDownloadBody;

    console.log(`Downloading .torrent at: ${torrentUrl}`);

    // call download .torrent handler
    const torrentPath = downloadTorrent(torrentUrl);
    getDecodedTorrentFile(torrentPath);
    // decode .torrent
    // parse .torrent
    // connect to peers
    // download movie
    // then stream it
    // delete .torrent file
    // save movie path in db

    reply.code(200).send({ torrent: torrentPath });
  } catch (error) {
    console.error(`Error when downloading torrent: ${error}`);
    reply.code(500).send("Internal server error");
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
  } catch (error) {
    fastify.log.error(`Error: ${error}`);
  }
};

start();

// "https://torrents.yts.rs/torrent/download/CDC5A3E045636502C8D4485E547B2D45D3F2DF41";
