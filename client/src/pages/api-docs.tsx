import { useState, useEffect } from "react";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UPLOAD_KEY } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyAuth from "@/components/ApiKeyAuth";

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [activeCode, setActiveCode] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const codeExamples = {
    javascript: `const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('uploadKey', '${UPLOAD_KEY}');

fetch('/api/upload', {
  method: 'POST',
  body: form
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});`,
    python: `import requests

url = '/api/upload'
files = {'file': open('example.jpg', 'rb')}
data = {'uploadKey': '${UPLOAD_KEY}'}

response = requests.post(url, files=files, data=data)
print(response.json())`,
    curl: `curl -X POST \\
  -F "file=@example.jpg" \\
  -F "uploadKey=${UPLOAD_KEY}" \\
  /api/upload`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeCode as keyof typeof codeExamples]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if user is already authenticated from a previous session
  useEffect(() => {
    const authStatus = localStorage.getItem("pupbox_api_auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  // Save authentication status
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    localStorage.setItem("pupbox_api_auth", "authenticated");
  };

  if (!isAuthenticated) {
    return <ApiKeyAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section id="api" className="bg-black border border-gray-800 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white lowercase">api documentation</h2>
        
        <Tabs defaultValue="upload" onValueChange={setActiveTab}>
          <TabsList className="border-b border-gray-700 bg-transparent mb-4">
            <TabsTrigger 
              value="upload" 
              className={`${activeTab === 'upload' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'} pb-2 lowercase`}
            >
              upload
            </TabsTrigger>
            <TabsTrigger 
              value="download" 
              className={`${activeTab === 'download' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'} pb-2 lowercase`}
            >
              download
            </TabsTrigger>
            <TabsTrigger 
              value="metadata" 
              className={`${activeTab === 'metadata' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'} pb-2 lowercase`}
            >
              metadata
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className={`${activeTab === 'list' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'} pb-2 lowercase`}
            >
              list
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded mr-2">POST</span>
                  <h3 className="font-mono text-white lowercase">/api/upload</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigator.clipboard.writeText('/api/upload')}
                  className="text-gray-400 hover:text-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 mb-4 lowercase">upload a new file to the server with the required authentication key.</p>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">request</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
Content-Type: multipart/form-data

{`{
  "file": "(binary file data)",
  "uploadKey": "${UPLOAD_KEY}"
}`}</div>
              </div>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">response</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
{`{
  "success": true,
  "fileId": "6f7d2e5c8b9a",
  "fileName": "example.jpg",
  "originalName": "myimage.jpg",
  "fileSize": 1024576,
  "url": "/api/files/6f7d2e5c8b9a",
  "downloadUrl": "/api/download/6f7d2e5c8b9a"
}`}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2 lowercase">code example</h3>
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-2">
                    <Button 
                      variant={activeCode === "javascript" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveCode("javascript")}
                      className={activeCode === "javascript" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-300"}
                    >
                      javascript
                    </Button>
                    <Button 
                      variant={activeCode === "python" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveCode("python")}
                      className={activeCode === "python" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-300"}
                    >
                      python
                    </Button>
                    <Button 
                      variant={activeCode === "curl" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveCode("curl")}
                      className={activeCode === "curl" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-300"}
                    >
                      curl
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyCode}
                    className="text-gray-400 hover:text-primary"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
                  {codeExamples[activeCode as keyof typeof codeExamples]}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="download" className="py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded mr-2">GET</span>
                  <h3 className="font-mono text-white">/api/download/:fileId</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigator.clipboard.writeText('/api/download/:fileId')}
                  className="text-gray-400 hover:text-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 mb-4 lowercase">download a file by its id. the response will include the appropriate content-disposition header.</p>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">request</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
GET /api/download/6f7d2e5c8b9a</div>
              </div>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">response</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
Content-Type: [file MIME type]
Content-Disposition: attachment; filename="example.jpg"

[Binary File Data]</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded mr-2">GET</span>
                  <h3 className="font-mono text-white">/api/files/:fileId/metadata</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigator.clipboard.writeText('/api/files/:fileId/metadata')}
                  className="text-gray-400 hover:text-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 mb-4 lowercase">get metadata information for a specific file.</p>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">request</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
GET /api/files/6f7d2e5c8b9a/metadata</div>
              </div>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">response</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
{`{
  "id": "6f7d2e5c8b9a",
  "originalName": "example.jpg",
  "fileName": "6f7d2e5c8b9a.jpg",
  "mimeType": "image/jpeg",
  "size": 1024576,
  "uploadedAt": "2023-11-10T14:32:45.000Z",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "jpeg"
  },
  "views": 42,
  "downloads": 5
}`}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded mr-2">GET</span>
                  <h3 className="font-mono text-white">/api/files</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigator.clipboard.writeText('/api/files')}
                  className="text-gray-400 hover:text-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 mb-4 lowercase">get a list of all uploaded files.</p>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">request</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
GET /api/files</div>
              </div>
              
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 lowercase">response</h4>
                <div className="font-mono text-sm text-gray-400 whitespace-pre overflow-x-auto">
{`[
  {
    "id": "6f7d2e5c8b9a",
    "originalName": "example.jpg",
    "fileName": "6f7d2e5c8b9a.jpg",
    "mimeType": "image/jpeg",
    "size": 1024576,
    "uploadedAt": "2023-11-10T14:32:45.000Z",
    "views": 42,
    "downloads": 5
  },
  {
    "id": "8a9b7c6d5e4f",
    "originalName": "document.pdf",
    "fileName": "8a9b7c6d5e4f.pdf",
    "mimeType": "application/pdf",
    "size": 2048256,
    "uploadedAt": "2023-11-09T10:15:30.000Z",
    "views": 18,
    "downloads": 12
  }
]`}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default ApiDocs;
