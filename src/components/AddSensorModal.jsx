import { useState } from "react";
import api from "../api/api";
import { X, Cpu, Settings, Shield, Save } from "lucide-react";
import { toast } from "react-hot-toast";

const AddSensorModal = ({ isOpen, onClose, zones, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "motion",
    zone: "",
    threshold: 50,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.zone) {
      toast.error("Please assign a zone to the sensor");
      return;
    }
    setLoading(true);
    try {
      await api.post("/sensors", formData);
      toast.success("Sensor registered successfully!");
      onSuccess();
      onClose();
      setFormData({ name: "", type: "motion", zone: "", threshold: 50 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add sensor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative p-6 border-b border-gray-100 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Register Sensor</h2>
              <p className="text-sm text-gray-500 font-medium">Add new hardware to your farm network</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Device Name</label>
            <div className="relative">
              <input
                required
                type="text"
                placeholder="e.g. North Gate PIR"
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Sensor Type</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="motion">Motion</option>
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Threshold</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Assign to Zone</label>
            <select
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            >
              <option value="">Select a Zone</option>
              {zones.map((zone) => (
                <option key={zone._id} value={zone._id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-3 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Registering..." : "Register Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSensorModal;
