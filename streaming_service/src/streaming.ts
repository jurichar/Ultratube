import torrentStream from "torrent-stream";
import fs from "node:fs";
import path from "node:path";

export const TORRENT_PATH = "./torrents";

export async function downloadMovie(
  magnetURI: string,
): Promise<TorrentStream.TorrentFile> {
  return new Promise((resolve) => {
    const engine = torrentStream(magnetURI, { path: TORRENT_PATH });
    let videoFile: TorrentStream.TorrentFile;

    engine.on("ready", () => {
      const file = engine.files.find((file) => file.name.endsWith(".mp4"));
      videoFile = file;
      videoFile.select();
    });

    engine.on("download", () => {
      const moviePath = path.join(TORRENT_PATH, videoFile.path);
      if (fs.existsSync(moviePath)) {
        if (fs.statSync(moviePath).size / (1024 * 1024) > 20) {
          resolve(videoFile);
        }
      }
    });

    engine.on("idle", () => {
      engine.destroy(() => {
        console.log("Video downloaded");
      });
    });
  });
}

export function getStreamingHeaders(
  range: string,
  videoFile: TorrentStream.TorrentFile,
) {
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const fileSize = videoFile.length;
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunksize = Number(end - start + 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4",
  };

  return headers;
}
