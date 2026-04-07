import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/api";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email.");
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may be expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 font-['Inter']">
      {/* 🖼️ Nature Background Wrapper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-emerald-950/40 z-10" />
        <img 
          src="/lush_farm_background_v2_1772180014783.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 text-center">
          
          {status === "verifying" && (
            <div className="py-10">
              <Loader2 size={64} className="text-emerald-600 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verifying Identity</h2>
              <p className="text-slate-500 mt-2">Connecting to the security grid...</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Identity Verified</h2>
              <p className="text-slate-500 mt-4 leading-relaxed font-medium">
                {message}
              </p>
              <div className="mt-10">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  Return to Login <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verification Failed</h2>
              <p className="text-slate-500 mt-4 leading-relaxed font-medium">
                {message}
              </p>
              <div className="mt-10">
                <Link 
                  to="/login" 
                  className="inline-flex font-bold text-emerald-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
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
