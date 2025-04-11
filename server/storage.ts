import { FileWithMetadata, StatsData, FileMetadata } from "@shared/schema";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface IStorage {
  // File operations
  getFile(id: string): Promise<FileWithMetadata | undefined>;
  getFiles(): Promise<FileWithMetadata[]>;
  createFile(fileData: Omit<FileWithMetadata, 'id' | 'views' | 'downloads'>): Promise<FileWithMetadata>;
  updateFile(id: string, updates: Partial<FileWithMetadata>): Promise<FileWithMetadata | undefined>;
  deleteFile(id: string): Promise<boolean>;
  incrementViews(id: string): Promise<void>;
  incrementDownloads(id: string): Promise<void>;
  
  // Stats operations
  getStats(): Promise<StatsData>;
  
  // File system operations
  getFilePath(id: string): string;
  getThumbPath(id: string): string;
  ensureDirectories(): void;
}

export class MemStorage implements IStorage {
  private files: Map<string, FileWithMetadata>;
  private uploadsDir: string;
  private thumbsDir: string;
  
  constructor() {
    this.files = new Map();
    
    // Set up directories for file storage
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.thumbsDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    
    this.ensureDirectories();
  }
  
  ensureDirectories(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.thumbsDir)) {
      fs.mkdirSync(this.thumbsDir, { recursive: true });
    }
  }
  
  getFilePath(id: string): string {
    return path.join(this.uploadsDir, id);
  }
  
  getThumbPath(id: string): string {
    return path.join(this.thumbsDir, `${id}_thumb`);
  }
  
  async getFile(id: string): Promise<FileWithMetadata | undefined> {
    return this.files.get(id);
  }
  
  async getFiles(): Promise<FileWithMetadata[]> {
    return Array.from(this.files.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }
  
  async createFile(fileData: Omit<FileWithMetadata, 'id' | 'views' | 'downloads'>): Promise<FileWithMetadata> {
    const id = crypto.randomBytes(8).toString('hex');
    
    const newFile: FileWithMetadata = {
      id,
      ...fileData,
      views: 0,
      downloads: 0,
      uploadedAt: new Date().toISOString(),
    };
    
    this.files.set(id, newFile);
    return newFile;
  }
  
  async updateFile(id: string, updates: Partial<FileWithMetadata>): Promise<FileWithMetadata | undefined> {
    const file = this.files.get(id);
    
    if (!file) {
      return undefined;
    }
    
    const updatedFile = { ...file, ...updates };
    this.files.set(id, updatedFile);
    
    return updatedFile;
  }
  
  async deleteFile(id: string): Promise<boolean> {
    const deleted = this.files.delete(id);
    
    if (deleted) {
      // Clean up file from disk
      const filePath = this.getFilePath(id);
      const thumbPath = this.getThumbPath(id);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      } catch (error) {
        console.error('Error deleting file from disk:', error);
      }
    }
    
    return deleted;
  }
  
  async incrementViews(id: string): Promise<void> {
    const file = this.files.get(id);
    
    if (file) {
      file.views += 1;
      this.files.set(id, file);
    }
  }
  
  async incrementDownloads(id: string): Promise<void> {
    const file = this.files.get(id);
    
    if (file) {
      file.downloads += 1;
      this.files.set(id, file);
    }
  }
  
  async getStats(): Promise<StatsData> {
    const files = Array.from(this.files.values());
    
    return {
      totalFiles: files.length,
      totalDownloads: files.reduce((sum, file) => sum + file.downloads, 0),
      totalStorageUsed: files.reduce((sum, file) => sum + file.size, 0),
    };
  }
}

export const storage = new MemStorage();
