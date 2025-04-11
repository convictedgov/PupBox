import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 border-t border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/042/885/721/non_2x/cute-dog-looking-out-of-cardboard-box-illustration-free-png.png" 
              alt="PupBox Logo" 
              className="h-8 w-8 mr-2"
            />
            <span className="text-white font-medium">PupBox</span>
          </div>
          
          <div className="flex space-x-6">
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">Terms</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">Privacy</span>
            </Link>
            <Link href="/api">
              <span className="text-gray-400 hover:text-white cursor-pointer">API</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">Contact</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-4 text-center md:text-left text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PupBox. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
