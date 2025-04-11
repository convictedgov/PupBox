import { FileWithMetadata, FileMetadata } from "@shared/schema";
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import crypto from 'crypto';

const exec = promisify(execCallback);

// Utility to determine file type
export const getFileType = (filename: string): string => {
  const extension = path.extname(filename).toLowerCase().substring(1);
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (documentExtensions.includes(extension)) return 'document';
  
  return 'other';
};

// Extract metadata from image files
export const extractImageMetadata = async (filePath: string): Promise<FileMetadata> => {
  try {
    // In a real implementation, we would use a library like sharp or image-size
    // For this demo, we'll use a simple approach that doesn't require external dependencies
    
    // Mock image metadata (in a real app, use a proper library)
    return {
      width: 1920,
      height: 1080,
      format: path.extname(filePath).substring(1)
    };
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    return {};
  }
};

// Extract metadata from video files
export const extractVideoMetadata = async (filePath: string): Promise<FileMetadata> => {
  try {
    // In a real implementation, we would use ffprobe from ffmpeg
    // For this demo, we'll return mock data
    
    // Mock video metadata (in a real app, use ffprobe)
    return {
      width: 1280,
      height: 720,
      duration: 125.5, // seconds
      format: path.extname(filePath).substring(1),
      bitrate: 2500000, // bits per second
      codec: 'h264'
    };
  } catch (error) {
    console.error('Error extracting video metadata:', error);
    return {};
  }
};

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { FileMetadata } from '@shared/schema';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

// Generate a thumbnail for an image or video
export const generateThumbnail = async (
  sourceFilePath: string, 
  destFilePath: string, 
  fileType: string
): Promise<boolean> => {
  try {
    // In a real implementation, we would use sharp for images and ffmpeg for videos
    // For this demo, we'll simply copy the file for images and use a placeholder for videos
    
    if (fileType === 'image') {
      // Copy the image file as thumbnail (in a real app, resize with sharp)
      fs.copyFileSync(sourceFilePath, destFilePath);
    } else if (fileType === 'video') {
      // For video, we would extract a frame at the 1s mark (in a real app, use ffmpeg)
      // Mock for now - copy a placeholder file
      fs.copyFileSync(sourceFilePath, destFilePath);
    } else {
      // For other file types, just return false
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return false;
  }
};

// Extract metadata based on file type
export const extractMetadata = async (filePath: string, fileType: string): Promise<FileMetadata> => {
  switch (fileType) {
    case 'image':
      return extractImageMetadata(filePath);
    case 'video':
      return extractVideoMetadata(filePath);
    default:
      return {};
  }
};

// Generate a random ID for files with more entropy
export const generateFileId = (): string => {
  return crypto.randomBytes(12).toString('hex');
};

// Generate a random filename
export const generateRandomFileName = (originalName: string): string => {
  const extension = path.extname(originalName);
  const randomPrefix = crypto.randomBytes(4).toString('hex');
  const timestamp = Date.now().toString(36);
  const randomSuffix = crypto.randomBytes(6).toString('hex');
  return `${randomPrefix}-${timestamp}-${randomSuffix}${extension}`;
};
