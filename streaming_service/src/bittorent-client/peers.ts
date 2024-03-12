import net from "node:net";
import * as ttypes from "./ft_torrent_types.js";

const PROTOCOL_NAME = "BitTorrent protocol";
const PROTOCOL_LENGTH = 19;

function encodeHandshake(infoHash: Uint8Array, peerId: string): Buffer {
  const protocolLength = Buffer.from([PROTOCOL_LENGTH]);
  const protocol = Buffer.from(PROTOCOL_NAME);
  const freeBytes = Buffer.alloc(8);
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

  const protocol = rawHandshake
    .subarray(offset, offset + PROTOCOL_LENGTH)
    .toString();
  offset += PROTOCOL_LENGTH;

  const reservedBytes = rawHandshake.subarray(offset, offset + 8);
  offset += 8;

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

function isValidHandshake(
  infoHashHex: string,
  decodedHandshake: ttypes.PeerHandshake,
): boolean {
  return infoHashHex === decodedHandshake.infoHash;
}

export function initPeerConnection(
  host: string,
  port: number,
  infoHash: Uint8Array,
  infoHashHex: string,
  peerId: string,
): Promise<ttypes.PeerHandshake | Error> {
  const client = new net.Socket();

  return new Promise((_, reject) => {
    client.connect(port, host, () => {
      client.write(encodeHandshake(infoHash, peerId));
    });

    client.on("data", (chunk) => {
      if (chunk.length === 68) {
        const serverHandshake = decodeHandshake(chunk);
        if (!isValidHandshake(infoHashHex, serverHandshake)) {
          throw Error("Invalid handshake");
        }
        console.log("Server response to handshake", serverHandshake);
      } else {
        console.log("THIS IS ANOTHER MESSAGE FROM PEER id: ", chunk[4], chunk);
        if (chunk[4] === 5) {
          console.log("Bitfield spotted: ", chunk, chunk.length);
        } else if (chunk[4] === 1) {
          console.log("Unchoked received: ", chunk, chunk.length);
        } else {
          console.log("CHUNK: ", chunk, chunk.length);
        }
      }
      // client.destroy();
    });

    client.on("error", (error) => {
      reject(`Error tcp: ${error.message}`);
    });
  });
}
