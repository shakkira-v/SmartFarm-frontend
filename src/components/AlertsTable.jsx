import { useEffect, useState } from "react";
import api from "../api/api";

export default function AlertsTable() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/alerts/recent").then(res => setAlerts(res.data));
  }, []);

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Zone</th>
          <th>Message</th>
          <th>Severity</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map(alert => (
          <tr key={alert._id}>
            <td>{alert.zone?.name}</td>
            <td>{alert.message}</td>
            <td>{alert.severity}</td>
            <td>{alert.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
