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

export class FileStorage implements IStorage {
  private files: Map<string, FileWithMetadata>;
  private uploadsDir: string;
  private thumbsDir: string;
  private metadataFile: string;
  
  constructor() {
    this.files = new Map();
    
    // Set up directories for file storage
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.thumbsDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    this.metadataFile = path.join(process.cwd(), 'uploads', 'metadata.json');
    
    this.ensureDirectories();
    this.loadMetadata();
  }
  
  private loadMetadata(): void {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, 'utf8');
        const filesArray = JSON.parse(data) as FileWithMetadata[];
        
        // Clear existing map and reload from file
        this.files.clear();
        filesArray.forEach(file => {
          this.files.set(file.id, file);
        });
        
        console.log(`Loaded ${filesArray.length} files from metadata.`);
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  }
  
  private saveMetadata(): void {
    try {
      const filesArray = Array.from(this.files.values());
      fs.writeFileSync(this.metadataFile, JSON.stringify(filesArray, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
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
    // Generate a longer, more random ID
    const id = crypto.randomBytes(12).toString('hex');
    
    const newFile: FileWithMetadata = {
      id,
      ...fileData,
      views: 0,
      downloads: 0,
      uploadedAt: new Date(),
    };
    
    this.files.set(id, newFile);
    this.saveMetadata(); // Save to disk
    return newFile;
  }
  
  async updateFile(id: string, updates: Partial<FileWithMetadata>): Promise<FileWithMetadata | undefined> {
    const file = this.files.get(id);
    
    if (!file) {
      return undefined;
    }
    
    const updatedFile = { ...file, ...updates };
    this.files.set(id, updatedFile);
    this.saveMetadata(); // Save to disk
    
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
      
      this.saveMetadata(); // Save to disk
    }
    
    return deleted;
  }
  
  async incrementViews(id: string): Promise<void> {
    const file = this.files.get(id);
    
    if (file) {
      file.views += 1;
      this.files.set(id, file);
      this.saveMetadata(); // Save to disk
    }
  }
  
  async incrementDownloads(id: string): Promise<void> {
    const file = this.files.get(id);
    
    if (file) {
      file.downloads += 1;
      this.files.set(id, file);
      this.saveMetadata(); // Save to disk
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

export const storage = new FileStorage();
