import React from 'react';
import { Box, Shield, Info } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-6 shrink-0 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/10 text-emerald-600 rounded-lg p-1.5 flex items-center justify-center transition-transform hover:scale-105 duration-200">
                <Box className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-base text-slate-800 tracking-tight">
                Livestock<span className="text-emerald-600">IQ</span>
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-200"></div>
            <p className="text-xs text-slate-400 font-medium">
              Precision livestock investment estimation platform.
            </p>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <span className="text-xs text-slate-400 font-medium">
              &copy; {currentYear} LivestockIQ. All rights reserved.
            </span>
           
          </div>
        </div>
      </div>
    </footer>
  );
}
