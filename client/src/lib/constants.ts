export const UPLOAD_KEY = "Free-Uploading-tickles.dev";

export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  VIDEO: ['mp4', 'webm', 'ogg', 'mov'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  if (FILE_TYPES.IMAGE.includes(extension)) return 'image';
  if (FILE_TYPES.VIDEO.includes(extension)) return 'video';
  if (FILE_TYPES.DOCUMENT.includes(extension)) return 'document';
  if (FILE_TYPES.ARCHIVE.includes(extension)) return 'archive';
  
  return 'other';
};

export const getFileIcon = (fileType: string): string => {
  switch (fileType) {
    case 'image':
      return 'fa-image';
    case 'video':
      return 'fa-video';
    case 'document':
      return 'fa-file-alt';
    case 'pdf':
      return 'fa-file-pdf';
    case 'archive':
      return 'fa-file-archive';
    default:
      return 'fa-file';
  }
};

export const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  
  if (seconds < 10) return 'just now';
  
  return Math.floor(seconds) + ' seconds ago';
};
