import * as fs from "fs";
import https from "https";
import http from "http";
import bencode from "bencode";

function generatePath(torrentUrl: string): string {
  const splitedUrl: string[] = torrentUrl.split("/");
  return `./torrents/${splitedUrl[splitedUrl.length - 1].toLowerCase()}.torrent`;
}

export function downloadTorrent(torrentUrl: string): string {
  const path = generatePath(torrentUrl);
  https.get(torrentUrl, (res: http.IncomingMessage) => {
    if (res.statusCode !== 200) {
      console.error(`Error: ${res.statusCode} `);
    }
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on("finish", () => {
      filePath.close();
      console.log("download complete!");
    });
  });

  return path;
}

export function getDecodedTorrentFile(torrentPath: string) {
  const torrent = fs.readFileSync(torrentPath);

  const decodeTorrent = bencode.decode(torrent);
  console.log(decodeTorrent);
}
