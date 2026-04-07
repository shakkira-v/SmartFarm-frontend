import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import { Cpu, Wifi, Battery, AlertTriangle, CheckCircle2, Search, Filter, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import AddSensorModal from "../components/AddSensorModal";
import { useAuth } from "../hooks/useAuth";

const SensorsPage = () => {
  const { user } = useAuth();
  const [sensors, setSensors] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isManager = user?.role === "manager" || user?.role === "user";



  const fetchData = useCallback(async () => {
    try {
      const [sensorRes, zoneRes] = await Promise.all([
        api.get("/sensors"),
        api.get("/zones")
      ]);
      setSensors(sensorRes.data);
      setZones(zoneRes.data);
    } catch (err) {
      console.log("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async () => {
    setLoading(true);
    try {
      await api.post("/sensors/sync");
      toast.success("Network synchronization successful");
      await fetchData();
    } catch (err) {
      console.error("Sync error:", err.message);
      toast.error("Failed to sync network");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to decommission this sensor? It will be removed from the network.")) return;
    try {
      await api.delete(`/sensors/${id}`);
      toast.success("Sensor removed successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete sensor");
    }
  };

  const filteredSensors = sensors.filter(sensor => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (sensor.name && sensor.name.toLowerCase().includes(searchString)) || 
      (sensor.type && sensor.type.toLowerCase().includes(searchString)) || 
      (sensor._id && sensor._id.toLowerCase().includes(searchString)) ||
      (sensor.zone?.name && sensor.zone.name.toLowerCase().includes(searchString));
    const matchesFilter = statusFilter === "all" || sensor.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: sensors.length,
    active: sensors.filter(s => s.status === 'normal' || s.status === 'active').length,
    lowBattery: sensors.filter(s => s.battery < 20).length,
    offline: sensors.filter(s => s.status === 'critical').length
  };

  return (
    <Layout 
      title="Sensor Management" 
      subtitle="Monitor device health and register new hardware"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Nodes", value: stats.total, icon: <Cpu />, color: "blue" },
          { label: "Online", value: stats.active, icon: <CheckCircle2 />, color: "green" },
          { label: "Alerting", value: stats.lowBattery + stats.offline, icon: <AlertTriangle />, color: "amber" },
          { label: "Critical", value: stats.offline, icon: <Wifi />, color: "red" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mb-4 transition-colors group-hover:text-blue-600`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/10">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search sensors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50/50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-gray-600"
            >
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex gap-2 text-nowrap">
            {isManager && (
              <>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-lg shadow-blue-200"
                >
                  <Plus size={16} /> Add Sensor
                </button>
                <button 
                  onClick={handleSync}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-sm font-semibold border border-blue-100"
                >
                  <RefreshCw size={16} /> Sync
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto text-sm">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Node ID</th>
                  <th className="px-6 py-4">Hardware Name</th>
                  <th className="px-6 py-4">Assigned Zone</th>
                  <th className="px-6 py-4 text-center">Health Status</th>
                  <th className="px-6 py-4 text-center">Signal</th>
                   <th className="px-6 py-4 text-center">Status</th>
                  {isManager && <th className="px-6 py-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredSensors.map((sensor) => (
                  <tr key={sensor._id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-gray-300">#{sensor._id.substring(18)}</td>
                    <td className="px-6 py-4 font-bold text-gray-700 capitalize">{sensor.name || sensor.type}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-bold text-[10px]">
                        {sensor.zone?.name || "Global"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                         <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                sensor.status === 'critical' ? 'bg-red-500' : 
                                sensor.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${sensor.status === 'critical' ? 20 : 100}%` }}
                            />
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                          <Wifi size={14} className={sensor.status === 'critical' ? 'text-gray-300' : 'text-emerald-500'} />
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        sensor.status === 'normal' || sensor.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                        sensor.status === 'warning' ? 'bg-amber-50 text-amber-600' : 
                        sensor.status === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {sensor.status}
                      </span>
                    </td>
                     {isManager && (
                      <td className="px-6 py-4 text-center text-nowrap">
                        <button 
                          onClick={() => handleDelete(sensor._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                          title="Delete Sensor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>

                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile & Tablet View */}
        <div className="lg:hidden divide-y divide-gray-50 flex flex-col p-2">
          {loading ? (
            <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1">
            {filteredSensors.map((sensor) => (
              <div key={sensor._id} className="p-4 space-y-3 border-r border-gray-50 last:border-r-0">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 font-mono">#{sensor._id.substring(18)}</span>
                      <span className="font-black text-gray-800 tracking-tight">{sensor.name || sensor.type}</span>
                   </div>
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      sensor.status === 'normal' || sensor.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                      sensor.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                   }`}>
                      {sensor.status}
                   </span>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold">
                         {sensor.zone?.name || 'Global'}
                      </span>
                      <div className="flex items-center gap-1">
                         <Wifi size={10} className={sensor.status === 'critical' ? 'text-gray-300' : 'text-emerald-500'} />
                         <span className="text-[9px] font-black text-gray-400">Signal</span>
                      </div>
                   </div>
                   
                   {isManager && (
                     <button 
                       onClick={() => handleDelete(sensor._id)}
                       className="p-2 text-red-500 bg-red-50 rounded-lg"
                     >
                        <Trash2 size={14} />
                     </button>
                   )}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>


        {!loading && filteredSensors.length === 0 && (
           <div className="px-6 py-12 text-center text-gray-500 font-medium border-t border-gray-50">
              {sensors.length === 0 ? 'No sensors registered yet.' : 'No sensors match your search/filter criteria.'}
           </div>
        )}

      </div>

      <AddSensorModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        zones={zones} 
        onSuccess={fetchData} 
      />
    </Layout>
  );
};

export default SensorsPage;
