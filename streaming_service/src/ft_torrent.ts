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

function convertUint8ArrayToString(data) {
  if (Array.isArray(data)) {
    return data.map(convertUint8ArrayToString);
  } else if (data instanceof Uint8Array) {
    return Buffer.from(data).toString("utf-8");
  } else if (typeof data === "object" && data !== null) {
    const result = {};
    Object.keys(data).forEach((key) => {
      result[key] = convertUint8ArrayToString(data[key]);
    });
    return result;
  }
  return data;
}

export function getDecodedTorrentFile(torrentPath: string) {
  const torrent = fs.readFileSync(torrentPath);

  const decodedTorrent = convertUint8ArrayToString(bencode.decode(torrent));
  console.log(decodedTorrent);
  return decodedTorrent;
}

export function deleteTorrent(torrentPath: string) {
  fs.unlink(torrentPath, (error) => {
    if (error) {
      if (error.code === "EOENT") {
        console.error("File doesn't exist");
      } else {
        throw error;
      }
    } else {
      console.log(`${torrentPath} deleted`);
    }
  });
}
