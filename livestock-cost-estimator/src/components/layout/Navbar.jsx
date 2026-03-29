import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
     
          <Link to="/" className="flex items-center gap-2 z-50">
            <div className="bg-green-500 rounded p-1.5 flex items-center justify-center">
               <Box className="w-5 h-5 text-white" strokeWidth={2.5}/>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">LivestockIQ</span>
          </Link>

  
          {/* <div className="hidden md:flex flex-1 justify-center items-center gap-10">
             <a href="#how-it-works" className="text-gray-600 hover:text-green-500 font-medium transition-colors">How It Works</a>
             <a href="#features" className="text-gray-600 hover:text-green-500 font-medium transition-colors">Features</a>
             </div> */}

          <div className="hidden md:flex items-center gap-6">
             {user ? (
               <button 
                 onClick={logout}
                 className="flex items-center gap-2 text-slate-600 font-medium hover:text-red-600 transition-colors bg-slate-50 px-4 py-2 rounded-lg hover:bg-red-50"
               >
                 <LogOut size={18} />
                 Log Out
               </button>
             ) : (
               <>
                 <Link to="/login" className="text-gray-700 font-medium hover:text-slate-900 transition-colors">Log In</Link>
                 <Link to="/signup" className="text-green-600 font-bold hover:text-green-700">Join Free</Link>
               </>
             )}
             <Link to="/estimate" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm">Start Free Estimation</Link>
          </div>

          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-500 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>


      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl px-4 pt-2 pb-6 z-40">
          <div className="flex flex-col gap-2">
             <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-500 rounded-lg">How It Works</a>
             <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-500 rounded-lg">Features</a>
             <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-500 rounded-lg">Pricing</a>
             
             <div className="h-px bg-gray-100 my-2"></div>
             
             {user ? (
               <button 
                 onClick={() => {
                   logout();
                   setIsMobileMenuOpen(false);
                 }}
                 className="flex items-center gap-2 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
               >
                 <LogOut size={18} />
                 Log Out
               </button>
             ) : (
               <>
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-500 rounded-lg">Log In</Link>
                 <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-green-600 hover:bg-green-50 rounded-lg">Sign Up</Link>
               </>
             )}
             <Link to="/estimate" onClick={() => setIsMobileMenuOpen(false)} className="block mt-2 w-full text-center bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold shadow-md transition-colors">
               Start Free Estimation
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

