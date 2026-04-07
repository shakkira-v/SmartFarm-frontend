import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#10b981", "#059669", "#047857", "#064e3b"];

const ZoneAlertBarChart = ({ data }) => {
  return (
    <div className="glass-panel flex flex-col h-full p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500 animate-slide-up overflow-hidden group">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Zone Vulnerability
        </h2>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Grid Comparison
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="zone" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              allowDecimals={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
              contentStyle={{ 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                padding: '12px 16px'
              }}
              labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#064e3b', marginBottom: '4px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}
            />
            <Bar dataKey="alerts" radius={[10, 10, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ZoneAlertBarChart;
