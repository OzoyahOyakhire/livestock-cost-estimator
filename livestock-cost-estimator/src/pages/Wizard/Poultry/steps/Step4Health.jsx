import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function Step4Health({ formData, update, onNext, onBack }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full bg-white md:my-10 md:rounded-3xl md:shadow-xl md:border md:border-gray-100">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 4 of 5 - Veterinary & Health Management Cost</h2>
            <span className="text-green-500 font-bold text-sm tracking-wide">80%</span>
         </div>
         <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
         </div>
         <p className="text-gray-500 mb-10 text-sm">Account for uncertainty to build a resilient financial plan.</p>

         <div className="space-y-10">
            {/* Mortality Rate */}
            <div>
               <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-slate-900 flex items-center gap-2">Expected mortality rate (%) <Info className="w-4 h-4 text-gray-300" /></label>
                  <div className="px-3 py-1 bg-green-50 text-green-600 font-bold border border-green-200 rounded text-sm">{formData.expectedMortality}%</div>
               </div>
               <input 
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={formData.expectedMortality}
                  onChange={(e) => update({ expectedMortality: Number(e.target.value) })}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500 mb-2"
               />
               <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>0% (Ideal)</span>
                  <span>12.5%</span>
                  <span>25% (High Risk)</span>
               </div>
            </div>

            {/* Vaccination Program */}
            <div>
               <label className="block font-bold text-slate-900 mb-4">Vaccination Program</label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                     { id: 'Minimal', sub: 'BASIC COVERAGE' },
                     { id: 'Standard', sub: 'RECOMMENDED' },
                     { id: 'Intensive', sub: 'FULL BIO-SECURITY' }
                  ].map(prog => (
                     <button
                        key={prog.id}
                        onClick={() => update({ vaccineProgram: prog.id })}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${formData.vaccineProgram === prog.id ? 'border-green-500 bg-green-50/50 text-green-600 shadow-sm' : 'border-gray-200 text-slate-700 hover:border-green-300'}`}
                     >
                        <span className="font-bold text-sm mb-1">{prog.id}</span>
                        <span className={`text-[10px] font-bold tracking-wider ${formData.vaccineProgram === prog.id ? 'text-green-500' : 'text-gray-400'}`}>{prog.sub}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Vet Service Frequency */}
            <div>
               <label className="block font-bold text-slate-900 mb-4">Veterinary Service Frequency</label>
               <div className="relative">
                  <select
                     value={formData.vetFrequency}
                     onChange={(e) => update({ vetFrequency: e.target.value })}
                     className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:border-green-500 outline-none font-medium appearance-none shadow-sm"
                  >
                     <option value="Occasionally (Monthly checkups)">Occasionally (Monthly checkups)</option>
                     <option value="Regular (Bi-weekly)">Regular (Bi-weekly)</option>
                     <option value="Emergency Only">Emergency Only</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                     <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </div>
               </div>
            </div>

            {/* Med Intensity & Disease Risk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="block font-bold text-slate-900 mb-3">Medication Intensity</label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                     {['Low', 'Medium', 'High'].map(level => (
                        <button
                           key={level}
                           onClick={() => update({ medicationIntensity: level })}
                           className={`flex-1 py-2.5 text-sm font-bold transition-colors ${formData.medicationIntensity === level ? 'bg-green-500 text-white' : 'bg-white text-slate-600 hover:bg-gray-50 border-r last:border-0 border-gray-200'}`}
                        >
                           {level}
                        </button>
                     ))}
                  </div>
               </div>
               <div>
                  <label className="block font-bold text-slate-900 mb-3">Disease Risk Level</label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                     {['Low', 'Medium', 'High'].map(level => (
                        <button
                           key={level}
                           onClick={() => update({ diseaseRisk: level })}
                           className={`flex-1 py-2.5 text-sm font-bold transition-colors ${formData.diseaseRisk === level ? 'bg-green-500 text-white' : 'bg-white text-slate-600 hover:bg-gray-50 border-r last:border-0 border-gray-200'}`}
                        >
                           {level}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-12 flex justify-between items-center w-full gap-4">
            <button onClick={onBack} className="w-1/2 py-4 bg-slate-50 border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-all text-center shadow-sm">
              Previous Step
            </button>
            <button onClick={onNext} className="w-1/2 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all text-center shadow-md shadow-green-500/20">
              Next: Estimation
            </button>
         </div>
    </div>
  );
}
