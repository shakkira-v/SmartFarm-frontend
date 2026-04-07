import { Download, Trash2, Database, FileText, RefreshCw } from "lucide-react";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { useState } from "react";

const MaintenancePanel = ({ onRefresh, user }) => {
  const [isResetting, setIsResetting] = useState(false);
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "admin" || user?.role === "manager" || user?.role === "user";

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/system/export/${format}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `farm_backup_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      toast.success(`Exporting ${format.toUpperCase()} backup...`);
    } catch (err) {
      console.error("Export error:", err.message);
      toast.error("Export failed!");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("CRITICAL ACTION: This will delete all alert history and reset all sensor/zone states to 0. Are you absolutely sure?")) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await api.post("/system/reset");
      toast.success(res.data.message, { 
        icon: '🧹',
        duration: 5000 
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Reset error:", err.message);
      toast.error("System reset failed!");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Database size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">System Maintenance & Backups</h2>
            <p className="text-gray-500 font-medium">Manage data exports and system performance</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isManager && (
            <>
              <button 
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-indigo-600 rounded-2xl transition-all font-bold text-sm shadow-sm active:scale-95"
              >
                <Download size={18} /> CSV Backup
              </button>
              
              <button 
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 hover:border-rose-200 hover:bg-rose-50 text-rose-600 rounded-2xl transition-all font-bold text-sm shadow-sm active:scale-95"
              >
                <FileText size={18} /> PDF Report
              </button>
            </>
          )}

          {isAdmin && (
            <button 
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl transition-all font-bold text-sm shadow-lg shadow-rose-200 active:scale-95 disabled:opacity-50"
            >
              {isResetting ? <RefreshCw className="animate-spin" size={18} /> : <Trash2 size={18} />}
              Clear System Data
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider">Auto-Backup Policy</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            System automatically performs a full data sweep and maintenance cycle every <span className="text-indigo-600 font-bold">14 days</span> at midnight.
          </p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider">Performance Mode</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Clearing data resets intrusion counters and sensor statuses, ensuring the dashboard remains fast and responsive for all users.
          </p>
        </div>

        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <h4 className="font-bold text-amber-800 text-sm mb-2 uppercase tracking-wider">Security Notice</h4>
          <p className="text-xs text-amber-600/80 leading-relaxed font-medium text-center">
            All manual reset actions are logged for security auditing purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePanel;
