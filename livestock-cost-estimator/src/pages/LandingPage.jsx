import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Calculator, LineChart, Banknote, TrendingUp, ShieldCheck, Check } from 'lucide-react';
import heroImage from '../assets/heroImage.png';


export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
     
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center w-full">
        
         <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
           Make Smarter Livestock<br />
           <span className="text-green-500">Investment Decisions</span>
         </h1>
         <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
           A high-end SaaS platform for precision livestock cost estimation and profit prediction. Data-driven insights at your fingertips.
         </p>
         <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/estimate" className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-green-500/20">
               Start Free Estimation
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 text-slate-900 rounded-xl font-bold text-lg transition-all shadow-sm hover:bg-gray-50">
               Watch Demo
            </button>
         </div>

         
         <div className="mt-20 relative mx-auto w-full max-w-5xl">
            <img src={heroImage} alt="Hero" className="w-full h-auto rounded-2xl shadow-2xl" />
         </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
               <p className="text-lg text-gray-500">Three simple steps to transition from guesswork to data-backed decisions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-green-100 flex items-center justify-center rounded-xl mb-6 text-green-600 shadow-inner">
                     <FileUp strokeWidth={2.5} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">1. Input</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">Upload your current livestock data and operational parameters through our secure portal.</p>
               </div>
               <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-green-100 flex items-center justify-center rounded-xl mb-6 text-green-600 shadow-inner">
                     <Calculator strokeWidth={2.5} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">2. Estimate</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">Our AI models calculate costs and analyze current market trends to find hidden margins.</p>
               </div>
               <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-green-100 flex items-center justify-center rounded-xl mb-6 text-green-600 shadow-inner">
                     <LineChart strokeWidth={2.5} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">3. View</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">Access comprehensive reports with profit forecasting and growth cycle optimization.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    Powerful Features for Smart Farmers
                  </h2>
                  <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                    Take the guesswork out of livestock management with our sophisticated toolset designed for the modern agricultural enterprise.
                  </p>
                  <div className="space-y-8">
                     <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-green-500">
                           <Banknote strokeWidth={2.5} />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-slate-900 mb-2">Cost Breakdown</h4>
                           <p className="text-gray-500">Granular analysis of feed, medical, and operational expenses with real-time tracking.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-green-500">
                           <TrendingUp strokeWidth={2.5} />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-slate-900 mb-2">Profit Forecasting</h4>
                           <p className="text-gray-500">Predictive modeling based on market volatility and animal growth cycles using historical data.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-green-500">
                           <ShieldCheck strokeWidth={2.5} />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-slate-900 mb-2">Enterprise Security</h4>
                           <p className="text-gray-500">Bank-level encryption for all your data and multi-user access control.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="relative">
                 <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-teal-800 to-slate-900 p-8 shadow-2xl flex flex-col justify-end overflow-hidden relative border-8 border-white">
                    {/* Mock 3D bar chart */}
                    <div className="w-full h-3/4 flex items-end justify-between gap-3 relative z-10 p-4">
                       <div className="w-full bg-teal-400/50 backdrop-blur-md rounded-t-sm h-[30%] shadow-lg"></div>
                       <div className="w-full bg-teal-400/60 backdrop-blur-md rounded-t-sm h-[45%] shadow-lg"></div>
                       <div className="w-full bg-teal-400/70 backdrop-blur-md rounded-t-sm h-[55%] shadow-lg"></div>
                       <div className="w-full bg-teal-400/80 backdrop-blur-md rounded-t-sm h-[70%] shadow-lg"></div>
                       <div className="w-full bg-teal-400/90 backdrop-blur-md rounded-t-sm h-[85%] shadow-lg"></div>
                       <div className="w-full bg-green-400 shadow-xl shadow-green-400/50 rounded-t-sm h-[100%] border-t border-green-300"></div>
                    </div>
                    {/* Trending up arrow mock using SVG */}
                    <svg className="absolute w-full h-full left-0 top-0 text-white fill-transparent opacity-90 z-20 pointer-events-none drop-shadow-2xl" preserveAspectRatio="none" viewBox="0 0 100 100">
                       <path d="M 5 85 Q 30 80, 50 60 T 90 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                       <polygon points="85,15 95,25 90,20" fill="white" />
                    </svg>
                 </div>
               </div>
            </div>
         </div>
      </section>

     

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 rounded-[2.5rem] p-16 md:p-24 text-center shadow-2xl overflow-hidden relative">
           {/* Abstract glowing blobs */}
           <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
           
           <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                Ready to maximize your livestock profits?
              </h2>
              <p className="text-xl text-slate-300 mb-12 font-medium">
                Join thousands of modern farmers using data to drive their investment strategy.
              </p>
              <Link to="/estimate" className="inline-block px-12 py-5 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-500/30">
                 Get Started Now
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
