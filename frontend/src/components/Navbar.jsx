import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiPieChart, FiDollarSign, FiFileText, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-black font-bold text-xl">
                E
              </div>
              <span className="font-bold text-xl tracking-tight text-white">ExpenseTracker</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-blue-200 hover:text-blue-600 transition-colors flex items-center gap-2">
              <FiPieChart /> Dashboard
            </Link>
            <Link to="/expenses" className="text-blue-200 hover:text-blue-600 transition-colors flex items-center gap-2">
              <FiDollarSign /> Expenses
            </Link>
            <Link to="/report" className="text-blue-200 hover:text-blue-600 transition-colors flex items-center gap-2">
              <FiFileText /> AI Report
            </Link>
            <button 
              onClick={logout}
              className="text-blue-200 hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-200 hover:text-white"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-blue-900 bg-black/95 backdrop-blur"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-blue-600 hover:bg-neutral-800">
                <FiPieChart className="inline mr-2"/> Dashboard
              </Link>
              <Link to="/expenses" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-blue-600 hover:bg-neutral-800">
                <FiDollarSign className="inline mr-2"/> Expenses
              </Link>
              <Link to="/report" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-blue-600 hover:bg-neutral-800">
                <FiFileText className="inline mr-2"/> AI Report
              </Link>
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-blue-400 hover:bg-neutral-800"
              >
                <FiLogOut className="inline mr-2"/> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
