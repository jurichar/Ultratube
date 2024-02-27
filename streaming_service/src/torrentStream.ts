import bencode from "bencode";
import * as fs from "fs";
import { createHash, randomInt } from "node:crypto";
import * as ttypes from "./ft_torrent_types.js";

function generateInfoHash(torrentPath: string): string {
  const torrent = fs.readFileSync(torrentPath);
  const toHash = bencode.decode(torrent);

  return encodeURIComponent(
    createHash("sha1").update(bencode.encode(toHash.info)).digest("binary"),
  );
}

function generatePeerId(): string {
  let randomNumbers: string = "";
  for (let i = 0; i < 12; i++) {
    randomNumbers += randomInt(10).toString();
  }
  return "-FT1000-" + encodeURIComponent(randomNumbers);
}

function generateQuery(
  torrentPath: string,
  torrentMetaData: ttypes.TorrentMeta,
  port: number,
): string {
  const infoHash = generateInfoHash(torrentPath);
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
  console.log("DEBUG: ", torrentPath);
  console.log("DEBUG: ", torrentMetaData);

  const ports: number[] = [];

  for (let i = 6881; i < 6889; i++) {
    ports.push(i);
  }

  for (let i = 0; i < ports.length; i++) {
    const query = generateQuery(torrentPath, torrentMetaData, ports[i]);

    const response = await fetch(query, {
      method: "GET",
      headers: {
        Connection: "close",
        "Accept-encoding": "gzip",
      },
    });

    console.debug("PORT: ", ports[i]);
    console.debug("DEBUG: ", response.status);
    console.debug("DEBUG: ", await response.text());
  }

  return await fetch(generateQuery(torrentPath, torrentMetaData, 6881));
}
