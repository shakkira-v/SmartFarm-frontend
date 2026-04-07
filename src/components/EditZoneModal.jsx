import { useState } from "react";
import api from "../api/api";
import { X } from "lucide-react";

const EditZoneModal = ({ isOpen, onClose, zone, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: zone?.name ?? "",
    threshold: zone?.threshold ?? 5,
    status: zone?.status ?? "active",
    description: zone?.description ?? "",
    crop: zone?.crop ?? "",
    riskLevel: zone?.riskLevel ?? "low",
    top: zone?.position?.top ?? "20%",
    left: zone?.position?.left ?? "20%"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const zonePayload = {
        name: formData.name,
        description: formData.description,
        crop: formData.crop,
        threshold: Number(formData.threshold),
        riskLevel: formData.riskLevel,
        status: formData.status,
        position: {
          top: formData.top,
          left: formData.left
        }
      };

      await api.put(`/zones/${zone._id}`, zonePayload);
      onSuccess(); // refresh zones
      onClose();   // close modal
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Failed to update zone: " + (error.response?.data?.message || error.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 shadow-2xl relative border border-emerald-50 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
              Reconfigure Node
            </h2>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">System Override Protocol</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-2xl transition-all text-gray-400 hover:text-emerald-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Zone Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-name">
              Zone Name
            </label>
            <input
              type="text"
              name="name"
              id="edit-zone-name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. North Field"
              className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-threshold">
                Alert Threshold
              </label>
              <input
                type="number"
                name="threshold"
                id="edit-zone-threshold"
                value={formData.threshold}
                onChange={handleChange}
                placeholder="5"
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          {/* Risk Level & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-risk">
                Risk Level
              </label>
              <select
                name="riskLevel"
                id="edit-zone-risk"
                value={formData.riskLevel}
                onChange={handleChange}
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-status">
                Status
              </label>
              <select
                name="status"
                id="edit-zone-status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Position Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-top">
                Top Position (%)
              </label>
              <input
                type="text"
                name="top"
                id="edit-zone-top"
                value={formData.top}
                onChange={handleChange}
                placeholder="e.g. 25%"
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-left">
                Left Position (%)
              </label>
              <input
                type="text"
                name="left"
                id="edit-zone-left"
                value={formData.left}
                onChange={handleChange}
                placeholder="e.g. 50%"
                className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-desc">
              Description
            </label>
            <textarea
              name="description"
              id="edit-zone-desc"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the zone security details..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Crop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-zone-crop">
              Crop
            </label>
            <input
              type="text"
              name="crop"
              id="edit-zone-crop"
              value={formData.crop}
              onChange={handleChange}
              placeholder="e.g. Wheat, Rice"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
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
            onClick={handleUpdate}
            className="px-8 py-3 rounded-2xl bg-[#052e16] text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-900 shadow-xl shadow-emerald-950/20 transition-all active:scale-95"
          >
            Update Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditZoneModal;
