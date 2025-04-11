import { FileType } from "@/types";
import { formatFileSize, getFileType, getTimeAgo } from "@/lib/constants";
import { Eye, Download, Info, Play } from "lucide-react";

interface FileCardProps {
  file: FileType;
  onView: (file: FileType) => void;
  onDownload: (fileId: string) => void;
}

const FileCard = ({ file, onView, onDownload }: FileCardProps) => {
  const fileType = getFileType(file.originalName);
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(file.id);
  };
  
  const handleView = () => {
    onView(file);
  };

  return (
    <div className="file-card bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-black cursor-pointer" onClick={handleView}>
        {fileType === 'image' && (
          <img 
            src={`/api/files/${file.id}/thumbnail`} 
            alt={file.originalName.toLowerCase()} 
            className="w-full h-full object-cover"
          />
        )}
        
        {fileType === 'video' && (
          <>
            <img 
              src={`/api/files/${file.id}/thumbnail`} 
              alt={file.originalName.toLowerCase()} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-primary bg-opacity-80 rounded-full flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
            </div>
          </>
        )}
        
        {fileType !== 'image' && fileType !== 'video' && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-5xl">
              <i className={`fas fa-file-${fileType === 'pdf' ? 'pdf' : 'alt'}`}></i>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className="bg-black text-xs font-medium px-2 py-1 rounded border border-gray-800">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium truncate text-white lowercase" title={file.originalName.toLowerCase()}>
            {file.originalName.toLowerCase()}
          </h3>
          <span className="text-xs text-gray-400 lowercase">
            {getTimeAgo(new Date(file.uploadedAt)).toLowerCase()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className="text-gray-400 hover:text-primary"
              onClick={handleView}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              className="text-gray-400 hover:text-primary"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              className="text-gray-400 hover:text-primary"
              onClick={handleView}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Eye className="h-3 w-3 mr-1" /> {file.views}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
