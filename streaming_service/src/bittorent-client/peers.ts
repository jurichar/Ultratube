import net from "node:net";
import * as ttypes from "./ft_torrent_types.js";

const PROTOCOL_NAME = "BitTorrent protocol";
const PROTOCOL_LENGTH = PROTOCOL_NAME.length;

export function initPeerConnection(
  host: string,
  port: number,
  infoHash: Uint8Array,
  peerId: string,
): Promise<ttypes.PeerHandshake | Error> {
  const client = new net.Socket();

  return new Promise((resolve, reject) => {
    client.connect(port, host, () => {
      client.write(encodeHandshake(infoHash, peerId));
    });

    client.on("data", (chunk) => {
      resolve(decodeHandshake(chunk));
      client.destroy();
    });

    client.on("error", (error) => {
      reject(`Error tcp: ${error.message}`);
    });
  });
}

function encodeHandshake(infoHash: Uint8Array, peerId: string): Buffer {
  const protocolLength = Buffer.from([PROTOCOL_LENGTH]);
  const protocol = Buffer.from(PROTOCOL_NAME);
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

function decodeHandshake(rawHandshake: Buffer): ttypes.PeerHandshake {
  let offset = 0;

  const protocolLength = rawHandshake[0];
  offset += 1;

  const protocol = rawHandshake.subarray(offset, PROTOCOL_LENGTH).toString();
  offset += PROTOCOL_LENGTH;

  const reservedBytes = rawHandshake.subarray(offset, 8);
  offset += reservedBytes.length;

  const infoHash = rawHandshake.subarray(offset, offset + 20).toString("hex");
  offset += 20;

  const peerId = rawHandshake.subarray(offset, offset + 20).toString("hex");

  return {
    protocolLength,
    protocol,
    reservedBytes,
    infoHash,
    peerId,
  } as ttypes.PeerHandshake;
}
