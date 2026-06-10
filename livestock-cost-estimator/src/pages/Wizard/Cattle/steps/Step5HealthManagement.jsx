import React from 'react';
import { ArrowLeft, ArrowRight, Shield, Stethoscope, Bug, Activity } from 'lucide-react';

export default function Step5HealthManagement({ formData, update, onSubmit, onBack }) {

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Veterinary & Health Management</h2>
        <div className="flex items-center justify-between mb-2">
           <p className="text-gray-500 text-sm">Estimate health-related costs and risks for your herd.</p>
           <span className="text-sm font-bold text-green-500">75% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
           <div className="h-full bg-green-500 w-[75%]"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
         
            
         <div className="flex justify-between text-xs font-medium text-gray-400">
            <span>1% (Beef Min)</span>
            <span>4% (Dairy Max)</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {/* Vaccination */}
         <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
               <Shield className="w-4 h-4 text-green-600" />
               <h3 className="font-bold text-slate-900">Vaccination Program</h3>
            </div>
            <div className="space-y-3">
               <label className={`block border p-4 rounded-lg cursor-pointer ${formData.vaccineProgram === 'Basic' ? 'border-green-500 bg-green-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                     <input type="radio" name="vaccine" checked={formData.vaccineProgram === 'Basic'} onChange={() => update({vaccineProgram: 'Basic'})} className="accent-green-500 w-4 h-4" />
                     <div>
                        <div className="font-bold text-sm text-slate-900">Basic</div>
                        <div className="text-xs text-gray-500">Core vaccinations only</div>
                     </div>
                  </div>
               </label>
               <label className={`block border p-4 rounded-lg cursor-pointer ${formData.vaccineProgram === 'Standard' ? 'border-green-500 ring-1 ring-green-500 bg-green-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                     <input type="radio" name="vaccine" checked={formData.vaccineProgram === 'Standard'} onChange={() => update({vaccineProgram: 'Standard'})} className="accent-green-500 w-4 h-4" />
                     <div className="flex-1">
                        <div className="flex items-center justify-between">
                           <div className="font-bold text-sm text-slate-900">Standard</div>
                           <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <div className="text-xs text-gray-500">Full annual protection suite</div>
                     </div>
                  </div>
               </label>
               <label className={`block border p-4 rounded-lg cursor-pointer ${formData.vaccineProgram === 'Intensive' ? 'border-green-500 bg-green-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                     <input type="radio" name="vaccine" checked={formData.vaccineProgram === 'Intensive'} onChange={() => update({vaccineProgram: 'Intensive'})} className="accent-green-500 w-4 h-4" />
                     <div>
                        <div className="font-bold text-sm text-slate-900">Intensive</div>
                        <div className="text-xs text-gray-500">Premium seasonal coverage</div>
                     </div>
                  </div>
               </label>
            </div>
         </div>

         <div className="space-y-6">
            {/* Vet Frequency */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
               <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                  <h3 className="font-bold text-slate-900">Vet Visit Frequency</h3>
               </div>
               <select 
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-green-500"
                  value={formData.vetFrequency}
                  onChange={(e) => update({vetFrequency: e.target.value})}
               >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                  <option value="Emergency Only">Emergency Only</option>
               </select>
            </div>

            {/* Parasite Control */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
               <div className="flex items-center gap-2 mb-4">
                  <Bug className="w-4 h-4 text-green-600" />
                  <h3 className="font-bold text-slate-900">Parasite Control</h3>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => update({parasiteControl: 'None'})} className={`py-2 text-sm font-medium rounded-lg border transition-colors ${formData.parasiteControl === 'None' ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>None</button>
                  <button onClick={() => update({parasiteControl: 'Occasional'})} className={`py-2 text-sm font-medium rounded-lg border transition-colors ${formData.parasiteControl === 'Occasional' ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Occasional</button>
                  <button onClick={() => update({parasiteControl: 'Regular'})} className={`py-2 text-sm font-medium rounded-lg border transition-colors ${formData.parasiteControl === 'Regular' ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Regular</button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
               <Activity className="w-4 h-4 text-green-600" />
               <h3 className="font-bold text-slate-900">Medication Intensity</h3>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
               <span>Low</span>
               <span>Medium</span>
               <span>High</span>
            </div>
            <div className="flex gap-1 mb-8">
               <div onClick={() => update({medicationIntensity: 'Low'})} className={`h-2 flex-1 rounded-l-full cursor-pointer ${['Low', 'Medium', 'High'].includes(formData.medicationIntensity) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
               <div onClick={() => update({medicationIntensity: 'Medium'})} className={`h-2 flex-1 cursor-pointer ${['Medium', 'High'].includes(formData.medicationIntensity) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
               <div onClick={() => update({medicationIntensity: 'High'})} className={`h-2 flex-1 rounded-r-full cursor-pointer ${['High'].includes(formData.medicationIntensity) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            </div>

            <div className="flex items-center gap-2 mb-4">
               <Activity className="w-4 h-4 text-green-600" /> {/* placeholder icon */}
               <h3 className="font-bold text-slate-900">Disease Risk Level</h3>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
               <button onClick={() => update({diseaseRisk: 'Low'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.diseaseRisk === 'Low' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-600 relative after:absolute after:right-0 after:-top-0 after:bottom-0 after:w-px after:bg-gray-200'}`}>Low</button>
               <button onClick={() => update({diseaseRisk: 'Medium'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.diseaseRisk === 'Medium' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-600 relative after:absolute after:right-0 after:-top-0 after:bottom-0 after:w-px after:bg-gray-200'}`}>Medium</button>
               <button onClick={() => update({diseaseRisk: 'High'})} className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.diseaseRisk === 'High' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-600'}`}>High</button>
            </div>
         </div>

      </div>

      <div className="border-t border-gray-200 py-6 mb-16 flex items-center justify-between">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors"
         >
           <ArrowLeft className="w-4 h-4" /> Back
         </button>
         <button 
           onClick={onSubmit}
           className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
         >
           Finish <ArrowRight className="w-4 h-4" />
         </button>
      </div>

      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 md:pl-80 flex items-center justify-between z-20">
         <div className="flex gap-8">
            <div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">EST. HEALTH COST</div>
               <div className="text-lg font-extrabold text-green-500">$1,240 / yr</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">HERD RISK SCORE</div>
               <div className="text-lg font-extrabold text-slate-900">Low-Mid</div>
            </div>
         </div>
         <div className="text-xs text-gray-400 hidden sm:block max-w-xs text-right">
            Estimates are based on regional averages and provided management intensity.
         </div>
      </div> */}
    </div>
  );
}
