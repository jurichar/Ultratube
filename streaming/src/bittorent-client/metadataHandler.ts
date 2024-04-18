"use strict";
import fs from "node:fs/promises";
import ParseTorrent from "parse-torrent";

function generatePath(torrentUrl: string): string {
  const splitedUrl: string[] = torrentUrl.split("/");
  return `./torrents/metadata/${splitedUrl[splitedUrl.length - 1].toLowerCase()}`;
}

async function downloadTorrentMeta(torrentUrl: string) {
  const path = generatePath(torrentUrl);
  try {
    const response = await fetch(torrentUrl);
    console.log(response);
    const buffer = await response.arrayBuffer();
    await fs.writeFile(path, Buffer.from(buffer));
  } catch (err) {
    console.log("errpr fetch", err);
  }
  return path;
}

async function parseTorrentMeta(torrentPath: string) {
  const torrent = await fs.readFile(torrentPath);
  try {
    const metadata = ParseTorrent(torrent);
    return metadata;
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteTorrentMeta(torrentPath: string) {
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

export async function getTorrentMetadata(torrentUrl: string) {
  const torrentPath = await downloadTorrentMeta(torrentUrl);
  const torrentMeta = parseTorrentMeta(torrentPath);
  await deleteTorrentMeta(torrentPath);
  return torrentMeta;
}

export function generateMagnetURI(meta: any, source: string): string {
  return `magnet:?xt=urn:btih:${meta?.infoHash}&dn=${encodeURI(meta?.name)}${announceToMagnet(meta?.announce)}&xs=${encodeURI(source)}`;
}
