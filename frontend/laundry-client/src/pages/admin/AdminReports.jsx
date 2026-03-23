import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  Pending: "#f59e0b",
  Processing: "#3b82f6",
  Completed: "#22c55e",
  Cancelled: "#ef4444",
};

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/reports/summary");
        setReport(res.data);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div className="admin-content"><p>Loading reports...</p></div>;
  if (error) return <div className="admin-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="admin-content">
      <h2>Reports & Analytics</h2>
      <p>Overview of your laundry business performance.</p>

      {/* Top Summary Cards */}
      <div className="card-grid" style={{ marginBottom: "30px" }}>
        <div className="dashboard-card" style={{ textAlign: "left" }}>
          <div className="card-icon">💰</div>
          <h3>KES {report.totalRevenue.toFixed(2)}</h3>
          <p>Total Revenue (Completed Orders)</p>
        </div>

        <div className="dashboard-card" style={{ textAlign: "left" }}>
          <div className="card-icon">🧺</div>
          <h3>{report.totalOrders}</h3>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card" style={{ textAlign: "left" }}>
          <div className="card-icon">✅</div>
          <h3>
            {report.ordersByStatus.find((s) => s.status === "Completed")?.count || 0}
          </h3>
          <p>Completed Orders</p>
        </div>

        <div className="dashboard-card" style={{ textAlign: "left" }}>
          <div className="card-icon">⚙️</div>
          <h3>
            {report.ordersByStatus.find((s) => s.status === "Processing")?.count || 0}
          </h3>
          <p>Orders In Progress</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

        {/* Orders By Status */}
        <div className="staff-container">
          <h4 style={{ marginBottom: "16px" }}>Orders by Status</h4>
          {report.ordersByStatus.length === 0 ? (
            <p style={{ color: "#888" }}>No data available.</p>
          ) : (
            report.ordersByStatus.map((item) => {
              const percent = Math.round((item.count / report.totalOrders) * 100);
              return (
                <div key={item.status} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "14px" }}>
                    <span style={{ fontWeight: "600", color: statusColors[item.status] || "#333" }}>
                      {item.status}
                    </span>
                    <span>{item.count} orders ({percent}%)</span>
                  </div>
                  <div style={{ background: "#eee", borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: statusColors[item.status] || "#ccc",
                        borderRadius: "10px",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Top Services */}
        <div className="staff-container">
          <h4 style={{ marginBottom: "16px" }}>Top Services</h4>
          {report.topServices.length === 0 ? (
            <p style={{ color: "#888" }}>No data available.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Qty Used</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {report.topServices.map((service) => (
                  <tr key={service.serviceName}>
                    <td><strong>{service.serviceName}</strong></td>
                    <td>{service.totalQuantity}</td>
                    <td>KES {service.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Staff Performance */}
      <div className="staff-container">
        <h4 style={{ marginBottom: "16px" }}>Staff Performance</h4>
        {report.staffPerformance.length === 0 ? (
          <p style={{ color: "#888" }}>No staff data available.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Total Assigned</th>
                <th>Completed</th>
                <th>Processing</th>
                <th>Cancelled</th>
                <th>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {report.staffPerformance.map((staff) => {
                const rate = staff.totalAssigned > 0
                  ? Math.round((staff.completed / staff.totalAssigned) * 100)
                  : 0;
                return (
                  <tr key={staff.staffName}>
                    <td><strong>{staff.staffName}</strong></td>
                    <td>{staff.totalAssigned}</td>
                    <td>
                      <span className="active-badge">{staff.completed}</span>
                    </td>
                    <td>{staff.processing}</td>
                    <td>
                      {staff.cancelled > 0
                        ? <span className="inactive-badge">{staff.cancelled}</span>
                        : staff.cancelled}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ background: "#eee", borderRadius: "10px", height: "8px", width: "80px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${rate}%`,
                              height: "100%",
                              background: rate >= 75 ? "#22c55e" : rate >= 50 ? "#f59e0b" : "#ef4444",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "13px" }}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReports;