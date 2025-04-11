import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileType, StatsType } from "@/types";
import StatsCard from "@/components/StatsCard";
import FileCard from "@/components/FileCard";
import { formatFileSize } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { File, Download, HardDrive, Search, LayoutGrid, List } from "lucide-react";
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
    error: statsError
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
        title: "Download Started",
        description: `${downloadedFile.originalName} is downloading.`
      });
    }
  };
  
  const handleView = (file: FileType) => {
    // This function will be passed up to App.tsx via props
    // to open the file viewer modal
    window.dispatchEvent(new CustomEvent('viewFile', { detail: file }));
  };

  useEffect(() => {
    // Listen for viewFile event from FileCard
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
        <h1 className="text-4xl font-bold mb-4 text-white">Simple, Secure File Hosting</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Upload, share, and manage your files with ease. No database, just pure simplicity.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard 
          icon={<File className="h-6 w-6" />} 
          value={statsLoading ? "..." : stats?.totalFiles.toString() || "0"} 
          label="Files Hosted" 
          iconColor="primary"
        />
        <StatsCard 
          icon={<Download className="h-6 w-6" />} 
          value={statsLoading ? "..." : stats?.totalDownloads.toString() || "0"} 
          label="Downloads" 
          iconColor="accent"
        />
        <StatsCard 
          icon={<HardDrive className="h-6 w-6" />} 
          value={statsLoading ? "..." : formatFileSize(stats?.totalStorageUsed || 0)} 
          label="Storage Used" 
          iconColor="secondary"
        />
      </section>

      {/* File Manager */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Recent Files</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={`border-gray-700 ${viewMode === 'grid' ? 'text-white bg-zinc-800' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" /> Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-gray-700 ${viewMode === 'list' ? 'text-white bg-zinc-800' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" /> List
            </Button>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search files..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-800 text-gray-300 border border-gray-700 w-40 h-9 text-sm"
              />
              <Search className="h-4 w-4 absolute right-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* File Grid */}
        {filesLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filesError ? (
          <div className="text-center py-20">
            <p className="text-red-400">Error loading files. Please try again.</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No files found{searchQuery ? " matching your search" : ""}.</p>
          </div>
        ) : (
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
        )}

        {files.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline"
              className="border border-gray-700 bg-zinc-800 hover:bg-zinc-700 text-gray-300"
            >
              Load More
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
