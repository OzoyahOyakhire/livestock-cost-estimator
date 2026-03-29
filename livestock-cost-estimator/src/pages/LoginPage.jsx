import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        // Exchange the Google access token for a session with your backend
        const res = await api.post('/auth/google-login', { 
          token: tokenResponse.access_token 
        });
        login(res.data.user);
        navigate('/');
      } catch (err) {
        setError('Google login failed. Please try a standard email login.');
        console.error('Google Auth Error:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in was unsuccessful.')
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/login', formData);
      // On success, update global state and redirect
      login({ email: formData.email }); 
      navigate('/'); 
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Invalid credentials. Please try again.';
      setError(errorMsg);
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
          

          <div className="max-w-md">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              Maximize your<br />
              <span className="text-green-600">herd's potential.</span>
            </h1>
            <p className="text-lg text-slate-600/90 leading-relaxed mb-8">
              The industry standard for livestock cost estimation and profit prediction. Access your dashboard to manage growth metrics and financial forecasts with precision.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-slate-500 font-medium italic max-w-sm">
            "LivestockIQ transforms cost estimation for livestock farmers. The precision is unmatched."
          </p>
          <p className="text-xs text-slate-400 mt-12">
            © 2024 LivestockIQ Analytics Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 bg-white">
        <div className="w-full max-w-sm mx-auto">
         

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
            <p className="text-slate-500 text-sm">Enter your credentials to access your farm's analytics.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-red-50 text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <Link to="#" className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">Forgot password?</Link>
              </div>
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 accent-green-500 rounded-md border-slate-300 transition-all cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer select-none">Remember this device</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  Sign In to LivestockIQ
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Not a member? <Link to="/signup" className="font-bold text-green-600 hover:text-green-700 transition-colors">Sign up Now</Link>
          </div>

          <div className="mt-12 relative text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <span className="relative z-10 bg-white px-4 text-xs font-bold text-slate-400 tracking-widest uppercase">Or continue with</span>
          </div>

          <button 
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="mt-8 w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
