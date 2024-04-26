export async function downloadMovie(
  engine: any,
): Promise<TorrentStream.TorrentFile> {
  return new Promise((resolve, reject) => {
    let videoFile: TorrentStream.TorrentFile;

    engine.on("ready", () => {
      engine.files.forEach((file: TorrentStream.TorrentFile) => {
        const extension = file.name.split(".").pop();
        if (extension.match(/mp4|ogg|webm|mkv|mov|avi|ogg/)) {
          videoFile = file;
          resolve(videoFile);
        } else {
          file.deselect();
        }
        reject(new Error("Video file not found"));
      });
    });
  });
}
