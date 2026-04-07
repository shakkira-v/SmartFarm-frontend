import { MapPin, Edit, Trash2, ShieldAlert, Cpu, Thermometer, Droplets } from "lucide-react";

const ZoneCard = ({ zone, onEdit, onDelete, canEdit }) => {
  const intrusions = zone?.intrusionsToday || 0;
  const threshold = zone?.threshold || 0;
  const alerts = zone?.alertsCount || 0;
  const risk = zone?.riskLevel || "low";
  const temperature = zone?.temperature || 28;
  const humidity = zone?.humidity || 65;

  const capacity = threshold > 0 ? Math.min((alerts / threshold) * 100, 100) : 0;

  const getRiskStyles = () => {
    switch (risk.toLowerCase()) {
      case 'high': return "bg-rose-500/10 text-rose-600 border-rose-200 shadow-rose-100";
      case 'medium': return "bg-amber-500/10 text-amber-600 border-amber-200 shadow-amber-100";
      default: return "bg-emerald-500/10 text-emerald-600 border-emerald-200 shadow-emerald-100";
    }
  };

  return (
    <div className="glass-panel group p-6 rounded-[2.5rem] flex flex-col h-full hover:border-emerald-500/50 transition-all duration-700 relative overflow-hidden animate-slide-up">
      {/* 🧬 Background Decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full animate-morph pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
        <div className="flex gap-4 min-w-0 shrink">
          <div className="bg-emerald-600/10 p-3 rounded-2xl border border-emerald-600/20 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 flex-shrink-0">
            <Cpu size={20} className="text-emerald-600 group-hover:text-white transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 tracking-tight text-lg mb-1 group-hover:text-emerald-700 transition-colors truncate">
              {zone?.name || "Security Unit"}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
               <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                 <MapPin size={10} /> {zone?.crop || "Perimeter"}
               </div>
               <div className="flex items-center gap-2">
                 <div className="flex items-center gap-0.5 text-amber-600/70 text-[10px] font-bold">
                    <Thermometer size={10} /> {temperature}°
                 </div>
                 <div className="flex items-center gap-0.5 text-blue-600/70 text-[10px] font-bold">
                    <Droplets size={10} /> {humidity}%
                 </div>
               </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 pt-1">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border shadow-sm block ${getRiskStyles()}`}>
            {risk}
          </span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Intrusions</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800">{intrusions}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hit</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Capacity</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800">{threshold}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Limit</span>
          </div>
        </div>
      </div>

      {/* 🚀 Risk Saturation Gauge */}
      <div className="mt-auto space-y-6 relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <ShieldAlert size={12} className={capacity > 70 ? 'text-rose-500 animate-pulse' : 'text-emerald-600'} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Grid Load</span>
            </div>
            <span className={`text-xs font-black ${capacity > 70 ? 'text-rose-500' : 'text-emerald-600'}`}>
              {Math.round(capacity)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                capacity > 70 ? 'bg-rose-500 shadow-rose-200' : 
                capacity > 40 ? 'bg-amber-500 shadow-amber-200' : 
                'bg-emerald-500 shadow-emerald-200'
              }`}
              style={{ width: `${capacity}%` }}
            >
              <div className="w-full h-full bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${zone?.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{zone?.status || "STANDBY"}</span>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <>
                <button 
                  onClick={() => onEdit(zone)}
                  className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-200/50 hover:border-emerald-200"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onDelete(zone)}
                  className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-200/50 hover:border-rose-200"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
