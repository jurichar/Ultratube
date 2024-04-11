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
        const extension = file.name.split(".").pop();
        if (extension.match(/mp4|ogg|webm/)) {
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
