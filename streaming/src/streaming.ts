import torrentStream from "torrent-stream";

const TORRENT_PATH = "./torrents";

export async function downloadMovie(
  response: any,
  engine: any,
): Promise<TorrentStream.TorrentFile | string> {
  return new Promise((resolve, reject) => {
    let videoFile: TorrentStream.TorrentFile;

    engine.on("ready", () => {
      engine.files.forEach((file) => {
        const extension = file.name.split(".").pop();
        if (extension.match(/mp4|ogg|webm/)) {
          videoFile = file;
          resolve(videoFile);
        } else {
          file.deselect();
        }
        reject(new Error("Video file not found"))
      });
    });

    response.on("close", () => {
      engine.destroy();
      response.end();
    });
}
