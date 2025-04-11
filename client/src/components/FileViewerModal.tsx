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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-95">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col mx-4">
        <div className="bg-black p-4 border-b border-gray-800 rounded-t-lg flex justify-between items-center">
          <h3 className="text-white font-medium truncate lowercase" title={file.originalName.toLowerCase()}>
            {file.originalName.toLowerCase()}
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
        
        <div className="bg-black flex-1 flex items-center justify-center relative">
          {fileType === 'image' && (
            <div className="max-h-[70vh] flex items-center justify-center p-4">
              <img 
                src={`/api/files/${file.id}`} 
                alt={file.originalName.toLowerCase()} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          
          {fileType === 'video' && (
            <div className="max-h-[70vh] w-full">
              <video controls className="max-w-full max-h-[70vh] mx-auto">
                <source src={`/api/files/${file.id}`} type={file.mimeType} />
                your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {fileType !== 'image' && fileType !== 'video' && (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl text-gray-500 mb-6">
                <i className={`fas fa-file-${fileType === 'pdf' ? 'pdf' : 'alt'}`}></i>
              </div>
              <p className="text-gray-400 mb-4 lowercase">preview not available for this file type</p>
              <Button 
                onClick={handleDownload}
                className="bg-primary hover:bg-indigo-500 text-white lowercase"
              >
                <Download className="h-4 w-4 mr-2" />
                download to view
              </Button>
            </div>
          )}
        </div>
        
        {showMetadata && (
          <div className="bg-black p-4 border-t border-gray-800 rounded-b-lg">
            <h4 className="text-white font-medium mb-3 lowercase">file information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1 lowercase">filename</p>
                <p className="text-white lowercase">{file.originalName.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1 lowercase">file size</p>
                <p className="text-white lowercase">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1 lowercase">file type</p>
                <p className="text-white lowercase">{file.mimeType.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1 lowercase">uploaded</p>
                <p className="text-white lowercase">{formatDate(file.uploadedAt).toLowerCase()}</p>
              </div>
              
              {file.metadata?.width && file.metadata?.height && (
                <div>
                  <p className="text-gray-400 mb-1 lowercase">dimensions</p>
                  <p className="text-white lowercase">{file.metadata.width} x {file.metadata.height} px</p>
                </div>
              )}
              
              {file.metadata?.duration && (
                <div>
                  <p className="text-gray-400 mb-1 lowercase">duration</p>
                  <p className="text-white lowercase">{Math.floor(file.metadata.duration)}s</p>
                </div>
              )}
              
              <div>
                <p className="text-gray-400 mb-1 lowercase">downloads</p>
                <p className="text-white lowercase">{file.downloads}</p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1 lowercase">views</p>
                <p className="text-white lowercase">{file.views}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewerModal;
