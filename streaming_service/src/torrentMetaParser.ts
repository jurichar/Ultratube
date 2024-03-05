import * as fs from "fs";
import https from "https";
import bencode from "bencode";
import * as ttypes from "./ft_torrent_types.js";
import parseTorrent from "parse-torrent";

function generatePath(torrentUrl: string): string {
  const splitedUrl: string[] = torrentUrl.split("/");
  return `./torrents/metadata/${splitedUrl[splitedUrl.length - 1].toLowerCase()}`;
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

export async function downloadTorrentMeta(torrentUrl: string): Promise<string> {
  const path = generatePath(torrentUrl);

  return new Promise((resolve, reject) => {
    https.get(torrentUrl, (response) => {
      response.on("data", (chunk) => {
        fs.appendFileSync(path, chunk);
      });

      response.on("end", () => {
        resolve(path);
      });

      response.on("error", (err: Error) => {
        reject(err.message);
      });
    });
  });
}

function normalizeTorrentMeta(
  decodedMetadata,
  originalMetaData,
): ttypes.TorrentMeta {
  const torrentMetaData = {} as ttypes.TorrentMeta;
  const info = {} as ttypes.Info;

  // Determine if the .torrent file have one or multiples files
  if (Object.prototype.hasOwnProperty.call(decodedMetadata?.info, "length")) {
    const file: ttypes.SingleFileMode = {
      name: decodedMetadata?.info?.name,
      length: decodedMetadata?.info?.length,
      md5sum: decodedMetadata?.info?.md5sum,
    };

    info.file = file;
  } else if (
    Object.prototype.hasOwnProperty.call(decodedMetadata?.info, "files")
  ) {
    const file: ttypes.MultiFileMode = {
      name: decodedMetadata?.info?.name,
      files: decodedMetadata?.info?.files.map((rawFile) => ({
        length: rawFile?.length,
        path: rawFile?.length,
        md5sum: rawFile?.md5sum,
      })),
    };
    info.file = file;
  } else {
    throw new Error("Torrent type unhandled");
  }

  info.pieceLength = decodedMetadata?.info["piece length"];
  info.pieces = originalMetaData.pieces;
  info.piecesBuffer = originalMetaData.info.pieces;
  info.private =
    parseInt(decodedMetadata?.info?.private, 10) === 1 ? true : false;

  torrentMetaData.announce = decodedMetadata.announce;
  torrentMetaData.announceList = decodedMetadata["announce-list"];

  if (torrentMetaData.announceList) {
    torrentMetaData.announceList = filterNonHtppTrackers(
      torrentMetaData.announceList,
    );
  }

  torrentMetaData.createdBy = decodedMetadata["created by"];
  torrentMetaData.creationDate = decodedMetadata["creation date"];
  torrentMetaData.encoding = decodedMetadata?.encoding;
  torrentMetaData.comment = decodedMetadata?.comment;
  torrentMetaData.info = info;
  torrentMetaData.infoHash = originalMetaData.infoHashBuffer;

  return torrentMetaData;
}

export async function parseTorrentMeta(
  torrentPath: string,
): Promise<ttypes.TorrentMeta> {
  const torrent = fs.readFileSync(torrentPath);
  const parsed = await parseTorrent(torrent);

  const decodedTorrent = normalizeTorrentMeta(
    bencode.decode(torrent, "utf-8"),
    parsed,
  );

  return decodedTorrent;
}

export function deleteTorrentMeta(torrentPath: string) {
  fs.unlink(torrentPath, (error) => {
    if (error) {
      if (error.code === "EOENT") {
        console.error("File doesn't exist");
      } else {
        throw error;
      }
    }
  });
}