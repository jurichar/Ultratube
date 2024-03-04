import * as ttypes from "./ft_torrent_types.js";

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
  if (!torrentMetaData.announce.startsWith("http")) {
    const announcer = torrentMetaData.announceList.pop();
    if (!announcer || announcer.length <= 0) {
      throw new Error("No valid announcer left");
    }
    torrentMetaData.announce = announcer[0];
  }

  const host = torrentMetaData.announce;

  const query = `${host}?peer_id=${peerId}&info_hash=${infoHash}&port=${port}&uploaded=${uploaded}&downloaded=${downloaded}&left=${left}&compact=1&event=started`;
  return query;
}

export async function queryTracker(
  torrentMetaData: ttypes.TorrentMeta,
): Promise<string> {
  const ports: number[] = [];

  for (let i = 6881; i < 6889; i++) {
    ports.push(i);
  }

  const query = await generateQuery(torrentMetaData, ports[0]);

  const response = await fetch(query);

  return response.text();
}
