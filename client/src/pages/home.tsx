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
      
      {/* Files Section */}
      <section className="mb-12">
        {filesLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filesError ? (
          <div className="text-center py-20">
            <p className="text-red-400 lowercase">error loading files. please try again.</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 lowercase">no files found{searchQuery ? " matching your search" : ""}.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-white lowercase">your files</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-gray-700 lowercase ${viewMode === 'grid' ? 'text-white bg-black' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" /> grid
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-gray-700 lowercase ${viewMode === 'list' ? 'text-white bg-black' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-1" /> list
                </Button>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="search files..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black text-gray-300 border border-gray-700 w-40 h-9 text-sm"
                  />
                  <Search className="h-4 w-4 absolute right-3 top-2.5 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col space-y-4"
            }>
              {filteredFiles.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  onView={handleView}
                  onDownload={handleDownload}
                />
              ))}
            </div>
            
            {files.length > 10 && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline"
                  className="border border-gray-700 bg-black hover:bg-zinc-900 text-gray-300 lowercase"
                >
                  load more
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
