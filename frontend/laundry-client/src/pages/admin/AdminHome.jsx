import React from "react";

const AdminHome = () => {
  return (
    <div className="admin-content">
      <h2>Admin Dashboard</h2>

      <div className="card-grid">
        <div className="dashboard-card">Manage Users</div>
        <div className="dashboard-card">Manage Staff</div>
        <div className="dashboard-card">Laundry Orders</div>
        <div className="dashboard-card">Services & Pricing</div>
        <div className="dashboard-card">Reports</div>
      </div>
    </div>
  );
};

export default AdminHome;
