import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { Shield, Mail, Calendar, Circle, Edit, X, Save, Trash2, Search } from "lucide-react";
import RegisterUser from "./RegisterUser";

const UserManagementTable = ({ 
  currentUser, limit,
  showCreateModal,
  setShowCreateModal
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active"
  });

  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users");
      // Sort by creation date descending
      const sortedUsers = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(limit ? sortedUsers.slice(0, limit) : sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser._id}`, formData);
      setEditingUser(null);
      fetchUsers();
    } catch {
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.email === currentUser?.email || user._id === currentUser?.id) {
      alert("Security Protocol: You cannot terminate your own active session/account.");
      return;
    }

    if (user.role === "admin") {
      alert("Access Denied: Administrative accounts can only be managed via central database for security reasons.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${user._id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-50 rounded-2xl"></div>
          <div className="h-10 bg-slate-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden mt-8">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Personnel Grid</h2>
          <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">Authorized system operators and field personnel</p>
        </div>

        <div className="relative group w-full md:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {showCreateModal && (
        <RegisterUser
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm font-medium">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-nowrap">Created At</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                      {u.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {u.name}
                        {u.email === currentUser?.email && (
                          <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-bold uppercase transition-all">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail size={12} /> {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                    u.role === "admin" 
                      ? "bg-red-50 text-red-600 ring-red-200" 
                      : u.role === "manager" 
                      ? "bg-amber-50 text-amber-600 ring-amber-200" 
                      : "bg-blue-50 text-blue-600 ring-blue-200"
                  }`}>
                    <Shield size={12} />
                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    u.status === "active" ? "bg-green-50 text-green-600" : 
                    u.status === "pending_approval" ? "bg-amber-50 text-amber-600 animate-pulse" :
                    u.status === "pending_verification" ? "bg-blue-50 text-blue-600" :
                    "bg-gray-50 text-gray-500"
                  }`}>
                    <Circle size={8} fill="currentColor" stroke="none" />
                    {u.status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {u.status === "pending_approval" && (
                      <button 
                        onClick={async () => {
                          try {
                            await api.put(`/admin/users/${u._id}`, { status: "active" });
                            fetchUsers();
                          } catch {
                            alert("Failed to approve user");
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditClick(u)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    {u.email !== currentUser?.email && u.role !== "admin" && (
                      <button 
                        onClick={() => handleDeleteUser(u)}
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-800 font-semibold transition-colors"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {filteredUsers.map((u) => (
          <div key={u._id} className="p-4 space-y-4 border-r border-gray-50 last:border-r-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {u.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-gray-800 flex items-center gap-1 overflow-hidden">
                    <span className="truncate max-w-[100px]">{u.name}</span>
                    {u.email === currentUser?.email && (
                      <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0">You</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{u.email}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ring-1 ring-inset ${
                u.role === "admin" ? "bg-red-50 text-red-600 ring-red-200" : 
                u.role === "manager" ? "bg-amber-50 text-amber-600 ring-amber-200" : 
                "bg-blue-50 text-blue-600 ring-blue-200"
              }`}>
                {u.role}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                 <Calendar size={12} />
                 {new Date(u.createdAt).toLocaleDateString()}
                 <span className="text-gray-200">|</span>
                 <span className={`${
                   u.status === 'active' ? 'text-green-600' : 
                   u.status === 'pending_approval' ? 'text-amber-500 font-bold' :
                   u.status === 'pending_verification' ? 'text-blue-500' :
                   'text-gray-400'
                 }`}>
                   {u.status.replace("_", " ")}
                 </span>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => handleEditClick(u)} className="text-blue-600 font-bold uppercase tracking-tighter hover:underline">Edit</button>
                 {u.email !== currentUser?.email && u.role !== "admin" && (
                   <button onClick={() => handleDeleteUser(u)} className="text-red-500 font-bold uppercase tracking-tighter hover:underline">Delete</button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit size={20} className="text-blue-600" /> Edit User Profile
              </h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                      <option value="active">Active</option>
                      <option value="pending_approval">Pending Approval</option>
                      <option value="pending_verification">Pending Verification</option>
                      <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
