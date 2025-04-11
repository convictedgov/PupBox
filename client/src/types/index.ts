export interface FileType {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  metadata?: FileMetadata;
  views: number;
  downloads: number;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  bitrate?: number;
  codec?: string;
  [key: string]: any;
}

export interface StatsType {
  totalFiles: number;
  totalDownloads: number;
  totalStorageUsed: number;
}

export interface UploadResponseType {
  success: boolean;
  fileId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  url: string;
  downloadUrl: string;
}
