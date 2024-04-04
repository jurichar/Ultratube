"use strict";
import fs from "node:fs/promises";
import ParseTorrent from "parse-torrent";

function generatePath(torrentUrl: string): string {
  const splitedUrl: string[] = torrentUrl.split("/");
  return `./torrents/metadata/${splitedUrl[splitedUrl.length - 1].toLowerCase()}`;
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
