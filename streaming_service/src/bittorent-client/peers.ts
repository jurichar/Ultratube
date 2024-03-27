"use strict";
import net from "node:net";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import * as ttypes from "./ft_torrent_types.js";

enum PeerMessage {
  choke,
  unchoke,
  interested,
  notInterested,
  have,
  bitfield,
  request,
  piece,
  cancel,
}

export class Peer {
  ip: number;
  host: string;
  client: net.Socket;
  infoHash: Uint8Array;
  peerId: string;
  buffer: Buffer;
  bitfield: Buffer;
  pieceIndex: number;
  blockOffset: number;
  pieceLength: number;
  bufferBytesFilled: number;

  static PROTOCOL_NAME = "BitTorrent protocol";
  static PROTOCOL_LENGTH = 19;
  static BLOCK_MAX = 2 ** 14;

  constructor(
    ip: number,
    host: string,
    infoHash: Uint8Array,
    peerId: string,
    pieceLength: number,
  ) {
    this.ip = ip;
    this.host = host;
    this.infoHash = infoHash;
    this.peerId = peerId;
    this.pieceIndex = 0;
    this.blockOffset = 0;
    this.pieceLength = pieceLength;
    this.bufferBytesFilled = 0;
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
    const protocolLength = Buffer.from([Peer.PROTOCOL_LENGTH]);
    const protocol = Buffer.from(Peer.PROTOCOL_NAME);
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
      .subarray(offset, offset + Peer.PROTOCOL_LENGTH)
      .toString();
    offset += Peer.PROTOCOL_LENGTH;

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
      decodedHandshake.protocolLength !== Peer.PROTOCOL_LENGTH ||
      decodedHandshake.protocol !== Peer.PROTOCOL_NAME
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

  askForPieceBlock(blockSize: number) {
    const request = Buffer.alloc(17);
    request.writeUint32BE(13, 0);
    request.writeUint8(PeerMessage.request, 4);
    request.writeUint32BE(this.pieceIndex, 5);
    request.writeUint32BE(this.blockOffset, 9);
    request.writeUint32BE(blockSize, 13);
    this.client.write(request);

    this.blockOffset += blockSize;
  }

  handlePeerResponse(chunk: Buffer) {
    switch (chunk[4]) {
      case PeerMessage.unchoke: {
        console.log("unchoke");
        this.buffer = Buffer.alloc(this.pieceLength);
        const nbBlocks = this.pieceLength / Peer.BLOCK_MAX;
        console.log("nbBlocks", nbBlocks);
        for (let blockIndex = 0; blockIndex < 1; blockIndex++) {
          const blockSize =
            blockIndex === nbBlocks
              ? this.pieceLength % Peer.BLOCK_MAX
              : Peer.BLOCK_MAX;
          console.log(`Asking for piece ${blockIndex} of length ${blockSize}`);
          this.askForPieceBlock(blockSize);
        }
        break;
      }
      case PeerMessage.bitfield:
        console.log("bitfield");
        this.bitfield = chunk.subarray(5, chunk.length);
        break;
      case PeerMessage.piece: {
        console.log("piece");
        const payload = chunk.subarray(13);
        console.log("Payload: ", payload);
        console.log("Payload length: ", payload.length);
        // await fs.appendFile("./torrents/output.txt", payload);
        break;
      }
      case PeerMessage.have:
        console.log("MDRRRRRRR");
        break;
    }
  }

  async connect() {
    this.client = new net.Socket();

    this.client.on("data", this.handlePeerResponse.bind(this));
    this.client.on("error", this.handlePeerResponse.bind(this));

    this.client.connect(this.ip, this.host);
    this.client.setTimeout(2000);

    this.client.on("destroy", () => console.log("client closed"));
    await this.makeHandshake();
    // this.client.write(Buffer.from([0, 0, 0, 5, 2]));
  }
}
