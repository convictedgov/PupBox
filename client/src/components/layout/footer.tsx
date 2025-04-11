import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/042/885/721/non_2x/cute-dog-looking-out-of-cardboard-box-illustration-free-png.png" 
              alt="pupbox logo" 
              className="h-6 w-6 mr-2"
            />
            <span className="text-white font-medium lowercase">pupbox</span>
          </div>
          
          <div className="flex space-x-6">
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer lowercase">terms</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer lowercase">privacy</span>
            </Link>
            <Link href="/api">
              <span className="text-gray-400 hover:text-white cursor-pointer lowercase">api</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer lowercase">contact</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-4 text-center md:text-left text-sm text-gray-500 lowercase">
          &copy; {new Date().getFullYear()} pupbox. all rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
