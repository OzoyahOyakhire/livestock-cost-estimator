import React from 'react';
import { MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Step1Production({ formData, update, onNext, onCancel }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Step 1 of 4</div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Production Setup</h2>
            <span className="text-sm font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">25% Complete</span>
          </div>
          <p className="text-gray-500">Define your initial production parameters to begin the lifecycle analysis.</p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Production Type</label>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button
                className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${formData.productionType === 'Beef' ? 'bg-white text-green-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => update({ productionType: 'Beef' })}
              >
                Beef
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Production System</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                value={formData.productionSystem}
                onChange={(e) => update({ productionSystem: e.target.value })}
              >
                <option value="Extensive">Extensive</option>
                <option value="Intensive">Intensive</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Number of Cattle</label>
              <input 
                type="number" 
                placeholder="e.g. 500"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                value={formData.numCattle}
                onChange={(e) => update({ numCattle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="City, Region or Country"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                  value={formData.location}
                  onChange={(e) => update({ location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Duration (Months)</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="number" 
                  placeholder="e.g. 18"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-12"
                  value={formData.duration}
                  onChange={(e) => update({ duration: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-900 mb-3">Geographical Context</label>
             <div className="w-full h-48 bg-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 relative z-10 shadow-sm border border-white/20">
                   <MapPin className="w-4 h-4 text-green-600" />
                   <span className="text-sm font-bold text-slate-800">Region verified via coordinates</span>
                </div>
             </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <button 
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm shadow-green-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>  
      </div>
    </div>
  );
}
