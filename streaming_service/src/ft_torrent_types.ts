interface InfoFile {
  length: number;
  path: string;
  md5sum?: string;
}

interface InfoMultiFiles {
  path: string;
  files: InfoFile[];
}

interface Info {
  files: InfoFile | InfoMultiFiles;
  name: string;
  pieceLength: number;
  pieces: string;
}

interface TorrentMeta {
  announce: string;
  announceList?: string[];
  comment?: string;
  createdBy?: string;
  info: Info;
  creationDate?: number;
  encoding?: string;
}
