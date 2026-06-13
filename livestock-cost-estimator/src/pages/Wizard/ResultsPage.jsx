import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, TrendingUp, DollarSign, Activity, AlertTriangle, ArrowRight, Download } from 'lucide-react';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Try to get results from router state, fallback to empty object
  const results = location.state?.results || null;

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Results Found</h2>
        <p className="text-gray-500 mb-8">We couldn't find the estimation results. Please try running the estimation again.</p>
        <button 
          onClick={() => navigate('/estimate')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all"
        >
          Start New Estimation
        </button>
      </div>
    );
  }

  // Map backend JSON to UI variables
  const backendResults = results?.estimation?.results || {};
  const breakdownData = results?.costBreakdown || {};

  const totalCost = backendResults.totalCostEstimation || 0;
  const projectedRevenue = backendResults.projectedRevenue || 0;
  const profitMargin = Math.round(backendResults.roi || 0);

  const startup = breakdownData.startupCosts || {};
  const operating = breakdownData.operatingCosts || {};

  const breakdown = {
    animalAcquisition: startup.animalAcquisitionCost || breakdownData.animalAcquisitionCost || 0,
    housing: (startup.housingCost || breakdownData.housingCost || 0) + (startup.equipmentCost || breakdownData.equipmentCost || 0),
    feed: operating.feedPrice || breakdownData.feedPrice || 0,
    labor: operating.laborCost || breakdownData.laborCost || 0,
    electricity: operating.electricityCost || breakdownData.electricityCost || 0,
    health: (startup.vaccinationCost || breakdownData.vaccinationCost || 0) + 
            (operating.medicationCost || breakdownData.medicationCost || 0) + 
            (operating.vetServiceCost || breakdownData.vetServiceCost || 0) + 
            (operating.parasiteControlCost || breakdownData.parasiteControlCost || 0)
  };
  
  const riskLevel = results?.estimation?.healthManagement?.mortalityRate > 10 ? 'High' : 
                    results?.estimation?.healthManagement?.mortalityRate > 5 ? 'Medium' : 'Low';
                    
  const recommendations = [];
  if (profitMargin < 0) recommendations.push("Profit margin is negative. Review your feed and operations costs.");
  if (breakdown.feed > totalCost * 0.7) recommendations.push("Feed costs are over 70% of total expenses. Explore alternative suppliers.");
  if (riskLevel === 'High') recommendations.push("Mortality risk is high. Upgrade biosecurity and vaccination protocols immediately.");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-center px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <span className="font-bold text-lg text-slate-900 tracking-tight">Estimation Results</span>
          </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Your Profit Prediction</h1>
            <p className="text-gray-500">Based on your inputs and our ML model analysis.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 hover:border-green-500 text-slate-700 hover:text-green-600 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={() => navigate('/estimate')} className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-green-500/20 transition-all flex items-center gap-2">
              New Estimate <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-green-200 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">
                <DollarSign className="w-5 h-5 text-red-400" /> Total Cost
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(totalCost)}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-green-200 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Proj. Revenue
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(projectedRevenue)}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-green-500 shadow-lg shadow-green-500/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-bl-full -mr-8 -mt-8 opacity-10 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm uppercase tracking-wider mb-2">
                <Activity className="w-5 h-5" /> Profit Margin
              </div>
              <div className="text-4xl font-extrabold text-green-500">{profitMargin}%</div>
              <div className="text-sm font-medium text-green-600/80 mt-1">Expected ROI</div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cost Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Detailed Cost Breakdown</h3>
            <div className="space-y-6">
              
              {breakdown.animalAcquisition > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-slate-700">Animal Acquisition</span>
                    <span className="font-bold text-slate-900">{formatCurrency(breakdown.animalAcquisition)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(breakdown.animalAcquisition / totalCost) * 100 || 0}%` }}></div>
                  </div>
                </div>
              )}

              {breakdown.feed > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-slate-700">Feed & Nutrition</span>
                    <span className="font-bold text-slate-900">{formatCurrency(breakdown.feed)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(breakdown.feed / totalCost) * 100 || 0}%` }}></div>
                  </div>
                </div>
              )}

              {breakdown.housing > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-slate-700">Housing & Equipment</span>
                    <span className="font-bold text-slate-900">{formatCurrency(breakdown.housing)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(breakdown.housing / totalCost) * 100 || 0}%` }}></div>
                  </div>
                </div>
              )}

              {breakdown.health > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-slate-700">Health (Vaccines, Meds, Vet)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(breakdown.health)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${(breakdown.health / totalCost) * 100 || 0}%` }}></div>
                  </div>
                </div>
              )}

              {breakdown.labor > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-slate-700">Labor Operations</span>
                    <span className="font-bold text-slate-900">{formatCurrency(breakdown.labor)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(breakdown.labor / totalCost) * 100 || 0}%` }}></div>
                  </div>
                </div>
              )}

              {breakdown.electricity > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-slate-700">Electricity & Utilities</span>
                    <span className="font-bold text-slate-900">{formatCurrency(breakdown.electricity)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${(breakdown.electricity / totalCost) * 100 || 0}%` }}></div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* AI Insights & Risk */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full -mr-8 -mt-8"></div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${riskLevel === 'High' ? 'text-red-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`} /> 
                Risk Level: {riskLevel}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Based on your infrastructure and location data, the predicted mortality and operational risk is <span className="font-bold text-white">{riskLevel.toLowerCase()}</span>. 
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Top Recommendations
              </h3>
              <ul className="space-y-3">
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <span>Optimize feed ratios during the finisher phase to reduce costs by 4%.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <span>Consider upgrading biosecurity measures based on local disease trends.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
