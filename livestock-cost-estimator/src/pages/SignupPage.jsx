import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/api';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await api.post('/auth/register', formData);
      setStatus({ type: 'success', message: response.data.msg });
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white overflow-hidden">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left side: Branding & Info */}
        <div className="hidden md:flex md:w-1/2 bg-[#E6F4EA] p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
          {/* Abstract Background Decoration */}
          <div className="absolute top-20 right-0 w-64 h-64 bg-green-200/40 rounded-full blur-3xl -mr-32 opacity-60"></div>
          <div className="absolute bottom-40 left-0 w-80 h-80 bg-green-300/30 rounded-full blur-3xl -ml-40 opacity-50"></div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-20 group">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">LivestockIQ</span>
            </Link>

            <div className="max-w-md">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                Grow your farm with<br />
                <span className="text-green-600">precision data.</span>
              </h1>
              <p className="text-lg text-slate-600/90 leading-relaxed mb-8">
                Join thousands of farmers using LivestockIQ to optimize their production costs and maximize market returns. Start your 14-day free trial today.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                +2K
              </div>
            </div>
            <p className="text-sm text-slate-600 font-semibold tracking-wide">
              TRUSTED BY OVER 2,000+ MODERN FARMS
            </p>
            <p className="text-xs text-slate-400 mt-12">
              © 2024 LivestockIQ Analytics Inc. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side: Signup Form */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
              <p className="text-slate-500 text-sm">Start your free trial. No credit card required.</p>
            </div>

            {status.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                status.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-slate-600 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-slate-600 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-slate-600 placeholder:text-slate-400 shadow-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-500 leading-relaxed">
                By creating an account, you agree to our <Link to="#" className="text-green-600 font-bold">Terms of Service</Link> and <Link to="#" className="text-green-600 font-bold">Privacy Policy</Link>.
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : (
                  <>
                    Create Account
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-bold text-green-600 hover:text-green-700 transition-colors">Sign in here</Link>
            </div>

            <div className="mt-10 relative text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <span className="relative z-10 bg-white px-4 text-xs font-bold text-slate-400 tracking-widest uppercase">Or continue with</span>
            </div>

            <button className="mt-8 w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




