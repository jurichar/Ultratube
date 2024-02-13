async function downloadTorrent(torrentUrl: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(torrentUrl);

    if (!response.ok) {
      console.log("Error when downloading .torrent");
    }

    const torrentData = await response.arrayBuffer();

    return torrentData;
  } catch (e) {
    console.log(e.message);
  }
}

const torrentUrl: string =
  "https://torrents.yts.rs/torrent/download/CDC5A3E045636502C8D4485E547B2D45D3F2DF41";

console.log(await downloadTorrent(torrentUrl));
