import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { estimationApi } from '../api/estimationApi';
import { ClipboardList, Calendar, ArrowRight, Activity, TrendingUp, AlertCircle, Box, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimations, setEstimations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEstimations = async () => {
      try {
        setIsLoading(true);
        const data = await estimationApi.getHistory();
        // Handle different possible backend response structures
        const estList = Array.isArray(data) ? data : (data.estimations || data.data || []);
        
        // Sort by newest first
        const sorted = [...estList].sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
        setEstimations(sorted);
      } catch (err) {
        console.error("Failed to load estimations:", err);
        const status = err.response?.status;
        // 401/403 = auth issue, 404 = endpoint may not exist yet — show empty state
        if (status === 401 || status === 403 || status === 404) {
          setEstimations([]);
        } else {
          setError("Could not load your past estimations. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstimations();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this estimation? This action cannot be undone.')) return;
    try {
      await estimationApi.delete(id);
      setEstimations(prev => prev.filter(est => est._id !== id));
      toast.success('Estimation deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete estimation');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.name || 'Farmer'}! Here are your previous livestock estimations.</p>
          </div>
          <Link 
            to="/estimate" 
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            <Activity className="w-5 h-5" />
            New Estimation
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800">Connection Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse h-48">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-6"></div>
                <div className="flex justify-between items-end mt-auto">
                  <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : estimations.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Estimations Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You haven't created any livestock cost estimations yet. Start your first estimation to see detailed financial breakdowns and projections.
            </p>
            <Link 
              to="/estimate" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              Start First Estimation <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estimations.map((est) => {
              // Try to safely extract info
              const type = est.livestockType || est.productionSetup?.productionType || 'Unknown Type';
              const animalCount = est.productionSetup?.numberOfAnimals || est.flockSize || est.herdSize || 0;
              const date = est.createdAt || est.updatedAt;
              const isCompleted = est.status === 'completed' || !!est.results || !!est.healthManagement; // Simple heuristic
              
              return (
                <div key={est._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-full uppercase tracking-wider">
                      {type}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(est._id); }}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete estimation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-extrabold text-xl text-slate-900 mb-1">
                    {animalCount.toLocaleString()} {type.toLowerCase() === 'cattle' || type.toLowerCase() === 'beef' || type.toLowerCase() === 'dairy' ? 'Heads' : 'Birds'}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(date)}</span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                      <span className="text-xs font-bold text-slate-600">{isCompleted ? 'Completed' : 'Draft'}</span>
                    </div>
                    
                    <Link 
                      to={isCompleted ? `/estimate/results/${est._id}` : '/estimate'} 
                      className="text-green-600 hover:text-green-700 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      {isCompleted ? 'View Results' : 'Continue'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
