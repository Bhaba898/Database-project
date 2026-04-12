import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-blue-900 bg-black/80 backdrop-blur py-6 px-4 z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-black font-bold text-xs">
            E
          </div>
          <span className="text-blue-300 font-semibold tracking-tight">ExpenseTracker</span>
        </div>
        
        <p className="text-blue-400/80 text-sm">
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-blue-400">
          <a href="#" className="hover:text-blue-200 transition-colors cursor-pointer">
            <FiGithub size={20} />
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors cursor-pointer">
            <FiTwitter size={20} />
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors cursor-pointer">
            <FiLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
