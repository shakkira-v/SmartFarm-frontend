import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddZoneModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    crop: "",
    threshold: 5,
    riskLevel: "low",
    top: "20%",
    left: "20%"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // IMPORTANT (your login saves this)

      const zonePayload = {
        name: formData.name,
        description: formData.description,
        crop: formData.crop,
        threshold: Number(formData.threshold),
        riskLevel: formData.riskLevel,
        position: {
          top: formData.top,
          left: formData.left
        }
      };

      await axios.post(
        "http://localhost:5000/api/zones",
        zonePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onSuccess(); // refresh zones
      onClose();   // close modal
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Failed to create zone");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative max-h-[90vh] flex flex-col border border-emerald-50">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
              Deploy New Node
            </h2>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Grid Expansion Protocol</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-2xl transition-all text-gray-400 hover:text-emerald-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. North Field"
              className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Short description of the zone"
              className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
            <input
              type="text"
              name="crop"
              placeholder="e.g. Wheat, Rice"
              className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
              <input
                type="number"
                name="threshold"
                placeholder="Alert Limit"
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
            <select
              name="riskLevel"
              className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              onChange={handleChange}
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          {/* Position for Zone Map */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top Position (%)</label>
              <input
                type="text"
                name="top"
                placeholder="e.g. 30%"
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Left Position (%)</label>
              <input
                type="text"
                name="left"
                placeholder="e.g. 50%"
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl border border-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            Abort
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-[#052e16] text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-900 shadow-xl shadow-emerald-950/20 transition-all active:scale-95"
          >
            Initialize Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddZoneModal;