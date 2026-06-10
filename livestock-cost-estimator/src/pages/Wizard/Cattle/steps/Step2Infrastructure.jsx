import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

export default function Step2Infrastructure({ formData, update, onNext, onBack }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-xs font-bold tracking-widest text-green-500 uppercase">Step 2 of 4</div>
          <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">50% Complete</div>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full mb-6 relative overflow-hidden">
           <div className="absolute left-0 top-0 h-full bg-green-500 w-[50%]"></div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Infrastructure Details</h2>
        <p className="text-gray-500 text-lg">Tell us about your existing shelter and land setup to optimize your cattle estimation.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-8 mb-8">
        
        <div>
          <label className="block text-lg font-bold text-slate-900 mb-4">What is your housing/shelter situation?</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors ${formData.hasHousing === 'yes' ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:border-green-300'}`}
              onClick={() => update({ hasHousing: 'yes' })}
            >
              <div className="mt-1">
                {formData.hasHousing === 'yes' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Existing Housing</div>
                <div className="text-xs text-gray-500 mt-1">Ready for use</div>
              </div>
            </div>
            
            <div 
              className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors ${formData.hasHousing === 'no' ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:border-green-300'}`}
              onClick={() => update({ hasHousing: 'no' })}
            >
              <div className="mt-1">
                {formData.hasHousing === 'no' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Need to Build</div>
                <div className="text-xs text-gray-500 mt-1">Requires planning</div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors ${formData.hasHousing === 'not_required' ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:border-green-300'}`}
              onClick={() => update({ hasHousing: 'not_required' })}
            >
              <div className="mt-1">
                {formData.hasHousing === 'not_required' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Not Required</div>
                <div className="text-xs text-gray-500 mt-1">Extensive / Open Pasture</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {formData.hasHousing === 'no' && (
             <>
               <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">Primary Building Material</label>
                 <select 
                   className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                   value={formData.buildingMaterial || 'Standard Steel'}
                   onChange={(e) => update({ buildingMaterial: e.target.value })}
                 >
                   <option value="Simple Wood">Simple Wood & Roofing</option>
                   <option value="Standard Steel">Standard Steel & Corrugated Iron</option>
                   <option value="Permanent Concrete">Permanent Concrete & Galvanized Steel</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">Fencing Type</label>
                 <select 
                   className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                   value={formData.fencingType || 'Barbed Wire'}
                   onChange={(e) => update({ fencingType: e.target.value })}
                 >
                   <option value="Barbed Wire">4-Strand Barbed Wire</option>
                   <option value="Electric">High Tensile Electric</option>
                   <option value="Wooden Rail">Wooden Railing</option>
                 </select>
               </div>
             </>
           )}
           <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Total Farm Size</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="e.g. 50"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-16 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  value={formData.farmSize || ''}
                  onChange={(e) => update({ farmSize: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium font-sans text-sm">Acres</span>
              </div>
           </div>
          
           <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Primary Water Source</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                value={formData.waterSource || 'Borehole / Deep Well'}
                onChange={(e) => update({ waterSource: e.target.value })}
              >
                <option value="Borehole / Deep Well">Borehole / Deep Well</option>
                <option value="Natural River / Dam">Natural River / Dam</option>
                <option value="Municipal Water Line">Municipal Water Line</option>
              </select>
           </div>
        </div>

     

      </div>

      <div className="flex items-center justify-between mt-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors bg-white border border-gray-200 px-6 py-3 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Previous Step
        </button>
        <button 
          onClick={onNext}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
        >
          Continue to Health Management <ArrowRight className="w-4 h-4" />
        </button>
      </div>


    </div>
  );
}
