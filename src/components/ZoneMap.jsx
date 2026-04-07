import { useEffect, useState } from "react";
import api from "../api/api";
import { Radar, Crosshair, Target } from "lucide-react";

const ZoneMap = ({ zones: initialZones }) => {
  const [internalZones, setInternalZones] = useState([]);

  useEffect(() => {
    if (initialZones) return;
    const fetchZones = async () => {
      try {
        const res = await api.get("/dashboard/zones/map");
        if (Array.isArray(res.data)) {
          setInternalZones(res.data);
        }
      } catch (error) {
        console.error("Map fetch error:", error);
      }
    };
    fetchZones();
  }, [initialZones]);

  const displayZones = initialZones || internalZones;

  const getRiskStyles = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return "from-rose-500/80 to-rose-600/80 border-rose-400 shadow-rose-900/40";
      case 'medium': return "from-amber-400/80 to-amber-500/80 border-amber-300 shadow-amber-900/40";
      default: return "from-emerald-500/80 to-emerald-600/80 border-emerald-400 shadow-emerald-900/40";
    }
  };

  return (
    <div className="glass-panel flex flex-col h-full p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-700 animate-slide-up overflow-hidden group">
      <div className="flex items-center justify-between mb-8 shrink-0 relative z-20">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-2">
          <Radar size={16} className="animate-spin duration-[4000ms]" />
          Geospatial Grid Status
        </h2>
        <div className="flex gap-2">
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
             Live Tracking
           </span>
        </div>
      </div>

      <div className="flex-1 min-h-[350px] relative rounded-[2rem] bg-[#022c22] border border-emerald-950 shadow-inner overflow-hidden cursor-crosshair">
        {/* 🚀 Tech Background Layers */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="absolute inset-0 opacity-10 pointer-events-none animate-morph bg-emerald-500 rounded-full blur-[100px] -m-20" />
        
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 shadow-[0_0_15px_#10b981] animate-[scan_4s_linear_infinite] z-10 pointer-events-none" />

        {/* HUD Markers */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-40">
           <Crosshair size={24} className="text-emerald-500/50" />
        </div>
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none opacity-40 rotate-180">
           <Crosshair size={24} className="text-emerald-500/50" />
        </div>

        {/* Zone Markers */}
        {displayZones.map((zone) => (
          <div
            key={zone._id}
            className={`absolute group/zone transition-all duration-500 hover:z-50`}
            style={{
              top: zone.position?.top || "0%",
              left: zone.position?.left || "0%",
            }}
          >
            {/* Blip Animation */}
            <div className={`absolute -inset-4 bg-gradient-to-br transition-all duration-500 rounded-xl blur-lg opacity-20 group-hover/zone:opacity-60 ${getRiskStyles(zone.riskLevel)}`} />
            
            <div className={`relative flex flex-col items-center justify-center p-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 group-hover/zone:scale-110 bg-gradient-to-br ${getRiskStyles(zone.riskLevel)}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Target size={10} className="text-white animate-pulse" />
                <span className="font-black text-[9px] uppercase tracking-tighter text-white whitespace-nowrap">
                   {zone.name}
                </span>
              </div>
              <div className="text-[8px] font-black text-white/70 tracking-widest uppercase">
                 {zone.riskLevel} SCTR
              </div>
            </div>

            {/* Trailing Coordinates */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/zone:opacity-100 transition-opacity pointer-events-none">
               <span className="bg-black/40 text-[8px] font-mono text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                 LAT: {parseInt(zone._id?.slice(-2) || '45', 16) % 90}.{(zone._id?.slice(-4)) || '0000'}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneMap;
