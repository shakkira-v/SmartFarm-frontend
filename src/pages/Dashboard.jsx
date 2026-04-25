import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/api";
import { io } from "socket.io-client";
import {
  ShieldAlert,
  MapPinned,
  Radar,
  Users,
  Plus,
  Menu,
  Play,
  Square,
  Zap,
  Activity,
  Thermometer,
  Droplets
} from "lucide-react";
import { toast } from "react-hot-toast";
import StatCard from "../components/StatCard";
import ZoneCard from "../components/ZoneCard";
import AlertChart from "../components/AlertChart";
import ZoneAlertBarChart from "../components/ZoneAlertBarChart";
import AnimalPieChart from "../components/AnimalPieChart";
import ZoneMap from "../components/ZoneMap";
import Sidebar from "../components/Sidebar";
import AddZoneModal from "../components/AddZoneModal";
import EditZoneModal from "../components/EditZoneModal";
import DeleteZoneModal from "../components/DeleteZoneModal";
import EventTable from "../components/EventTable";
import SensorOverview from "../components/SensorOverview";
import UserManagementTable from "../components/UserManagementTable";
import MaintenancePanel from "../components/MaintenancePanel";
import VisionSimulation from "../components/VisionSimulation";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventLoading,setEventLoading] = useState(true);
  const [stats, setStats] = useState({
    totalZones: 0,
    totalSensors: 0,
    activeSensors: 0,
    warningSensors: 0,
    criticalSensors: 0,
    inactiveSensors: 0,
    criticalAlerts: 0,
    totalAlerts: 0,
    intrusionsToday: 0,
    zonesAtRisk: 0,
    usersCount: 0,
    avgTemp: 28,
    avgHumidity: 65
  });
  const [animalData, setAnimalData] = useState([]);
  const [zoneAlertData, setZoneAlertData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [weeklyAlerts, setWeeklyAlerts] = useState([
    { day: "Mon", alerts: 0 },
    { day: "Tue", alerts: 0 },
    { day: "Wed", alerts: 0 },
    { day: "Thu", alerts: 0 },
    { day: "Fri", alerts: 0 },
    { day: "Sat", alerts: 0 },
    { day: "Sun", alerts: 0 }
  ]);

  const socketRef = useRef();
  const audioRef = useRef(new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"));

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isViewer = user?.role === "user";
  
  // High-level role permissions
  const canSeeSimulations = isAdmin || isManager || isViewer;
  const canManageSimulation = isAdmin || isManager; // Allow Admins and Managers to control simulation
  const canManageZones = isAdmin || isManager; // Allow Admins and Managers to manage zones




const fetchStats = useCallback(async () => {
    try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
    } catch (err) {
        console.log("Stats fetch error:", err.message);
    }
}, []);

const fetchZones = useCallback(async () => {
  try {
    const res = await api.get("/dashboard/zones/cards");
    if (Array.isArray(res.data)) {
      setZones(res.data);
    }
  } catch (err) {
    console.log("Zone fetch error:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
}, []);

const fetchAnimalStats = useCallback(async () => {
  try {
    const res = await api.get("/dashboard/animal-stats");
    setAnimalData(res.data);
  } catch (err) {
    console.log("Animal stats fetch error:", err.message);
  }
}, []);

const fetchZoneAlertStats = useCallback(async () => {
  try {
    const res = await api.get("/dashboard/zone-stats");
    setZoneAlertData(res.data);
  } catch (err) {
    console.log("Zone stats fetch error:", err.message);
  }
}, []);

const fetchWeeklyAlerts = useCallback(async () => {
  try {
    const res = await api.get("/dashboard/alerts/graph");
    setWeeklyAlerts(res.data);
  } catch (err) {
    console.log("Weekly alerts fetch error:", err.message);
  }
}, []);

const fetchEvents = useCallback(async () => {
  try {
    const res = await api.get("/dashboard/alerts/recent");
    if (Array.isArray(res.data)) {
      setEvents(res.data);
    }
  } catch (err) {
    console.log("Event fetch error:", err.response?.data || err.message);
  } finally {
    setEventLoading(false);
  }
}, []);

const refreshDashboard = useCallback(() => {
  fetchZones();
  fetchStats();
  fetchAnimalStats();
  fetchZoneAlertStats();
  fetchWeeklyAlerts();
  fetchEvents();
}, [fetchZones, fetchStats, fetchAnimalStats, fetchZoneAlertStats, fetchWeeklyAlerts, fetchEvents]);

  const handleManualTrigger = async () => {
    try {
      const res = await api.post("/simulate/trigger");
      toast.success(res.data.message || "Manual intrusion triggered!", {
        icon: '🔔',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      refreshDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger simulation");
    }
  };

  const toggleSimulation = async () => {
    try {
      if (isSimulating) {
        await api.post("/simulate/stop");
        setIsSimulating(false);
        toast.success("Simulation stopped");
      } else {
        await api.post("/simulate/start", { interval: 3000 });
        setIsSimulating(true);
        toast.success("Simulation started - alerts will generate every 8s", { icon: '⚙️' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Simulation error");
    }
  };

  const fetchSimulationStatus = useCallback(async () => {
    try {
      const res = await api.get("/simulate/status");
      setIsSimulating(res.data.isSimulating);
    } catch (err) {
      console.log("Status fetch error:", err.message);
    }
  }, []);

  useEffect(() => {
    // 🔌 Setup Socket Connection
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const SOCKET_URL = API_URL.replace(/\/api\/?$/, ""); // Remove /api suffix
    socketRef.current = io(SOCKET_URL);

    // 👂 Listen for New Intrusions
    socketRef.current.on("new_intrusion", (data) => {
      console.log("[SOCKET] New Alert:", data);
      
      // 1. Play Alarm Sound 🔊
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => console.log("Audio Auto-play blocked by browser."));

      // 2. Show Premium Toast 🍞
      toast.error(
        () => (
          <div className="flex flex-col gap-1">
            <span className="font-black text-xs uppercase tracking-widest text-white/50">Urgent Intrusion!</span>
            <span className="text-white font-bold">{data.message}</span>
            <span className="text-emerald-400 text-[10px] font-medium">Zone: {data.zone} • Severity: {data.severity}</span>
          </div>
        ),
        {
          duration: 6000,
          style: { background: '#022c22', border: '1px solid #059669', color: '#fff', padding: '16px', borderRadius: '1.5rem' }
        }
      );

      // 3. Instant Data Refresh ⚡
      refreshDashboard();
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [refreshDashboard]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchZones(),
        fetchStats(),
        fetchAnimalStats(),
        fetchZoneAlertStats(),
        fetchWeeklyAlerts(),
        fetchEvents(),
        fetchSimulationStatus()
      ]);
    };
    loadData();
  }, [fetchZones, fetchStats, fetchAnimalStats, fetchZoneAlertStats, fetchWeeklyAlerts, fetchEvents, fetchSimulationStatus]);
const openDeleteModal = (zone) => {
  setSelectedZone(zone);
  setDeleteModalOpen(true);
};

const handleDeleteConfirm = async () => {
    if (!selectedZone) return;
    try {
        await api.delete(`/zones/${selectedZone._id}`);
        refreshDashboard();
        toast.success("Zone deleted successfully 🗑️");
        setDeleteModalOpen(false);
        setSelectedZone(null);
    } catch (err) {
        toast.error("Failed to delete zone");
        console.error("Delete error:", err.message);
    }
};

const updateZone = (zone) => {
  setSelectedZone(zone);
  setShowEditModal(true);
};

const kpiStats = [
  {
    title: "Critical Alerts",
    value: stats.criticalAlerts,
    icon: ShieldAlert,
    color: "bg-red-500"
  },
  {
    title: "Total Alerts",
    value: stats.totalAlerts,
    icon: Zap,
    color: "bg-orange-500"
  },
  {
    title: "Zones At Risk",
    value: stats.zonesAtRisk,
    icon: Activity,
    color: "bg-amber-500"
  },
  {
     title: "Avg Temp",
     value: `${stats.avgTemp}°C`,
     icon: Thermometer,
     color: "bg-amber-600"
  },
  {
     title: "Avg Humidity",
     value: `${stats.avgHumidity}%`,
     icon: Droplets,
     color: "bg-blue-500"
  },
  {
    title: "Active Sensors",
    value: stats.activeSensors,
    icon: Radar,
    color: "bg-emerald-500"
  }
];

  return (
    <Layout 
      title="Dashboard Overview" 
      subtitle="Monitor your farm security status in real-time"
    >
      {isAdmin && stats.pendingApprovals > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <Users size={20} />
            </div>
            <div>
              <p className="font-bold text-amber-900">Personnel Awaiting Approval</p>
              <p className="text-sm text-amber-700">{stats.pendingApprovals} new {stats.pendingApprovals === 1 ? 'user has' : 'users have'} verified their email and need your authorization.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/users'}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-200 active:scale-95"
          >
            Review Now
          </button>
        </div>
      )}

      {/* 📬 Responsive Manager Priority Alert Bar - Emerald Theme */}
      {(isAdmin || isManager) && events.filter(e => e.status === "active" && e.severity === "high").length > 0 && (
        <div className="mb-8 overflow-hidden">
          <div className="bg-emerald-50/80 backdrop-blur-md rounded-2xl shadow-sm border border-emerald-100/50 animate-in slide-in-from-top duration-500">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
              {/* Header Label - Professional Green */}
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white shrink-0">
                <ShieldAlert size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Priority Grid</span>
              </div>
              
              {/* Alert Content Area */}
              <div className="flex-1 p-3 px-5">
                <div className="flex flex-col gap-1.5">
                  {events.filter(e => e.status === "active" && e.severity === "high").slice(0, 1).map((alert) => (
                    <div key={alert._id} className="flex items-start sm:items-center gap-3 text-emerald-900">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 sm:mt-0 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold tracking-tight">
                          {alert.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-600/60 font-mono shrink-0 font-bold">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {events.filter(e => e.status === "active" && e.severity === "high").length > 1 && (
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest pl-4">
                      + {events.filter(e => e.status === "active" && e.severity === "high").length - 1} pending security protocols
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button - Thematized */}
              <div className="p-2 sm:p-3 sm:pl-0">
                <button 
                  onClick={refreshDashboard} 
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border border-emerald-200 shadow-sm active:scale-95"
                >
                  <Activity size={14} /> Acknowledge & Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {kpiStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Simulation Control Panel */}
      {(isAdmin || isManager) && (
        <div className="mb-8 p-8 bg-[#022c22] rounded-[2rem] border border-emerald-900/40 shadow-2xl overflow-hidden relative group">

        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity size={120} className="text-emerald-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1 max-w-xl">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Zap size={26} className="text-amber-400 fill-amber-400" /> 
                Intrusion Simulator
                {isSimulating && (
                  <span className="flex items-center gap-2 ml-4 px-3 py-1 bg-rose-500/20 text-rose-400 text-[10px] uppercase tracking-[0.2em] font-black rounded-full border border-rose-500/30 animate-pulse shadow-lg shadow-rose-900/20">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    Live Sync Active
                  </span>
                )}
              </h2>
              <p className="text-emerald-100/60 mt-2 text-sm font-medium leading-relaxed">
                Security personnel training mode. Initiate synthetic movement signatures to verify immediate relay and automated response logic across the grid.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {canManageSimulation && (
                <>
                  <button 
                    onClick={handleManualTrigger}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-[1.5rem] transition-all font-black text-sm shadow-xl shadow-emerald-950/40 active:scale-[0.97] border border-emerald-600/30"
                  >
                    <Zap size={18} /> Manual Trigger
                  </button>
                  
                  <button 
                    onClick={toggleSimulation}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] border transition-all font-black text-sm active:scale-[0.97] shadow-xl ${
                      isSimulating 
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20 shadow-rose-950/20" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 shadow-emerald-950/20"
                    }`}
                  >
                    {isSimulating ? <><Square size={18} fill="currentColor" /> Stop System</> : <><Play size={18} fill="currentColor" /> Initialize Auto</>}
                  </button>
                </>
              )}
              {!canManageSimulation && (
                <div className="bg-emerald-900/40 px-6 py-3 rounded-2xl border border-emerald-800/30">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Read-Only Simulation Feed</span>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Vision Simulation: Visible to all authorized personnel */}
      {canSeeSimulations && (
        <div className="mb-8">
          <VisionSimulation zones={zones} onRefresh={refreshDashboard} />
        </div>
      )}

      {/* Zone Status Cards Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Zone Status</h2>
          {canManageZones && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              onClick={() =>setShowModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Zone
            </button>
          )}

        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading zones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {zones.slice(0, 8).map((zone) => (
              <ZoneCard 
                key={zone._id} 
                zone={zone} 
                canEdit={isManager}
                onEdit={updateZone}
                onDelete={() => openDeleteModal(zone)}
              />

            ))}
            {zones.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <MapPinned className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No zones defined yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Charts Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 h-[300px] md:h-[400px]">
          <AlertChart data={weeklyAlerts} />
        </div>
        <div className="md:col-span-2 lg:col-span-1 h-[300px] md:h-[400px]">
          <AnimalPieChart data={animalData} />
        </div>
      </div>

      {/* Charts Grid - Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="md:col-span-2 lg:col-span-6 h-[350px] md:h-[450px]">
          <ZoneMap zones={zones} />
        </div>
        <div className="lg:col-span-3">
          <SensorOverview stats={stats} />
        </div>
        <div className="lg:col-span-3 h-[300px] md:h-[400px]">
          <ZoneAlertBarChart data={zoneAlertData} />
        </div>
      </div>

      <div className="mt-8">
        <EventTable events={events} loading={eventLoading} onRefresh={fetchEvents} user={user} />
      </div>

      {(isAdmin || isManager) && (
        <div className="mt-8 pb-12 space-y-8">
          <MaintenancePanel onRefresh={refreshDashboard} user={user} />
          {isAdmin && <UserManagementTable currentUser={user} limit={5} />}
        </div>
      )}


      {/* Modals */}
      <DeleteZoneModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedZone(null);
        }}
        onConfirm={handleDeleteConfirm}
        zoneName={selectedZone?.name}
      />
      <AddZoneModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={refreshDashboard}
      />
      {showEditModal && (
        <EditZoneModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          zone={selectedZone}
          onSuccess={refreshDashboard}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
