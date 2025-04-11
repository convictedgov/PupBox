import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Upload } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
}

const Header = ({ onUploadClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/042/885/721/non_2x/cute-dog-looking-out-of-cardboard-box-illustration-free-png.png" 
              alt="pupbox logo" 
              className="h-8 w-8"
            />
            <h1 className="text-xl font-semibold text-white lowercase">pupbox</h1>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Link href="/api">
            <span className="text-gray-300 hover:text-white cursor-pointer lowercase">
              api
            </span>
          </Link>
          
          <Button 
            onClick={onUploadClick}
            className="bg-primary hover:bg-indigo-500 text-white lowercase"
          >
            <Upload className="h-4 w-4 mr-2" />
            upload
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
