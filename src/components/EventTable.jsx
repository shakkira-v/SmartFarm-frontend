import { useState } from "react";
import { Eye, CheckCircle, X, Clock, MapPin, Activity, AlertTriangle, ShieldCheck, Cpu, Trash2, Video, Download, PlayCircle, Search, Filter } from "lucide-react";
import api from "../api/api";
import { toast } from "react-hot-toast";

const EventTable = ({ events, loading, onRefresh, user }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ackLoading, setAckLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterAnimal, setFilterAnimal] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const isManager = user?.role === "manager";
  const canManageEvents = isManager; // Restrict management to Manager

  // 🔍 Advanced Filtering Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      (event.message?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (event.animalType?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (event.zone?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesZone = filterZone === "all" || event.zone?.name === filterZone;
    const matchesAnimal = filterAnimal === "all" || event.animalType === filterAnimal;
    const matchesSeverity = filterSeverity === "all" || event.severity === filterSeverity;

    return matchesSearch && matchesZone && matchesAnimal && matchesSeverity;
  });

  // Extract unique values for filter dropdowns
  const uniqueZones = [...new Set(events.map(e => e.zone?.name).filter(Boolean))];
  const uniqueAnimals = [...new Set(events.map(e => e.animalType).filter(Boolean))];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this alert record?")) {
      try {
        await api.delete(`/alerts/${id}`);
        toast.success("Alert deleted");
        if (onRefresh) onRefresh();
      } catch {
        toast.error("Delete failed");
      }
    }
  };


  const handleAcknowledge = async (eventId) => {
    setAckLoading(eventId);
    try {
      await api.put(`/alerts/${eventId}/resolve`);
      toast.success("Event acknowledged");
      if (onRefresh) onRefresh();
      if (selectedEvent?._id === eventId) {
        setSelectedEvent({ ...selectedEvent, status: "resolved" });
      }
    } catch (error) {
      console.error("Error acknowledging event:", error);
      toast.error("Failed to acknowledge event");
    } finally {
      setAckLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (events.length === 0) {
      toast.error("No events to export");
      return;
    }

    const headers = ["Date", "Time", "Zone", "Animal", "Method", "Severity", "Status"];
    const rows = events.map(event => [
      new Date(event.detectedAt || event.createdAt).toLocaleDateString(),
      new Date(event.detectedAt || event.createdAt).toLocaleTimeString(),
      event.zone?.name || "Unknown",
      event.animalType || "Unknown",
      event.detectionMethod || "Sensor",
      event.severity,
      event.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `farm_security_report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported Successfully!");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Intrusion Events
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor and respond to real-time security alerts
          </p>
        </div>
        <div className="flex items-center gap-4">
           {events.length > 0 && (
             <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-emerald-200 active:scale-95"
             >
                <Download size={14} /> Export CSV
             </button>
           )}
           <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live View</span>
           </div>
        </div>
      </div>

      {/* 🔍 Search & Filter Bar */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative group col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Zone Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
          >
            <option value="all">All Zones</option>
            {uniqueZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
          </select>
        </div>

        {/* Animal Filter */}
        <div className="relative">
          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
            value={filterAnimal}
            onChange={(e) => setFilterAnimal(e.target.value)}
          >
            <option value="all">All Animals</option>
            {uniqueAnimals.map(animal => <option key={animal} value={animal}>{animal}</option>)}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="relative">
          <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="all">Any Severity</option>
            <option value="high">High Only</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Detected At</th>
              <th className="px-6 py-4">Zone</th>
              <th className="px-6 py-4">Animal</th>
              <th className="px-6 py-4">Detecting Node</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Search size={40} className="opacity-20" />
                    <p className="font-medium">No matches found for your criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr
                  key={event._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* 🕒 DETECTED TIME */}
                  <td className="px-6 py-4 text-nowrap">
                    <div className="flex items-center gap-2">
                       <Clock size={14} className="text-gray-400" />
                       <div>
                          <div className="font-semibold text-gray-800">
                            {new Date(event.detectedAt || event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium text-nowrap">
                            {new Date(event.detectedAt || event.createdAt).toLocaleDateString()}
                          </div>
                       </div>
                    </div>
                  </td>

                  {/* 🌾 ZONE NAME */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                      <MapPin size={14} className="text-blue-500 shrink-0" />
                      <span className="truncate max-w-[120px]" title={event.zone?.name}>
                        {event.zone?.name || "Unknown Zone"}
                      </span>
                    </div>
                  </td>

                  {/* 🐾 ANIMAL TYPE */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold capitalize">
                      <Activity size={12} />
                      {event.animalType || "unknown"}
                    </span>
                  </td>

                  {/* 📡 DETECTING SENSOR */}
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                      {event.sensor?.name || (event.detectionMethod === "vision" ? "Vision AI" : "Global")}
                    </span>
                    {event.detectionMethod === "vision" && (
                      <span className="ml-2 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">
                        Vision
                      </span>
                    )}
                  </td>

                  {/* ⚠️ SEVERITY */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        event.severity === "high"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : event.severity === "medium"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-green-50 text-green-600 border-green-100"
                      }`}
                    >
                      {event.severity}
                    </span>
                  </td>

                  {/* 📌 STATUS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        event.status === "resolved" ? "bg-green-500" : "bg-orange-500 animate-pulse"
                      }`}></div>
                      <span className={`text-sm font-bold ${
                        event.status === "resolved" ? "text-green-600" : "text-orange-600"
                      }`}>
                        {event.status === "resolved" ? "Acknowledged" : "Pending"}
                      </span>
                    </div>
                  </td>

                  {/* 🎯 ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all active:scale-90"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {event.detectionMethod === "vision" && (
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all active:scale-90"
                          title="Replay Footage"
                        >
                          <PlayCircle size={18} />
                        </button>
                      )}
                      {event.status !== "resolved" && canManageEvents && (
                        <button 
                          onClick={() => handleAcknowledge(event._id)}
                          disabled={ackLoading === event._id}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all active:scale-90 disabled:opacity-50"
                          title="Acknowledge"
                        >
                          {ackLoading === event._id ? (
                            <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle size={18} />
                          )}
                        </button>
                      )}
                      {canManageEvents && (
                        <button 
                          onClick={() => handleDelete(event._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                          title="Delete Alert"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card List - Mobile & Tablet View */}
      <div className="lg:hidden divide-y divide-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
             <Search size={40} className="mx-auto opacity-20 mb-2" />
             <p className="font-medium">No matches found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id} className="p-4 space-y-4 hover:bg-gray-50 transition-colors border-r border-gray-50 last:border-r-0">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                    event.status === 'resolved' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'
                  }`} />
                  <div>
                    <p className="text-sm font-black text-gray-800 leading-tight">
                      {event.animalType || "Unidentified"} Intrusion
                    </p>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {event.zone?.name || 'Unknown Zone'}
                    </p>
                    {event.detectionMethod === 'vision' && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-1 border border-emerald-100 rounded mt-1">
                        <Video size={8} /> VIDEO VISION
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                  event.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                  event.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {event.severity}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] text-gray-400 font-bold flex flex-col">
                   <span>{new Date(event.detectedAt || event.createdAt).toLocaleDateString()}</span>
                   <span>{new Date(event.detectedAt || event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="p-2 text-blue-600 bg-blue-50 rounded-xl"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  {event.detectionMethod === "vision" && (
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="p-2 text-emerald-600 bg-emerald-50 rounded-xl"
                      title="Replay Footage"
                    >
                      <PlayCircle size={16} />
                    </button>
                  )}
                  {event.status !== 'resolved' && (
                    <button 
                      onClick={() => handleAcknowledge(event._id)}
                      disabled={ackLoading === event._id}
                      className="p-2 text-green-600 bg-green-50 rounded-xl"
                    >
                      {ackLoading === event._id ? <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={16} />}
                    </button>
                  )}
                  {isManager && (
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-red-500 bg-red-50 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      {/* View Event Modal: Redesigned for better accessibility on all screens */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto flex flex-col max-h-[95vh] sm:max-h-[90vh]">
            {/* Modal Header */}
            <div className={`p-6 flex justify-between items-center text-white ${
              selectedEvent.severity === "high" ? "bg-red-600" : 
              selectedEvent.severity === "medium" ? "bg-amber-500" : "bg-green-600"
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} />
                <div>
                  <h3 className="text-xl font-bold">Event Details</h3>
                  <p className="text-xs opacity-80 font-medium uppercase tracking-widest">
                    ID: {selectedEvent._id.slice(-8)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body: Scrollable area */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detection Time</p>
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    {new Date(selectedEvent.detectedAt || selectedEvent.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zone Location</p>
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {selectedEvent.zone?.name || "Unknown"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Animal Type</p>
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    <span className="capitalize">{selectedEvent.animalType}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Triggering Sensor</p>
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    <Cpu size={16} className="text-blue-500" />
                    <span className="capitalize">{selectedEvent.sensor?.name || "Global Network"}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${selectedEvent.status === 'resolved' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <p className={`font-bold ${selectedEvent.status === 'resolved' ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedEvent.status === 'resolved' ? 'Acknowledged' : 'Pending Response'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detection Method</p>
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    {selectedEvent.detectionMethod === 'vision' ? <Video size={16} className="text-emerald-500" /> : <Cpu size={16} className="text-blue-500" />}
                    <span className="capitalize">{selectedEvent.detectionMethod || 'Sensor Network'}</span>
                  </p>
                </div>
              </div>

              {selectedEvent.videoUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-black aspect-video relative group">
                  <video 
                    src={selectedEvent.videoUrl} 
                    controls 
                    autoPlay
                    loop
                    className="w-full h-full object-cover opacity-80"
                    style={{ filter: 'grayscale(1) sepia(1) hue-rotate(85deg) saturate(2) brightness(0.8)' }}
                  />
                  
                  {/* 🎯 AI Tracking Overlay (Simulated for Replay) */}
                  {selectedEvent.detectionMethod === 'vision' && (
                    <>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        {/* Bounding Box */}
                        <div className="w-24 h-24 border border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-start justify-start">
                           <div className="bg-red-600 text-white text-[7px] px-1 font-black uppercase whitespace-nowrap -mt-4">
                              LOCKED: {selectedEvent.animalType}
                           </div>
                        </div>
                        {/* Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
                          <div className="w-6 h-6 border border-emerald-400/40 rounded-full animate-pulse -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
                        </div>
                      </div>

                      {/* AI Meta Data Tags */}
                      <div className="absolute bottom-12 right-4 text-right pointer-events-none font-mono">
                        <p className="text-[7px] text-emerald-400 font-bold uppercase">SIG: {selectedEvent.animalType}</p>
                        <p className="text-[7px] text-emerald-400 font-bold uppercase">CONF: 94.2%</p>
                        <p className="text-[7px] text-emerald-400 font-bold uppercase">NODE: AI_VISION_0X</p>
                      </div>

                      <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded text-[7px] text-emerald-400 font-black uppercase tracking-widest animate-pulse">
                        Replay Tracking Active
                      </div>
                    </>
                  )}

                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[9px] text-white font-bold uppercase tracking-widest">
                    Event Footage
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message/Alert Details</p>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {selectedEvent.message || `An intrusion was detected by the ${selectedEvent.animalType} in ${selectedEvent.zone?.name || 'the area'}. Please take necessary precautions.`}
                </p>
              </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  {selectedEvent.status !== "resolved" && (
                    <button
                      onClick={() => handleAcknowledge(selectedEvent._id)}
                      disabled={ackLoading === selectedEvent._id}
                      className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {ackLoading === selectedEvent._id ? (
                        <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <><CheckCircle size={20} /> Acknowledge Event</>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all active:scale-95"
                  >
                    Dismiss
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTable;
