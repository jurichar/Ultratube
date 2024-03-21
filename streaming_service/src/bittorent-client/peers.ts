"use strict";
import net from "node:net";
import * as ttypes from "./ft_torrent_types.js";

const PROTOCOL_NAME = "BitTorrent protocol";
const PROTOCOL_LENGTH = 19;

enum PeerMessage {
  choke = 0,
  unchoke = 1,
  interested = 2,
  notInterested = 3,
  have = 4,
  bitfield = 5,
  request = 6,
  piece = 7,
  cancel = 8,
}

export class Peer {
  ip: number;
  host: string;
  client: net.Socket;
  infoHash: Uint8Array;
  peerId: string;
  buffer: Buffer;
  bitfield: Buffer;

  constructor(ip: number, host: string, infoHash: Uint8Array, peerId: string) {
    this.ip = ip;
    this.host = host;
    this.infoHash = infoHash;
    this.peerId = peerId;
  }

  async waitForData(): Promise<Buffer> {
    return new Promise((resolve) => {
      const onData = (data: Buffer) => {
        this.client.removeListener("data", onData);
        resolve(data);
      };
      this.client.addListener("data", onData);
    });
  }

  encodeHandshake(infoHash: Uint8Array, peerId: string): Buffer {
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

  decodeHandshake(rawHandshake: Buffer): ttypes.PeerHandshake {
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

  isValidHandshake(
    infoHashHex: string,
    decodedHandshake: ttypes.PeerHandshake,
  ): boolean {
    return !(
      infoHashHex !== decodedHandshake.infoHash ||
      decodedHandshake.protocolLength !== PROTOCOL_LENGTH ||
      decodedHandshake.protocol !== PROTOCOL_NAME
    );
  }

  async makeHandshake() {
    this.client.write(this.encodeHandshake(this.infoHash, this.peerId));

    const response = await this.waitForData();
    const infoHash = Buffer.from(this.infoHash).toString("hex");
    if (!this.isValidHandshake(infoHash, this.decodeHandshake(response))) {
      throw new Error("Invalid handshake");
    } else {
      console.log("Handshake done!");
    }
  }

  handleError(error: string) {
    console.error(`Error: ${error}`);
    this.client.destroy();
  }

  handlePeerResponse(chunk: Buffer) {
    console.log("Chunk: ", chunk);
    switch (chunk[4]) {
      case PeerMessage.unchoke: {
        console.log("unchoke");
        const request = Buffer.alloc(17);
        request.writeUint32BE(13);
        request.writeUint8(6, 4);
        request.writeUint32BE(0, 5);
        request.writeUint32BE(0, 9);
        request.writeUint32BE(2 ** 14, 13);
        this.client.write(request);
        break;
      }
      case PeerMessage.bitfield:
        console.log("bitfield");
        this.bitfield = chunk.subarray(5, chunk.length);
        break;
      case PeerMessage.piece:
        console.log("piece");
        // save piece
        break;
    }
  }

  async connect() {
    this.client = new net.Socket();
    this.client.connect(this.ip, this.host);
    this.client.setTimeout(2000);

    this.client.on("data", this.handlePeerResponse.bind(this));
    this.client.on("error", this.handlePeerResponse.bind(this));

    this.client.on("destroy", () => console.log("client closed"));
    await this.makeHandshake();
    this.client.write(Buffer.from([0, 0, 0, 5, 2]));
  }
}
