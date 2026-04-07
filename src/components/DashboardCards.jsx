import { useEffect, useState } from "react";
import api from "../api/api";

export default function DashboardCards() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/dashboard/stats").then(res => setStats(res.data));
  }, []);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div>Zones: {stats.totalZones}</div>
      <div>Sensors: {stats.totalSensors}</div>
      <div>Active Alerts: {stats.activeAlerts}</div>
      <div>Zones at Risk: {stats.zonesAtRisk}</div>
    </div>
  );
}
