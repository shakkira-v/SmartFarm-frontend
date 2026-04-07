import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { Mail, ArrowLeft, ShieldCheck, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 font-['Inter']">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-emerald-950/40 z-10" />
        <img 
          src="/lush_farm_background_v2_1772180014783.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <Link 
        to="/login" 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20">
          <ArrowLeft size={20} />
        </div>
        <span className="hidden sm:block">Back to Login</span>
      </Link>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recover Key</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Enter your email and we'll send a secure reset link.</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link <Send size={20} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Send size={40} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Dispatch Successful</h3>
                <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">
                  We've sent a secure recovery link to <span className="text-emerald-600 font-bold">{email}</span>. Please check your inbox and follow the instructions.
                </p>
              </div>
              <Link 
                to="/login"
                className="inline-block w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-sm transition-all"
              >
                Return to Entry Grid
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
