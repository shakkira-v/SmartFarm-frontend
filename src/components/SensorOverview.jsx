import { useEffect, useState } from "react";
import { Cpu, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const SensorOverview = ({ stats }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const startPulse = setTimeout(() => setPulse(true), 50);
    const endPulse = setTimeout(() => setPulse(false), 600);
    return () => {
      clearTimeout(startPulse);
      clearTimeout(endPulse);
    };
  }, [stats.activeSensors, stats.warningSensors, stats.criticalSensors]);

  const sensorMetrics = [
    {
      label: "Active",
      value: stats.activeSensors,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      label: "Issues",
      value: stats.warningSensors,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    },
    {
      label: "Offline",
      value: stats.criticalSensors,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className={`bg-white p-6 rounded-2xl border transition-all duration-300 shadow-sm h-full ${pulse ? 'ring-2 ring-blue-500 scale-[1.01] border-blue-200' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 bg-blue-50 text-blue-600 rounded-lg transition-transform ${pulse ? 'scale-110 shadow-md' : ''}`}>
          <Cpu className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-800">Sensor Network Health</h3>
      </div>

      <div className="space-y-4">
        {sensorMetrics.map((metric, idx) => (
          <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${pulse ? 'bg-blue-50/30' : 'bg-white border-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color} transition-transform ${pulse ? 'scale-110' : ''}`}>
                <metric.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-600">{metric.label}</span>
            </div>
            <span className={`text-lg font-bold text-gray-800 transition-all ${pulse ? 'scale-125 text-blue-600' : ''}`}>{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Last Updated</span>
          <span className="font-mono">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Network Capacity</span>
          <span className="font-semibold text-gray-800">{stats.totalSensors} Nodes</span>
        </div>
        <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-1000" 
            style={{ width: `${stats.totalSensors > 0 ? (stats.activeSensors / stats.totalSensors) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SensorOverview;
