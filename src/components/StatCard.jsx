import { useEffect, useState } from "react";

const StatCard = ({ title, value, icon: Icon, color }) => {
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const trigger = setTimeout(() => setHasChanged(true), 0);
    const timer = setTimeout(() => setHasChanged(false), 1000);
    return () => {
      clearTimeout(trigger);
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div className={`glass-panel p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/50 transition-all duration-500 relative overflow-hidden ${hasChanged ? 'scale-[1.02]' : ''}`}>
      {/* 🌿 Background Decoration */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-700 ${color}`} />
      
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 group-hover:text-emerald-600 transition-colors">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <h2 className={`text-3xl font-black text-slate-800 tracking-tight transition-all duration-500 ${hasChanged ? 'text-emerald-600 scale-110' : ''}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
          {hasChanged && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -right-1 top-1" />
          )}
        </div>
      </div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${color} ${hasChanged ? 'animate-pulse-glow' : ''}`}>
        <Icon size={24} className={hasChanged ? 'animate-bounce' : ''} />
      </div>

      {/* ⚡ Change Indicator Line */}
      <div className={`absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000 ${hasChanged ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
    </div>
  );
};

export default StatCard;
