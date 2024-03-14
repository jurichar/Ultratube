import Fastify, { FastifyInstance } from "fastify";
import {
  deleteTorrentMeta,
  downloadTorrentMeta,
  parseTorrentMeta,
} from "./bittorent-client/metadataHandler.js";

import {
  discoverPeers,
  generatePeerId,
} from "./bittorent-client/trackerHandler.js";

import { Peer } from "./bittorent-client/peers.js";

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
    const peerId = generatePeerId();

    console.log(`Downloading .torrent at: ${torrentUrl}`);

    const torrentPath = await downloadTorrentMeta(torrentUrl);
    const torrentMetaData = await parseTorrentMeta(torrentPath);
    const trackerResponse = await discoverPeers(torrentMetaData, peerId);
    const [host, ip] = trackerResponse.peers[0].split(":");

    console.log(`Intiating TCP connection with peer: ${host}:${ip}`);
    // const tcpHandshake = await initPeerConnection(
    //   host,
    //   parseInt(ip, 10),
    //   torrentMetaData.infoHash,
    //   torrentMetaData.infoHashHex,
    //   peerId,
    // );
    const peer = new Peer(
      parseInt(ip, 10),
      host,
      torrentMetaData.infoHash,
      peerId,
    );

    const tcpHandshake = await peer.connect();

    console.log("DEBUG: ", tcpHandshake);

    deleteTorrentMeta(torrentPath);

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
    fs.readFile("banner", "utf8", (err, data) => {
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
