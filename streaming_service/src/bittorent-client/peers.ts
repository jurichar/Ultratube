import net from "node:net";

export function initPeerConnection(
  host: string,
  port: number,
  infoHash: Uint8Array,
  peerId: string,
) {
  const client = new net.Socket();

  client.connect({ port: port, host: host }, () => {
    console.log("TCP connection etablished");

    client.write(generateHandshake(infoHash, peerId));
  });

  client.on("data", (chunk) => {
    console.log(`Data received from server: ${chunk}`);

    client.end();
  });

  client.on("end", () => {
    console.log("Requested an end to the TCP connection");
  });
}

function generateHandshake(infoHash: Uint8Array, peerId: string): Buffer {
  const protocolLength = Buffer.from([19]);
  const protocol = Buffer.from("BitTorrent protocol");
  const freeBytes = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
  const infoHashBuff = Buffer.from(infoHash);

  const peerIdBuff = Buffer.from(peerId);

  const totalLength =
    protocolLength.length +
    protocol.length +
    freeBytes.length +
    infoHashBuff.length +
    peerIdBuff.length;

  return Buffer.concat(
    [protocolLength, protocol, freeBytes, infoHashBuff, peerIdBuff],
    totalLength,
  );
}
