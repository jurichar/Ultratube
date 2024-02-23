import * as fs from "fs";
import https from "https";
import bencode from "bencode";
import * as ttypes from "./ft_torrent_types.js";

function generatePath(torrentUrl: string): string {
  const splitedUrl: string[] = torrentUrl.split("/");
  return `./torrents/${splitedUrl[splitedUrl.length - 1].toLowerCase()}.torrent`;
}

function filterNonHtppTrackers(trackers: string[][]): string[][] {
  const httpTrackers: string[][] = [];

  for (let i = 0; i < trackers.length; i++) {
    const tracker: string[] = trackers[i].filter((t: string) =>
      t.startsWith("http"),
    );
    if (tracker.length > 0) {
      httpTrackers.push(tracker);
    }
  }

  return httpTrackers;
}

export function downloadTorrent(torrentUrl: string): string {
  const path = generatePath(torrentUrl);
  https.get(torrentUrl, (res) => {
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

function convertUint8ArrayToString(data: unknown) {
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

function normalizeTorrentMeta(decodedTorrent): ttypes.TorrentMeta {
  const torrentMetaData = {} as ttypes.TorrentMeta;
  const info = {} as ttypes.Info;

  // Determine if the .torrent file have one or multiples files
  if (Object.prototype.hasOwnProperty.call(decodedTorrent?.info, "length")) {
    const file: ttypes.SingleFileMode = {
      name: decodedTorrent?.info?.name,
      length: decodedTorrent?.info?.length,
      md5sum: decodedTorrent?.info?.md5sum,
    };

    info.file = file;
  } else if (
    Object.prototype.hasOwnProperty.call(decodedTorrent?.info, "files")
  ) {
    const file: ttypes.MultiFileMode = {
      name: decodedTorrent?.info?.name,
      files: decodedTorrent?.info?.files.map((rawFile) => ({
        length: rawFile?.length,
        path: rawFile?.length,
        md5sum: rawFile?.md5sum,
      })),
    };
    info.file = file;
  } else {
    throw new Error("Torrent type unhandled");
  }

  info.pieceLength = decodedTorrent?.info["piece length"];
  info.pieces = decodedTorrent?.info?.pieces;
  info.private =
    parseInt(decodedTorrent?.info?.private, 10) === 1 ? true : false;

  torrentMetaData.announce = decodedTorrent.announce;
  torrentMetaData.announceList = decodedTorrent["announce-list"];

  torrentMetaData.announceList = filterNonHtppTrackers(
    torrentMetaData.announceList,
  );

  torrentMetaData.createdBy = decodedTorrent["created by"];
  torrentMetaData.creationDate = decodedTorrent["creation date"];
  torrentMetaData.encoding = decodedTorrent?.encoding;
  torrentMetaData.comment = decodedTorrent?.comment;
  torrentMetaData.info = info;

  return torrentMetaData;
}

export function getDecodedTorrentFile(torrentPath: string) {
  const torrent = fs.readFileSync(torrentPath);

  const decodedTorrent = normalizeTorrentMeta(
    convertUint8ArrayToString(bencode.decode(torrent)),
  );

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
