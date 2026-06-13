import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Droplet, Tractor, CheckCircle2, X } from 'lucide-react';
import { estimationApi } from '../../api/estimationApi';
import toast from 'react-hot-toast';

export default function EstimationSetup() {
  const [selected, setSelected] = useState('poultry');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      setIsCreating(true);
      const data = await estimationApi.create({ livestockType: selected });
      // Navigate to the next step, passing the estimation ID in state
      navigate(`/estimate/${selected}`, { state: { estimationId: data?.estimation?._id || data?._id || data?.id } });
    } catch (error) {
      toast.error('Failed to create estimation. Please try again.');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
       {/* Top Header */}
       {/* <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 rounded p-1 flex items-center justify-center">
               <Box className="w-5 h-5 text-white" strokeWidth={2.5}/>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">LivestockIQ</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
             <span className="hover:text-green-500 cursor-pointer">Dashboard</span>
             <span className="text-green-500 cursor-pointer">Estimations</span>
             <span className="hover:text-green-500 cursor-pointer">Reports</span>
             <span className="hover:text-green-500 cursor-pointer">Settings</span>
             <div className="w-8 h-8 rounded-full bg-orange-200 ml-4"></div>
          </div>
       </header> */}

       <div className="max-w-4xl mx-auto pt-16 px-4">
          <div className="text-center mb-16">
             <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">New Estimation Wizard</h1>
             <p className="text-lg text-gray-500">Select your livestock category to begin the profit prediction and cost analysis process.</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto relative">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 z-0"></div>
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-[2px] bg-green-500 z-0"></div>
             
             <div className="flex justify-between w-full z-10">
                <div className="flex flex-col items-center bg-slate-50 px-2 transition-all">
                   <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-green-500/20">1</div>
                   <span className="text-xs font-bold text-slate-900 mt-3 absolute top-10">Livestock Type</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 px-2">
                   <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
                   <span className="text-xs font-medium text-gray-400 mt-3 absolute top-10">Input Data</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 px-2">
                   <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
                   <span className="text-xs font-medium text-gray-400 mt-3 absolute top-10">Risk Assessment</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 px-2">
                   <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">4</div>
                   <span className="text-xs font-medium text-gray-400 mt-3 absolute top-10">Review & Export</span>
                </div>
             </div>
          </div>

          {/* Category Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
             <div 
               onClick={() => setSelected('poultry')}
               className={`bg-white p-8 rounded-2xl cursor-pointer transition-all border-2 relative h-full ${selected === 'poultry' ? 'border-green-500 shadow-md shadow-green-500/10' : 'border-gray-200 hover:border-green-300'}`}
             >
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                   <Droplet className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Poultry</h3>
                <p className="text-gray-500 mb-8">Optimization for broilers, layers, and turkey farms with specialized metabolic tracks.</p>
                {selected === 'poultry' ? (
                   <div className="flex items-center gap-2 text-green-500 font-bold text-sm absolute bottom-8 left-8">
                      Selected <CheckCircle2 className="w-4 h-4 ml-1" />
                   </div>
                ) : (
                   <div className="text-gray-400 font-medium text-sm absolute bottom-8 left-8">Select category →</div>
                )}
             </div>

             <div 
               onClick={() => setSelected('cattle')}
               className={`bg-white p-8 rounded-2xl cursor-pointer transition-all border-2 relative h-full ${selected === 'cattle' ? 'border-green-500 shadow-md shadow-green-500/10' : 'border-gray-200 hover:border-green-300'}`}
             >
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                   <Tractor className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Cattle</h3>
                <p className="text-gray-500 mb-8">Advanced modeling for beef and dairy herds including pasture and feedlot dynamics.</p>
                {selected === 'cattle' ? (
                   <div className="flex items-center gap-2 text-green-500 font-bold text-sm absolute bottom-8 left-8">
                      Selected <CheckCircle2 className="w-4 h-4 ml-1" />
                   </div>
                ) : (
                   <div className="text-gray-400 font-medium text-sm absolute bottom-8 left-8">Select category →</div>
                )}
             </div>
          </div>

          <div className="border-t border-gray-200 pt-8 pb-12 flex items-center justify-between">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" /> Cancel
             </button>
             <div className="flex items-center gap-4">
                <div className="text-right">
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Next Step</div>
                   <div className="font-bold text-slate-900">Input Data & Metrics</div>
                </div>
                <button 
                  onClick={handleContinue}
                  disabled={isCreating}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-green-500/30 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isCreating ? 'Creating...' : <>Continue <span className="transform translate-y-[1px]">→</span></>}
                </button>
             </div>
          </div>
       </div>

       {/* Info Banner Bottom */}
       {/* <div className="border-t border-gray-200 bg-white py-6 mt-auto">
          <div className="max-w-4xl mx-auto px-4 flex gap-4">
             <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-green-500" strokeWidth={2}/></div>
             <div>
                <h4 className="font-bold text-slate-900 text-sm">Why Livestock Type?</h4>
                <p className="text-sm text-gray-500 max-w-3xl mt-1 leading-relaxed">Each category utilizes a unique algorithmic model based on metabolic rates, gestation cycles, and market fluctuation data specific to that livestock sector. Choosing the correct type ensures 99.8% prediction accuracy.</p>
             </div>
          </div>
       </div> */}
    </div>
  );
}
