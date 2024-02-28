import * as fs from "fs";
import parseTorrent from "parse-torrent";
import * as ttypes from "./ft_torrent_types.js";

async function generateInfoHash(torrentPath: string): Promise<string> {
  const metadata = await parseTorrent(fs.readFileSync(torrentPath));

  return encodeURIComponent(metadata.infoHash);
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
  torrentPath: string,
  torrentMetaData: ttypes.TorrentMeta,
  port: number,
): Promise<string> {
  const infoHash = await generateInfoHash(torrentPath);
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
  console.log(query);
  return query;
}

export async function queryTracker(
  torrentPath: string,
  torrentMetaData: ttypes.TorrentMeta,
) {
  const ports: number[] = [];

  for (let i = 6881; i < 6889; i++) {
    ports.push(i);
  }

  const query = await generateQuery(torrentPath, torrentMetaData, ports[0]);

  const response = await fetch(query);

  console.log("DEBUG: ", query);
  console.debug("DEBUG: ", response.status);
  console.debug("DEBUG: ", await response.text());
}
