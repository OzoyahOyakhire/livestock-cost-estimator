import React from 'react';
import { Box, Globe, Users, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-1 border-r border-transparent md:border-gray-100 pr-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-green-500 rounded p-1.5 flex items-center justify-center">
                   <Box className="w-5 h-5 text-white" strokeWidth={2.5}/>
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">LivestockIQ</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                 Precision investment platform for the future of livestock management.
              </p>
           </div>
           
           <div>
              <h4 className="font-bold text-slate-900 mb-6">Product</h4>
              <ul className="space-y-4">
                 <li><a href="#features" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Features</a></li>
                 <li><a href="#pricing" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Pricing</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Case Studies</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4">
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">About Us</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Careers</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Contact</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4">
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Terms of Service</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">Security</a></li>
              </ul>
           </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-gray-400 text-sm">© 2024 LivestockIQ Inc. All rights reserved.</p>
           <div className="flex items-center gap-4 text-gray-400">
              <Globe className="w-5 h-5 hover:text-gray-600 cursor-pointer transition-colors" />
              <Users className="w-5 h-5 hover:text-gray-600 cursor-pointer transition-colors" />
              <AtSign className="w-5 h-5 hover:text-gray-600 cursor-pointer transition-colors" />
           </div>
        </div>
      </div>
    </footer>
  );
}
