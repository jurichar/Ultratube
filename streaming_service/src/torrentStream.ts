import { parse } from "node:path";
import * as ttypes from "./ft_torrent_types.js";
import bencode from "bencode";

function urlencode(t: Uint8Array): string {
  let encoded = "";
  t.forEach((byte) => {
    encoded += "%" + Buffer.from([byte]).toString("hex").toUpperCase();
  });
  return encoded;
}

function generatePeerId(): string {
  const randomAlpha = Math.round(
    Math.pow(36, 12 + 1) - Math.random() * Math.pow(36, 12),
  )
    .toString(36)
    .slice(1);
  return "-FT1000-" + encodeURIComponent(randomAlpha);
}

async function generateQuery(
  torrentMetaData: ttypes.TorrentMeta,
  port: number,
): Promise<string> {
  const infoHash = urlencode(torrentMetaData.infoHash);
  const peerId = generatePeerId();

  const uploaded = 0;
  const downloaded = 0;
  const left = torrentMetaData.info.pieces.length;
  const host = torrentMetaData.announce;

  if (!torrentMetaData.announce.startsWith("http")) {
    const announcer = torrentMetaData.announceList.pop();
    if (!announcer || announcer.length <= 0) {
      throw new Error("No valid announcer left");
    }
    torrentMetaData.announce = announcer[0];
  }

  const query = `${host}?peer_id=${peerId}&info_hash=${infoHash}&port=${port}&uploaded=${uploaded}&downloaded=${downloaded}&left=${left}&compact=1&event=started`;
  return query;
}

async function queryTracker(torrentMetaData: ttypes.TorrentMeta) {
  const port: number = 6881;

  const query = await generateQuery(torrentMetaData, port);

  const response = await fetch(query);
  const responseText = await response.arrayBuffer();
  const decodedResponse = bencode.decode(Buffer.from(responseText));

  return decodedResponse;
}

function parsePeersFromTrackerResponse(rawPeers): string[] {
  const peers: string[] = [];
  const bytes: number[] = [];

  rawPeers.forEach((key: number) => {
    bytes.push(key);
  });

  let i = 0;
  let bytes_inserted = 0;
  let peer = "";

  while (i < bytes.length) {
    if (bytes_inserted < 4) {
      peer += bytes[i].toString();
      if (bytes_inserted !== 3) {
        peer += ".";
      } else {
        peer += ":";
      }
    } else {
      const buff = new ArrayBuffer(2);
      const uint8Array = new Uint8Array(buff);

      uint8Array[0] = bytes[i];
      uint8Array[1] = bytes[i + 1];

      const dataView = new DataView(buff);

      peer += dataView.getUint16(0, false).toString();

      peers.push(peer);
      peer = "";
      bytes_inserted = -1;
      i++;
    }
    bytes_inserted++;
    i++;
  }

  return peers;
}

export async function discoverPeers(torrentMetaData: ttypes.TorrentMeta) {
  const trackerResponse = await queryTracker(torrentMetaData);

  const parsedResponse: ttypes.TrackerResponse = {
    interval: trackerResponse.interval,
    peers: parsePeersFromTrackerResponse(trackerResponse.peers),
  };

  return parsedResponse;
}
