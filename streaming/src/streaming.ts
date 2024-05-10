import fs from "node:fs";

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

export async function streamDirectly(path: string, range: string) {
  const stat = await fs.promises.stat(path);
  const size = stat.size;
  if (size) {

    const extension = path.split(".").pop();
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": size,
      "Content-Type": `video/${extension.match(/mp4|webm|ogg/) ? extension : "webm"}`,
      "Keep-alive": "timeout=10000",
    };
    const videoStream = fs.createReadStream(path, {
      start,
      end,
    });

    return { videoStream, headers };
  }
}
