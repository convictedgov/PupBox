import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import ApiDocs from "@/pages/api-docs";
import { useState } from "react";
import FileUploadModal from "@/components/FileUploadModal";
import FileViewerModal from "@/components/FileViewerModal";
import { FileType } from "@/types";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/api" component={ApiDocs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileType | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const openViewerModal = (file: FileType) => {
    setCurrentFile(file);
    setIsViewerModalOpen(true);
    setShowMetadata(false);
  };

  const closeViewerModal = () => {
    setIsViewerModalOpen(false);
    setCurrentFile(null);
  };

  const toggleMetadata = () => {
    setShowMetadata(!showMetadata);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header onUploadClick={openUploadModal} />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>

      <FileUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={closeUploadModal} 
      />

      {currentFile && (
        <FileViewerModal
          isOpen={isViewerModalOpen}
          onClose={closeViewerModal}
          file={currentFile}
          showMetadata={showMetadata}
          onToggleMetadata={toggleMetadata}
        />
      )}

      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
