import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, LogIn, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      // Update global auth state
      await refreshProfile();
      
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 font-['Inter']">
      {/* 🖼️ Nature Background Wrapper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-emerald-950/40 z-10" />
        <img 
          src="/lush_farm_background_v2_1772180014783.png" 
          alt="Login Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🔙 Back to Home */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20">
          <ArrowLeft size={20} />
        </div>
        <span className="hidden sm:block">Back to Site</span>
      </Link>

      {/* 📦 Login Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Access Control</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Verify your identity to enter the security grid.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-medium"
                  placeholder="name@farm.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Security Key</label>
                <Link to="/forgot-password" size={20} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect to Grid <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-10 text-sm text-slate-400 font-medium">
            New personnel? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Apply for entry</Link>
          </p>
        </div>
        
        {/* Security Badge */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldCheck size={14} />
          End-to-End Encrypted Access
        </div>
      </div>
    </div>
  );
}
