import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileType, StatsType } from "@/types";
import StatsCard from "@/components/StatsCard";
import FileCard from "@/components/FileCard";
import { formatFileSize } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { File, Download, HardDrive, Search, LayoutGrid, List, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  // Fetch files
  const { 
    data: files = [], 
    isLoading: filesLoading,
    error: filesError
  } = useQuery<FileType[]>({
    queryKey: ["/api/files"],
  });

  // Fetch stats
  const { 
    data: stats,
    isLoading: statsLoading,
  } = useQuery<StatsType>({
    queryKey: ["/api/stats"],
  });

  const filteredFiles = files.filter((file) => 
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (fileId: string) => {
    window.open(`/api/download/${fileId}`, '_blank');
    
    const downloadedFile = files.find(f => f.id === fileId);
    if (downloadedFile) {
      toast({
        title: "download started",
        description: `${downloadedFile.originalName} is downloading.`
      });
    }
  };
  
  const handleView = (file: FileType) => {
    window.dispatchEvent(new CustomEvent('viewFile', { detail: file }));
  };

  useEffect(() => {
    const handleViewFile = (e: any) => {
      if (e.detail) {
        handleView(e.detail);
      }
    };

    window.addEventListener('viewFile', handleViewFile);
    return () => window.removeEventListener('viewFile', handleViewFile);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12 pt-8">
        <h1 className="text-4xl font-bold mb-4 text-white lowercase">simple, secure file hosting</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto lowercase">
          upload, share, and manage your files with ease. no database, just pure simplicity.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard 
          icon={<File className="h-6 w-6" />} 
          value={statsLoading ? "..." : stats?.totalFiles.toString() || "0"} 
          label="files hosted" 
          iconColor="primary"
        />
        <StatsCard 
          icon={<Download className="h-6 w-6" />} 
          value={statsLoading ? "..." : stats?.totalDownloads.toString() || "0"} 
          label="downloads" 
          iconColor="primary"
        />
        <StatsCard 
          icon={<HardDrive className="h-6 w-6" />} 
          value={statsLoading ? "..." : formatFileSize(stats?.totalStorageUsed || 0)} 
          label="storage used" 
          iconColor="primary"
        />
      </section>

      {/* Upload Button */}
      <section className="mb-12 flex justify-center">
        <Button 
          onClick={() => window.dispatchEvent(new CustomEvent('uploadFile'))}
          className="bg-primary hover:bg-indigo-500 text-white lowercase px-8 py-6 text-lg"
        >
          <Upload className="h-6 w-6 mr-3" />
          upload files
        </Button>
      </section>
      

    </div>
  );
};

export default Home;
