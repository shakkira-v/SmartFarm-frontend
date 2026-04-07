import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import { Plus, MapPinned, Search, Filter } from "lucide-react";
import ZoneCard from "../components/ZoneCard";
import ZoneMap from "../components/ZoneMap";
import AddZoneModal from "../components/AddZoneModal";
import EditZoneModal from "../components/EditZoneModal";
import DeleteZoneModal from "../components/DeleteZoneModal";
import { useAuth } from "../hooks/useAuth";

const ZonesPage = () => {
  const { user } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const isManager = user?.role === "manager";
  const canManageZones = isManager; // Manager only for zones



  const fetchZones = async () => {
    try {
      const res = await api.get("/zones");
      setZones(res.data);
    } catch (err) {
      console.log("Zones fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const openEditModal = (zone) => {
    setSelectedZone(zone);
    setShowEditModal(true);
  };

  const openDeleteModal = (zone) => {
    setSelectedZone(zone);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/zones/${selectedZone._id}`);
      fetchZones();
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const filteredZones = zones.filter(zone => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (zone.name && zone.name.toLowerCase().includes(searchString)) || 
      (zone.description && zone.description.toLowerCase().includes(searchString));
    const matchesRisk = riskFilter === "all" || zone.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <Layout 
      title="Secure Terrain Control" 
      subtitle="Strategize and monitor farm perimeters with real-time risk intelligence"
    >
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-10">
          {/* Header Actions */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Monitoring Nodes</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Live Perimeter Data</span>
                </div>
              </div>
              
              {canManageZones && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="group flex items-center gap-3 px-6 py-3.5 bg-[#052e16] text-white rounded-[1.5rem] hover:bg-emerald-900 transition-all font-black text-sm shadow-xl shadow-emerald-950/20 active:scale-95 border border-emerald-800/50"
                >
                  <Plus size={20} className="text-emerald-400 group-hover:rotate-90 transition-transform duration-500" /> 
                  <span className="hidden sm:inline tracking-tight">Deploy Node</span>
                </button>
              )}
            </div>
            
            {/* Search & Filter - Redesigned */}
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Intercept data from specific zones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100/60 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-bold placeholder:font-medium placeholder:text-gray-300 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] border border-gray-100/60 shadow-sm">
                <div className="flex items-center gap-2 px-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 rounded-xl py-2">
                  <Filter size={14} /> Risk Scan
                </div>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-4 py-2 bg-transparent rounded-xl focus:ring-0 outline-none transition-all text-sm font-black text-gray-700 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">Critical Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zones Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-50" />
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              </div>
              <p className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600 animate-pulse">Initializing Neural Link...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredZones.map(zone => (
                <ZoneCard 
                  key={zone._id} 
                  zone={zone}
                  canEdit={canManageZones}
                  onEdit={() => openEditModal(zone)}
                  onDelete={() => openDeleteModal(zone)}
                />
              ))}
              
              {filteredZones.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 bg-emerald-50/20 rounded-[3rem] border-2 border-dashed border-emerald-100/50 text-center">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <MapPinned className="text-emerald-100" size={40} />
                  </div>
                  <h3 className="text-lg font-black text-gray-400 tracking-tight mb-2">Perimeter Zero</h3>
                  <p className="text-xs font-medium text-gray-400 max-w-xs">
                    {zones.length === 0 ? "No monitoring nodes have been deployed to the security grid yet." : "No signals matching your search criteria were detected in the sector."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Map */}
        <div className="w-full xl:w-[450px] space-y-6">
          <div className="bg-[#052e16] p-1.5 rounded-[2.5rem] shadow-2xl shadow-emerald-950/40 relative overflow-hidden group border border-emerald-800/30">
            {/* Map Header Overlay */}
            <div className="absolute top-6 left-6 z-10 bg-emerald-950/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-800/50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Satellite Control</span>
            </div>
            
            <div className="h-[400px] xl:h-[700px] rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <ZoneMap zones={zones} />
            </div>
          </div>
        </div>
      </div>

      <AddZoneModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchZones} 
      />

      {showEditModal && (
        <EditZoneModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          zone={selectedZone} 
          onSuccess={fetchZones} 
        />
      )}

      <DeleteZoneModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        zoneName={selectedZone?.name} 
      />
    </Layout>
  );
};

export default ZonesPage;
