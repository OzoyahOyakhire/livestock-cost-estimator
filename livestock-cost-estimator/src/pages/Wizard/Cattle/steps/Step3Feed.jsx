import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function Step3Feed({ formData, update, onNext, onBack }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Feed & Nutrition</h2>
          <p className="text-gray-500 text-lg">Configure dietary costs and availability for more accurate growth predictions.</p>
        </div>

        <div className="space-y-8">
           <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Feed cost per kg (Optional override)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-sans">₦</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.45"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  value={formData.feedCost}
                  onChange={(e) => update({ feedCost: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Default market rate will be used if left blank.</p>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Supplement cost (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-sans">₦</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.15"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  value={formData.supplementCost}
                  onChange={(e) => update({ supplementCost: e.target.value })}
                />
              </div>
           </div>

           <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                 <div className="font-bold text-slate-900">Grazing Availability</div>
                 <div className="text-xs text-gray-500 mt-1">Is natural forage currently accessible?</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                 <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.grazingAvailability}
                    onChange={(e) => update({ grazingAvailability: e.target.checked })}
                 />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
           </div>

           {/* Labor and Electricity */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500">👥</span>
                    <h4 className="font-bold text-slate-900">Labor Cost</h4>
                 </div>
                 <p className="text-xs text-gray-500 mb-4">Monthly wages for farm assistants</p>
                 
                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center mb-1">
                    <span className="text-gray-400 font-bold mr-2">₦</span>
                    <input 
                      type="number"
                      value={formData.laborCost || ''}
                      onChange={(e) => update({ laborCost: e.target.value })}
                      placeholder="150000"
                      className="bg-transparent border-none outline-none text-xl font-bold text-slate-900 w-full"
                    />
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium">Default market rate will be used if left blank.</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500">⚡</span>
                    <h4 className="font-bold text-slate-900">Electricity Cost</h4>
                 </div>
                 <p className="text-xs text-gray-500 mb-4">Estimated monthly utility bill</p>
                 
                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center mb-1">
                    <span className="text-gray-400 font-bold mr-2">₦</span>
                    <input 
                      type="number"
                      value={formData.electricityCost || ''}
                      onChange={(e) => update({ electricityCost: e.target.value })}
                      placeholder="25000"
                      className="bg-transparent border-none outline-none text-xl font-bold text-slate-900 w-full"
                    />
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium">Default market rate will be used if left blank.</p>
              </div>
           </div>

           
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-gray-200 pt-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors px-4 py-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
