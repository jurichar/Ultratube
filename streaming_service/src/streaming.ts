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
  const chunksize = 20e6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunksize, videoFile.length - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  return headers;
}
