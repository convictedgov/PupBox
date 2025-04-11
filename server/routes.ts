import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOAD_KEY } from "../client/src/lib/constants";
import { generateFileId, getFileType, extractMetadata, generateThumbnail } from "./utils/file-helpers";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // Create the directory if it doesn't exist
        storage.ensureDirectories();
        cb(null, path.join(process.cwd(), 'uploads'));
      },
      filename: function (req, file, cb) {
        // Use the random ID as the filename
        const fileId = generateFileId();
        const extension = path.extname(file.originalname);
        cb(null, fileId + extension);
      }
    }),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
    }
  });

  // Get all files
  app.get("/api/files", async (req: Request, res: Response) => {
    try {
      const files = await storage.getFiles();
      res.json(files);
    } catch (error) {
      console.error("Error getting files:", error);
      res.status(500).json({ error: "Failed to retrieve files" });
    }
  });

  // Get file stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Failed to retrieve stats" });
    }
  });

  // Get a specific file
  app.get("/api/files/:id", async (req: Request, res: Response) => {
    try {
      const fileId = req.params.id;
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Increment views
      await storage.incrementViews(fileId);

      // Send the file
      const filePath = storage.getFilePath(fileId);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Content-Disposition", `inline; filename="${file.originalName}"`);
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error("Error getting file:", error);
      res.status(500).json({ error: "Failed to retrieve file" });
    }
  });

  // Get file thumbnail
  app.get("/api/files/:id/thumbnail", async (req: Request, res: Response) => {
    try {
      const fileId = req.params.id;
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      const thumbPath = storage.getThumbPath(fileId);
      
      // If thumbnail doesn't exist, generate it
      if (!fs.existsSync(thumbPath)) {
        const filePath = storage.getFilePath(fileId);
        const fileType = getFileType(file.originalName);
        
        if (fileType === 'image' || fileType === 'video') {
          await generateThumbnail(filePath, thumbPath, fileType);
        } else {
          // For non-media files, return a 404
          return res.status(404).json({ error: "Thumbnail not available" });
        }
      }

      // Send the thumbnail
      res.sendFile(thumbPath);
    } catch (error) {
      console.error("Error getting thumbnail:", error);
      res.status(500).json({ error: "Failed to retrieve thumbnail" });
    }
  });

  // Get file metadata
  app.get("/api/files/:id/metadata", async (req: Request, res: Response) => {
    try {
      const fileId = req.params.id;
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json(file);
    } catch (error) {
      console.error("Error getting metadata:", error);
      res.status(500).json({ error: "Failed to retrieve metadata" });
    }
  });

  // Download a file
  app.get("/api/download/:id", async (req: Request, res: Response) => {
    try {
      const fileId = req.params.id;
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Increment downloads
      await storage.incrementDownloads(fileId);

      // Send the file as an attachment
      const filePath = storage.getFilePath(fileId);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      // Set proper headers for file type and caching
      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.setHeader("Last-Modified", file.uploadedAt);
      
      // Add metadata headers
      res.setHeader("X-File-Name", file.originalName);
      res.setHeader("X-File-Size", file.size);
      res.setHeader("X-File-Type", file.mimeType);
      
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Upload a file
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      const uploadKey = req.body.uploadKey;

      // Validate upload key
      if (uploadKey !== UPLOAD_KEY) {
        // Delete the uploaded file if the key is invalid
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(401).json({ error: "Invalid upload key" });
      }

      // Validate file
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { originalname, filename, mimetype, size, path: filePath } = req.file;
      const fileId = path.parse(filename).name; // The filename without extension
      const fileType = getFileType(originalname);

      // Extract metadata based on file type
      const metadata = await extractMetadata(filePath, fileType);

      // Generate thumbnail for image and video files
      if (fileType === 'image' || fileType === 'video') {
        const thumbPath = storage.getThumbPath(fileId);
        await generateThumbnail(filePath, thumbPath, fileType);
      }

      // Save file info to storage
      const file = await storage.createFile({
        originalName: originalname,
        fileName: filename,
        mimeType: mimetype,
        size: size,
        uploadedAt: new Date(),
        metadata
      });

      // Return success response
      res.status(201).json({
        success: true,
        fileId: file.id,
        fileName: file.fileName,
        originalName: file.originalName,
        fileSize: file.size,
        url: `/api/files/${file.id}`,
        downloadUrl: `/api/download/${file.id}`
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      
      // Clean up the file if there was an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Delete a file
  app.delete("/api/files/:id", async (req: Request, res: Response) => {
    try {
      const fileId = req.params.id;
      const deleted = await storage.deleteFile(fileId);

      if (!deleted) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
