import bencode from "bencode";
import * as fs from "fs";
import { createHash, randomBytes } from "node:crypto";
import * as ttypes from "./ft_torrent_types.js";

function generateInfoHash(torrentPath: string): string {
  const torrent = fs.readFileSync(torrentPath);
  const toHash = bencode.decode(torrent);

  return encodeURIComponent(
    createHash("sha1").update(bencode.encode(toHash)).digest("hex"),
  );
}

function generatePeerId(): string {
  const peerId = "-FT1000-" + randomBytes(12).toString("hex");
  return encodeURIComponent(createHash("sha1").update(peerId).digest("hex"));
}

export async function queryTracker(
  torrentPath: string,
  torrentMetaData: ttypes.TorrentMeta,
) {
  const infoHash = generateInfoHash(torrentPath);
  const peerId = generatePeerId();
  const ports: number[] = [];

  for (let i = 6881; i < 6889; i++) {
    ports.push(i);
  }

  const uploaded = 0;
  const downloaded = 0;
  const left = torrentMetaData.info.pieces.length;
  const query = `${torrentMetaData.announce}?peer_id=${peerId}&info_hash=${infoHash}&port=${ports[0]}&uploaded=${uploaded}&downloaded=${downloaded}&left=${left}`;

  const response = await fetch(query);
  return response.text();
}
