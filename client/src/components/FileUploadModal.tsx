import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, FolderOpen, CheckCircle, AlertCircle } from "lucide-react";
import { UPLOAD_KEY, formatFileSize } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const [uploadKey, setUploadKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "progress" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadStatus("idle");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    resetUpload();
    onClose();
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("error");
      setErrorMessage("Please select a file to upload.");
      return;
    }

    if (uploadKey !== UPLOAD_KEY) {
      setUploadStatus("error");
      setErrorMessage("Invalid upload key. Please try again.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("progress");
    setUploadProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadKey", uploadKey);

    try {
      // Simulating progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Make actual API request
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Upload failed");
      }

      // Set final progress and success state
      setUploadProgress(100);
      setUploadStatus("success");
      
      // Refetch files list
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      
      // Show success toast
      toast({
        title: "Upload Complete",
        description: "Your file has been uploaded successfully.",
      });

      // Reset and close modal after short delay
      setTimeout(() => {
        resetUpload();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-zinc-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Upload File</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="uploadKey" className="text-gray-300">Upload Key</Label>
            <Input 
              id="uploadKey"
              type="password" 
              placeholder="Enter your upload key" 
              value={uploadKey}
              onChange={(e) => setUploadKey(e.target.value)}
              className="mt-1 bg-zinc-800 border border-gray-700 text-white placeholder-gray-500"
            />
          </div>
          
          <div 
            className="border-2 border-dashed border-gray-700 bg-zinc-800 rounded-lg p-8 mb-4 text-center cursor-pointer hover:border-primary transition-colors"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Upload className="h-10 w-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300 mb-2">Drag and drop your file here</p>
            <p className="text-gray-500 text-sm mb-3">or</p>
            <Button className="bg-primary hover:bg-indigo-500 text-white font-medium">
              <FolderOpen className="h-4 w-4 mr-2" /> Browse Files
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {file && (
              <div className="mt-4 text-sm text-gray-300">
                Selected: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>
          
          {uploadStatus === "progress" && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Uploading...</span>
                <span className="text-gray-300">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 mb-2" />
              <div className="text-xs text-gray-500">
                {file?.name} - {formatFileSize(file ? (file.size * uploadProgress / 100) : 0)} / {formatFileSize(file?.size || 0)}
              </div>
            </div>
          )}
          
          {uploadStatus === "success" && (
            <div className="mb-4 bg-green-900/20 border border-green-800 text-green-400 rounded-lg p-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium">Upload Complete!</h3>
                  <p className="text-sm">Your file has been uploaded successfully.</p>
                </div>
              </div>
            </div>
          )}
          
          {uploadStatus === "error" && (
            <div className="mb-4 bg-red-900/20 border border-red-800 text-red-400 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium">Upload Failed</h3>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-gray-700 hover:bg-gray-800 text-gray-300 mr-2"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              className="bg-primary hover:bg-indigo-500 text-white"
              disabled={isUploading || !file}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
