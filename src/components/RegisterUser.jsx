import { useState } from "react";
import api from "../api/api";
import { X, CheckCircle2, AlertCircle, UserPlus, Shield, Activity } from "lucide-react";

const CreateUserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active"
  });
  const [checkResult, setCheckResult] = useState(null); // null, 'exists', 'available'
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkEmailExistence = async () => {
    if (!formData.email) return;
    setIsChecking(true);
    setCheckResult(null);
    try {
      const res = await api.get(`/admin/users/check-email?email=${formData.email}`);
      if (res.data.exists) {
        setCheckResult('exists');
      } else {
        setCheckResult('available');
      }
    } catch (err) {
      console.error("Check failed", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/admin/users", formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-['Inter']">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Add Personnel</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Grid Enrollment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="Operator Name"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@farm.com"
                  required
                  className={`w-full pl-5 pr-24 py-3.5 bg-slate-50 border rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium ${
                    checkResult === 'exists' ? 'border-red-500 focus:border-red-600' : 
                    checkResult === 'available' ? 'border-emerald-500 focus:border-emerald-600' :
                    'border-slate-200 focus:border-blue-600'
                  }`}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setCheckResult(null);
                  }}
                />
                <button
                  type="button"
                  onClick={checkEmailExistence}
                  disabled={isChecking || !formData.email}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50"
                >
                  {isChecking ? "..." : "Check"}
                </button>
              </div>
              {checkResult === 'exists' && (
                <p className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2 transition-all">
                  <AlertCircle size={12} /> This email is already registered.
                </p>
              )}
              {checkResult === 'available' && (
                <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2 transition-all">
                  <CheckCircle2 size={12} /> Email is available for use.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                <div className="relative">
                  <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    value={formData.role}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                <div className="relative">
                  <Activity size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    value={formData.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm transition-all active:scale-[0.98]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || checkResult === 'exists'}
              className="flex-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Enroll Personnel"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;