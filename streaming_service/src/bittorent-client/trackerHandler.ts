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

  const query = `${host}?peer_id=${peerId}&info_hash=${infoHash}&port=6881&uploaded=${uploaded}&downloaded=${downloaded}&left=${left}&compact=1&event=started`;
  return query;
}

async function queryTracker(torrentMetaData: ttypes.TorrentMeta) {
  const query = await generateQuery(torrentMetaData);

  const response = await fetch(query);
  const responseBuffer = await response.arrayBuffer();
  const decodedResponse = bencode.decode(Buffer.from(responseBuffer));

  return decodedResponse;
}

function bytesToNumber(bytes: number[]): number {
  const buffer = new ArrayBuffer(2);
  const uint8Array = new Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    uint8Array[i] = bytes[i];
  }

  const dataView = new DataView(buffer);

  return dataView.getUint16(0, false);
}

function getChunckOfPeerID(bytes: number, bytes_inserted: number): string {
  let chunk = bytes.toString();
  chunk += bytes_inserted !== 3 ? "." : ":";
  return chunk;
}

function parsePeersFromTrackerResponse(rawPeers): string[] {
  const peers: string[] = [];
  const bytes: number[] = [];

  rawPeers.forEach((bytesValue: number) => {
    bytes.push(bytesValue);
  });

  let i = 0;
  let bytesCount = 0;
  let peer = "";

  while (i < bytes.length) {
    while (bytesCount < 4) {
      peer += getChunckOfPeerID(bytes[i], bytesCount);
      i++;
      bytesCount++;
    }
    peer += bytesToNumber([bytes[i], bytes[i + 1]]);
    peers.push(peer);
    peer = "";
    bytesCount = 0;
    i += 2;
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
