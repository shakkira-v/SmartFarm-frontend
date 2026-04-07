import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import EventTable from "../components/EventTable";
import api from "../api/api";
import { Filter, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AlertsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchEvents = async () => {
    try {
      const res = await api.get("/alerts");
      setEvents(res.data);
    } catch (err) {
      console.log("Alerts fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      (e.zone?.name && e.zone.name.toLowerCase().includes(searchString)) || 
      (e.animalType && e.animalType.toLowerCase().includes(searchString)) || 
      (e.severity && e.severity.toLowerCase().includes(searchString));
    const matchesSeverity = severityFilter === "all" || e.severity === severityFilter;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "pending" && e.status !== "resolved") || 
      (statusFilter === "resolved" && e.status === "resolved");
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <Layout 
      title="Security Alerts" 
      subtitle="Complete history of all intrusion detections and system alerts"
    >
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by zone, animal or severity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-600"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold text-gray-600"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Acknowledged</option>
          </select>
        </div>
      </div>

      <EventTable events={filteredEvents} loading={loading} onRefresh={fetchEvents} user={user} />
    </Layout>
  );
};

export default AlertsPage;
