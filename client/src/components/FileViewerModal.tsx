import { Button } from "@/components/ui/button";
import { X, Download, Info } from "lucide-react";
import { FileType } from "@/types";
import { formatFileSize, getFileType } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileType;
  showMetadata: boolean;
  onToggleMetadata: () => void;
}

const FileViewerModal = ({ 
  isOpen, 
  onClose, 
  file, 
  showMetadata, 
  onToggleMetadata 
}: FileViewerModalProps) => {
  const { toast } = useToast();

  if (!isOpen) return null;

  const fileType = getFileType(file.originalName);
  
  const handleDownload = async () => {
    try {
      window.open(`/api/download/${file.id}`, '_blank');
      
      toast({
        title: "Download Started",
        description: `${file.originalName} is downloading.`
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col mx-4">
        <div className="bg-zinc-800 p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-white font-medium truncate" title={file.originalName}>
            {file.originalName}
          </h3>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" onClick={handleDownload} className="text-gray-400 hover:text-white">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggleMetadata} className="text-gray-400 hover:text-white">
              <Info className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="bg-zinc-950 flex-1 flex items-center justify-center relative">
          {fileType === 'image' && (
            <div className="max-h-[70vh] flex items-center justify-center p-4">
              <img 
                src={`/api/files/${file.id}`} 
                alt={file.originalName} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          
          {fileType === 'video' && (
            <div className="max-h-[70vh] w-full">
              <video controls className="max-w-full max-h-[70vh] mx-auto">
                <source src={`/api/files/${file.id}`} type={file.mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {fileType !== 'image' && fileType !== 'video' && (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl text-gray-500 mb-6">
                <i className={`fas fa-file-${fileType === 'pdf' ? 'pdf' : 'alt'}`}></i>
              </div>
              <p className="text-gray-400 mb-4">Preview not available for this file type</p>
              <Button 
                onClick={handleDownload}
                className="bg-primary hover:bg-indigo-500 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </div>
        
        {showMetadata && (
          <div className="bg-zinc-800 p-4 rounded-b-xl">
            <h4 className="text-white font-medium mb-3">File Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Filename</p>
                <p className="text-white">{file.originalName}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">File Size</p>
                <p className="text-white">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">File Type</p>
                <p className="text-white">{file.mimeType}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Uploaded</p>
                <p className="text-white">{formatDate(file.uploadedAt)}</p>
              </div>
              
              {file.metadata?.width && file.metadata?.height && (
                <div>
                  <p className="text-gray-400 mb-1">Dimensions</p>
                  <p className="text-white">{file.metadata.width} x {file.metadata.height} px</p>
                </div>
              )}
              
              {file.metadata?.duration && (
                <div>
                  <p className="text-gray-400 mb-1">Duration</p>
                  <p className="text-white">{Math.floor(file.metadata.duration)}s</p>
                </div>
              )}
              
              <div>
                <p className="text-gray-400 mb-1">Downloads</p>
                <p className="text-white">{file.downloads}</p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Views</p>
                <p className="text-white">{file.views}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewerModal;
