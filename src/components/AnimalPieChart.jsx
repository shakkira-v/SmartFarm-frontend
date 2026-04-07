import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Dog, Bird, Cat, AlertTriangle } from "lucide-react";

const COLORS = ["#10b981", "#059669", "#047857", "#064e3b"];

const AnimalPieChart = ({ data }) => {
  return (
    <div className="glass-panel flex flex-col h-full p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500 animate-slide-up overflow-hidden relative group">
      {/* 🧪 Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
      
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        Species Distribution
      </h2>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-8 min-h-0 relative z-10">
        {/* Chart */}
        <div className="h-full w-full sm:w-1/2 min-h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                dataKey="count"
                nameKey="animal"
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={8}
                cornerRadius={12}
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  padding: '12px 16px'
                }}
                labelStyle={{ display: 'none' }}
                itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#064e3b' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Central Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</div>
             <div className="text-xl font-black text-slate-800 leading-none">
                {data.reduce((acc, curr) => acc + curr.count, 0)}
             </div>
          </div>
        </div>

        {/* Premium Legend */}
        <div className="w-full sm:w-1/2 space-y-3 max-h-[100%] pr-2 custom-scrollbar overflow-y-auto">
          {data.map((item, index) => (
            <div
              key={item.animal}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group/item"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover/item:text-emerald-700 transition-colors">
                  {item.animal}
                </span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                   {item.count}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalPieChart;
