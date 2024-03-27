"use strict";
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

import torrentStream from "torrent-stream";
import { toMagnetURI } from "parse-torrent";
import { Peer } from "./bittorent-client/peers.js";

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
    const peerId = generatePeerId();

    console.log(`Downloading .torrent at: ${torrentUrl}`);

    const torrentPath = await downloadTorrentMeta(torrentUrl);
    const torrentMetaData = await parseTorrentMeta(torrentPath);
    const trackerResponse = await discoverPeers(torrentMetaData, peerId);
    const [host, ip] = trackerResponse.peers[0].split(":");

    console.log(`Initiating TCP connection with peer: ${host}:${ip}`);

    const peer = new Peer(
      parseInt(ip, 10),
      host,
      torrentMetaData.infoHash,
      peerId,
      torrentMetaData.info.pieceLength,
    );

    await peer.connect();

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

  const engine = torrentStream(magnetURI);

  engine.on("ready", () => {
    engine.files.foreach((file: any) => {
      console.log("filename", file.name);
    });
  });

  reply.code(200).send({ movieId: movieId, magnet: magnetURI });
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
