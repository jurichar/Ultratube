"use strict";
import fs from "node:fs/promises";
import https from "https";
import bencode from "bencode";
import * as ttypes from "./ft_torrent_types.js";
import parseTorrent from "parse-torrent";
import ParseTorrent from "parse-torrent";

function generatePath(torrentUrl: string): string {
  const splitedUrl: string[] = torrentUrl.split("/");
  return `./torrents/metadata/${splitedUrl[splitedUrl.length - 1].toLowerCase()}`;
}

function normalizeTorrentMeta(
  decodedMetadata: any,
  originalMetaData: any,
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
      files: decodedMetadata?.info?.files.map((rawFile: any) => ({
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

  torrentMetaData.createdBy = decodedMetadata["created by"];
  torrentMetaData.creationDate = decodedMetadata["creation date"];
  torrentMetaData.encoding = decodedMetadata?.encoding;
  torrentMetaData.comment = decodedMetadata?.comment;
  torrentMetaData.info = info;
  torrentMetaData.infoHash = originalMetaData.infoHashBuffer;

  return torrentMetaData;
}

export async function downloadTorrentMeta(torrentUrl: string) {
  const path = generatePath(torrentUrl);
  const response = await fetch(torrentUrl);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(path, Buffer.from(buffer));
  return path;
}

export async function parseTorrentMeta(torrentPath: string) {
  const torrent = await fs.readFile(torrentPath);
  console.log("My length boy: ", torrent.length);
  try {
    const metadata = ParseTorrent(torrent);
    return metadata;
  } catch (error) {
    console.error(error.message);
  }
}

export async function deleteTorrentMeta(torrentPath: string) {
  await fs.unlink(torrentPath);
}

function announceToMagnet(announce: string[]): string {
  let announceUrl = "";
  if (announce) {
    for (const tracker of announce) {
      announceUrl = announceUrl.concat(`&tr=${encodeURI(tracker)}`);
    }
  }
  return announceUrl;
}

export function generateMagnetURI(meta: any, source: string): string {
  return `magnet:?xt=urn:btih:${meta?.infoHash}&dn=${encodeURI(meta?.name)}${announceToMagnet(meta?.announce)}&xs=${encodeURI(source)}`;
}
