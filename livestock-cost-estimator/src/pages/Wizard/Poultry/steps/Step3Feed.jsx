import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function Step3Feed({ formData, update, onNext, onBack }) {
  const updateFeedPrices = (newPrices) => {
    const updated = { ...formData, ...newPrices };
    let total = 0;
    if (formData.productionType === 'Broiler') {
      const starter = Number(updated.broilerStarterPrice || 0);
      const finisher = Number(updated.broilerFinisherPrice || 0);
      total = Number((starter + finisher).toFixed(2));
    } else {
      const chick = Number(updated.chickStarterPrice || 0);
      const grower = Number(updated.growerFeedPrice || 0);
      const layer = Number(updated.layerFeedPrice || 0);
      total = Number((chick + grower + layer).toFixed(2));
    }
    update({ ...newPrices, totalFeedPrice: total });
  };

  React.useEffect(() => {
    if (!formData.overrideFeedPrice) {
      if (formData.productionType === 'Broiler') {
        update({
          broilerStarterPrice: '',
          broilerFinisherPrice: '',
          totalFeedPrice: 0
        });
      } else {
        update({
          chickStarterPrice: '',
          growerFeedPrice: '',
          layerFeedPrice: '',
          totalFeedPrice: 0
        });
      }
    } else {
      let total = 0;
      if (formData.productionType === 'Broiler') {
        const starter = Number(formData.broilerStarterPrice || 0);
        const finisher = Number(formData.broilerFinisherPrice || 0);
        total = Number((starter + finisher).toFixed(2));
      } else {
        const chick = Number(formData.chickStarterPrice || 0);
        const grower = Number(formData.growerFeedPrice || 0);
        const layer = Number(formData.layerFeedPrice || 0);
        total = Number((chick + grower + layer).toFixed(2));
      }
      if (formData.totalFeedPrice !== total) {
        update({ totalFeedPrice: total });
      }
    }
  }, [formData.productionType, formData.overrideFeedPrice]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full bg-white md:my-10 md:rounded-3xl md:shadow-xl md:border md:border-gray-100">
      <div className="space-y-6">
         {/* Feed Price inputs based on production type */}
         {formData.productionType === 'Broiler' ? (
            <div className="border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h4 className="font-bold text-slate-900 text-lg">Broiler Feed Prices (per 25kg bag)</h4>
                     <p className="text-sm text-gray-500">Enter pricing for each growth stage to compute the total feed cost. <span className="block mt-1 text-xs text-amber-600 font-medium">You can leave these fields blank if you don't know the exact price. Default market rates will be used.</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">MANUAL OVERRIDE</span>
                     <div 
                       onClick={() => update({ overrideFeedPrice: !formData.overrideFeedPrice })}
                       className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${formData.overrideFeedPrice ? 'bg-green-500' : 'bg-gray-300'}`}
                     >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${formData.overrideFeedPrice ? 'transform translate-x-6' : ''}`}></div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Broiler Starter (0–4 Weeks)</label>
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 font-bold mr-2">₦</span>
                        <input 
                          type="number"
                          value={formData.broilerStarterPrice}
                          onChange={(e) => updateFeedPrices({ broilerStarterPrice: e.target.value })}
                          placeholder="0"
                          disabled={!formData.overrideFeedPrice}
                          className="bg-transparent border-none outline-none text-lg font-bold text-slate-900 w-full disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                     </div>
                     <p className="text-[10px] text-gray-400 mt-1">Protein: 22–24% (Rapid growth)</p>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Broiler Finisher (4–8 Weeks)</label>
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 font-bold mr-2">₦</span>
                        <input 
                          type="number"
                          value={formData.broilerFinisherPrice}
                          onChange={(e) => updateFeedPrices({ broilerFinisherPrice: e.target.value })}
                          placeholder="0"
                          disabled={!formData.overrideFeedPrice}
                          className="bg-transparent border-none outline-none text-lg font-bold text-slate-900 w-full disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                     </div>
                     <p className="text-[10px] text-gray-400 mt-1">Protein: 18–20% + High energy (Weight gain)</p>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600">Total Feed Price:</span>
                  <span className="text-lg font-extrabold text-green-600">₦{formData.totalFeedPrice}</span>
               </div>
            </div>
         ) : (
            <div className="border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm bg-white">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h4 className="font-bold text-slate-900 text-lg">Layer Feed Prices (per 25kg bag)</h4>
                     <p className="text-sm text-gray-500">Enter pricing for each growth stage to compute the total feed cost. <span className="block mt-1 text-xs text-amber-600 font-medium">You can leave these fields blank if you don't know the exact price. Default market rates will be used.</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">MANUAL OVERRIDE</span>
                     <div 
                       onClick={() => update({ overrideFeedPrice: !formData.overrideFeedPrice })}
                       className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${formData.overrideFeedPrice ? 'bg-green-500' : 'bg-gray-300'}`}
                     >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${formData.overrideFeedPrice ? 'transform translate-x-6' : ''}`}></div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Chick Starter (0–8 Weeks)</label>
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 font-bold mr-2">₦</span>
                        <input 
                          type="number"
                          value={formData.chickStarterPrice}
                          onChange={(e) => updateFeedPrices({ chickStarterPrice: e.target.value })}
                          placeholder="0"
                          disabled={!formData.overrideFeedPrice}
                          className="bg-transparent border-none outline-none text-lg font-bold text-slate-900 w-full disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                     </div>
                     <p className="text-[10px] text-gray-400 mt-1">Protein: 18–22% (Feather development)</p>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Grower Mash (8–18 Weeks)</label>
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 font-bold mr-2">₦</span>
                        <input 
                          type="number"
                          value={formData.growerFeedPrice}
                          onChange={(e) => updateFeedPrices({ growerFeedPrice: e.target.value })}
                          placeholder="0"
                          disabled={!formData.overrideFeedPrice}
                          className="bg-transparent border-none outline-none text-lg font-bold text-slate-900 w-full disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                     </div>
                     <p className="text-[10px] text-gray-400 mt-1">Protein: 14–18% (Frame development)</p>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Layer Mash (18 Weeks+)</label>
                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 font-bold mr-2">₦</span>
                        <input 
                          type="number"
                          value={formData.layerFeedPrice}
                          onChange={(e) => updateFeedPrices({ layerFeedPrice: e.target.value })}
                          placeholder="0"
                          disabled={!formData.overrideFeedPrice}
                          className="bg-transparent border-none outline-none text-lg font-bold text-slate-900 w-full disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                     </div>
                     <p className="text-[10px] text-gray-400 mt-1">Protein: 16–18% + Calcium (Egg production)</p>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600">Total Feed Price:</span>
                  <span className="text-lg font-extrabold text-green-600">₦{formData.totalFeedPrice}</span>
               </div>
            </div>
         )}

         {/* Labor and Electricity */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">👥</span>
                  <h4 className="font-bold text-slate-900">Labor Cost</h4>
               </div>
               <p className="text-xs text-gray-500 mb-4">Monthly wages for farm assistants</p>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center mb-6">
                  <span className="text-gray-400 font-bold mr-2">₦</span>
                  <input 
                    type="number"
                    value={formData.laborCost}
                    onChange={(e) => update({ laborCost: Number(e.target.value) })}
                    className="bg-transparent border-none outline-none text-xl font-bold text-slate-900 w-full"
                  />
               </div>
               
            </div>

            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">⚡</span>
                  <h4 className="font-bold text-slate-900">Electricity Cost</h4>
               </div>
               <p className="text-xs text-gray-500 mb-4">Estimated monthly utility bill</p>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center mb-6">
                  <span className="text-gray-400 font-bold mr-2">₦</span>
                  <input 
                    type="number"
                    value={formData.electricityCost}
                    onChange={(e) => update({ electricityCost: Number(e.target.value) })}
                    className="bg-transparent border-none outline-none text-xl font-bold text-slate-900 w-full"
                  />
               </div>
            </div>
         </div>
      </div>

      <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          Back
        </button>
        <div className="flex gap-4">
           
           <button 
             onClick={onNext}
             className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30 flex items-center gap-2"
           >
             Next Step<span>→</span>
           </button>
        </div>
      </div>
    </div>
  );
}
