export type FileAction = {
  file: File;
  fileName: string;
  fileSize: string;
  from: string;
  fileType: string;
  isError?: boolean;
  url?: string;
  output?: any;
  outputBlob?: Blob;
};

export enum VideoFormats {
  MP4 = "mp4",
  MKV = "mkv",
  AVI = "avi",
  MOV = "mov",
  FLV = "flv",
  WEBM = "webm",
}

export enum QualityType {
  Height = "15",
  Medium = "18",
  Low = "20",
}

export type VideoInputSettings = {
  quality: QualityType;
  videoType: VideoFormats;
  customEndTime: number;
  customStartTime: number;
  removeAudio: boolean;
  twitterCompressionCommand: boolean;
};
