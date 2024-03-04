interface File {
  path: string[] | string;
  length: number;
  md5sum?: string;
}

export interface SingleFileMode {
  name: string;
  length: number;
  md5sum?: string;
}

export interface MultiFileMode {
  name: string;
  files: File[];
}

export interface Info {
  pieceLength: number;
  piecesBuffer: Uint8Array;
  pieces: string[];
  private?: boolean;
  file: SingleFileMode | MultiFileMode;
}

export interface TorrentMeta {
  announce: string;
  announceList?: string[][];
  comment?: string;
  createdBy?: string;
  info: Info;
  creationDate?: number;
  encoding?: string;
  infoHash: Uint8Array;
}

interface Peer {
  peerId: string;
  ip: string;
  port: number;
}

export interface TrackerResponse {
  failureReason?: string;
  warningMessage?: string;
  interval: number;
  intervalMin: number;
  trackerId?: string;
  complete: number;
  incomplete: number;
  peers: Peer[];
}
