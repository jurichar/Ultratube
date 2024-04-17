app.get("/download/:id", async (request, response) => {
  const { id: torrentId } = request.params;
  const streamingRanges = [];
  const hash = await getTorrentUrl(torrentId);
  const info = await parseTorrent(Buffer.from(hash, "hex"));
  const uri = toMagnetURI({
    infoHash: info.infoHash,
  });
  console.log("here info", info);

  const engine = torrentStream(uri, { path: "./torrents/" });
  let fileDl;
  engine.on("ready", async () => {
    const file = engine.files.find((file) => file.name.endsWith(".mp4"));
    if (!file) {
      response.status(404).send("Video file not found");
      return;
    }
    fileDl = file;
    const range = request.headers.range;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    // const stats = await fs.promises.stat("./torrents/" + fileDl.path);
    const fileSize = fileDl.length;
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    // check if file already exist if we only stream it  else  create read stream on le file
    fileDl.createReadStream({ start, end });
    try {
      await fs.promises.writeFile(`./torrents/${fileDl.path}`, "", {
        flag: "a+",
      });
    } catch (error) {}
  });
  let isStreaming = false;

  engine.on("idle", () => {
    console.log("end of downloading");
    // engine.destroy();
  });
  engine.on("download", async () => {
    console.log(Math.floor(engine.swarm.downloaded * fileDl.length) / 100);
    if (!isStreaming && engine.swarm.downloaded > 4936832) {
      const range = request.headers.range;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const stats = await fs.promises.stat("./torrents/" + fileDl.path);
      const fileSize = fileDl.length;
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const requestedRange = [start, end].join("-");
      if (streamingRanges.includes(requestedRange)) {
        console.log("Already streaming the requested range");
        return;
      }
      streamingRanges.push(requestedRange);
      const chunksize = Number(end - start + 1);
      const fileTmp = fs.createReadStream("./torrents/" + fileDl.path, {
        start: start,
        end: end,
      });
      // const fileTmp = fileDl.createReadStream({ start: start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
        "Keep-alive": "timeout=10000",
      };
      response.status(206).set(head);
      fileTmp.pipe(response);
      isStreaming = true;
    }
    response.on("close", () => {
      console.log("Connexion closed, stop streaming...");
      engine.destroy();
      response.end();
    });
  });
});