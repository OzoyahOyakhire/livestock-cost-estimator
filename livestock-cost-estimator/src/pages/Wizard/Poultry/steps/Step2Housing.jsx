import React from 'react';
import { Home, Lightbulb, Fan, Wind } from 'lucide-react';

export default function Step2Housing({ formData, update, onNext, onBack }) {
  const getSpacePerBird = () => {
     const type = formData.productionType;
     const system = formData.productionSystem;
     if (system === 'Deep Litter System') return type === 'Broiler' ? 0.125 : 0.33;
     if (system === 'Battery Cage System') return 0.055;
     if (system === 'Semi-Intensive') return type === 'Broiler' ? 2.15 : 4.33;
     if (system === 'Extensive') return type === 'Broiler' ? 10 : 20;
     return type === 'Broiler' ? 0.10 : 0.15;
  };
  const spacePerBird = getSpacePerBird();

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full bg-white md:my-10 md:rounded-3xl md:shadow-xl md:border md:border-gray-100">
      <div className="flex justify-between items-center mb-6">
         <div className="font-bold text-slate-900 text-3xl">Housing & Infrastructure</div>
         <div className="text-right">
            <div className="text-green-500 font-bold text-sm tracking-wide">Step 2 of 5</div>
            <div className="text-gray-400 font-medium text-xs mt-1">40% Complete</div>
         </div>
      </div>
      <p className="text-gray-500 text-lg mb-8">Configure your facility requirements</p>
      
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-12">
         <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }}></div>
      </div>

      <div className="space-y-10">
        <div>
           <label className="block font-bold text-xl text-slate-900 mb-6">Do you already have poultry housing?</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => update({ hasHousing: 'Yes' })}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${formData.hasHousing === 'Yes' ? 'border-green-500 bg-green-50/30 shadow-md text-green-700' : 'border-gray-200 hover:border-green-200 hover:bg-slate-50 text-slate-700'}`}
              >
                 <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-4">
                    <Home className="text-slate-400 w-6 h-6" />
                 </div>
                 <h4 className="font-bold text-lg mb-1">Yes, I have housing</h4>
                 <p className="text-sm text-gray-500">My infrastructure is already built and ready</p>
              </button>
              <button 
                onClick={() => update({ hasHousing: 'No' })}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${formData.hasHousing === 'No' ? 'border-green-500 bg-green-50/30 shadow-md text-green-700' : 'border-gray-200 hover:border-green-200 hover:bg-slate-50 text-slate-700'}`}
              >
                 <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-4">
                    <svg className="text-slate-400 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                 </div>
                 <h4 className="font-bold text-lg mb-1">No, I need to build</h4>
                 <p className="text-sm text-gray-500">I need estimates for constructing a new house</p>
              </button>
           </div>
        </div>

        {formData.hasHousing !== 'Yes' && (
          <>
            <div>
               <label className="block font-bold text-xl text-slate-900 mb-4">Preferred housing type</label>
               <div className="grid grid-cols-3 gap-4">
                  {['Wooden', 'Block / Concrete', 'Steel Structure'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => update({ housingType: type })}
                      className={`py-4 rounded-xl border-2 text-center font-bold text-sm transition-all ${formData.housingType === type ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 text-slate-700 hover:border-green-200'}`}
                    >
                      {type}
                    </button>
                  ))}
               </div>
            </div>

            <div>
               <label className="block font-bold text-xl text-slate-900 mb-4">Required Space (m²)</label>
               <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-400">📏</div>
                  <input 
                    type="number"
                    value={formData.housingCapacity}
                    onChange={(e) => update({ housingCapacity: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white border focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-slate-900 font-bold"
                  />
               </div>
               <p className="text-sm text-gray-400 mt-3">
                 Calculated automatically based on {formData.numBirds || 0} birds ({spacePerBird} m² per bird for {formData.productionSystem || 'Standard'} {formData.productionType || 'System'}). You can adjust this if needed.
               </p>
            </div>
          </>
        )}

        <div>
           <label className="block font-bold text-xl text-slate-900 mb-4">Infrastructure & Equipment available</label>
           <p className="text-sm text-gray-500 mb-6">Select the items you already have on-site</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                  { id: 'feeders', title: 'Automatic Feeders', desc: 'Mechanical feeding systems' },
                  { id: 'drinkers', title: 'Bell Drinkers', desc: 'Standard gravity waterers' },
                  { id: 'brooders', title: 'Gas Brooders', desc: 'Heating units for chicks' },
                  { id: 'fans', title: 'Ventilation Fans', desc: 'Airflow management units' }
              ].map(item => {
                 const isSelected = formData.infrastructure.includes(item.id);
                 return (
                    <label key={item.id} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 cursor-pointer hover:border-green-300 transition-colors bg-white shadow-sm">
                       <input 
                         type="checkbox" 
                         className="mt-1 w-5 h-5 rounded text-green-500 focus:ring-green-500 border-gray-300 pointer-events-none"
                         checked={isSelected}
                         onChange={() => {
                            if (isSelected) update({ infrastructure: formData.infrastructure.filter(i => i !== item.id) });
                            else update({ infrastructure: [...formData.infrastructure, item.id] });
                         }}
                       />
                       <div>
                          <div className="font-bold text-slate-900 text-sm mb-1">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                       </div>
                    </label>
                 );
              })}
           </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
        <button 
          onClick={onBack}
          className="px-8 py-3.5 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          Back
        </button>
        <button 
          onClick={onNext}
          className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
