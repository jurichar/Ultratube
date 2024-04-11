import torrentStream from "torrent-stream";

const TORRENT_PATH = "./torrents";

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
          resolve(videoFile);
        } else {
          file.deselect();
        }
      });
    });

    engine.on("idle", () => {
      engine.destroy(() => {});
    });
  });
}
