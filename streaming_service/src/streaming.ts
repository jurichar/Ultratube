import torrentStream from "torrent-stream";
import fs from "node:fs";
import path from "node:path";

export const TORRENT_PATH = "./torrents";

export async function downloadMovie(
  magnetURI: string,
  trackers: string[],
): Promise<TorrentStream.TorrentFile> {
  return new Promise((resolve) => {
    const engine = torrentStream(magnetURI, {
      path: TORRENT_PATH,
      trackers: trackers,
    });
    let videoFile: TorrentStream.TorrentFile;

    engine.on("ready", () => {
      engine.files.forEach((file) => {
        if (file.name.endsWith(".mp4")) {
          videoFile = file;
          videoFile.select();
        } else {
          file.deselect();
        }
      });
    });

    engine.on("download", () => {
      const downloaded =
        Math.round((engine.swarm.downloaded / videoFile.length) * 100 * 100) /
        100;
      console.log("Downloaded: " + downloaded + "%");

      const moviePath = path.join(TORRENT_PATH, videoFile.path);
      if (fs.existsSync(moviePath)) {
        console.log("Movie path exist: ", moviePath);
        resolve(videoFile);
      }
    });

    // engine.on("idle", () => {
    //   engine.destroy(() => {
    //     console.log("Video downloaded");
    //   });
    // });
  });
}

export function getStreamingHeaders(
  range: string,
  videoFile: TorrentStream.TorrentFile,
) {
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoFile.length - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoFile.length}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4",
  };

  return headers;
}
