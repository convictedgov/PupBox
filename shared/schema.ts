import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table is kept for reference, we're not using it for this application
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  metadata: text("metadata"), // JSON string of metadata
  views: integer("views").default(0).notNull(),
  downloads: integer("downloads").default(0).notNull(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  views: true,
  downloads: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

// Custom types for our in-memory storage
export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  bitrate?: number;
  codec?: string;
  [key: string]: any;
}

export interface FileWithMetadata extends Omit<File, 'metadata'> {
  metadata?: FileMetadata;
}

export interface StatsData {
  totalFiles: number;
  totalDownloads: number;
  totalStorageUsed: number;
}
