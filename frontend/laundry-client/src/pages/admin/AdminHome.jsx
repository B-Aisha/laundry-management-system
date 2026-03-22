import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="admin-content">
      <h2>Admin Dashboard</h2>

      <div className="card-grid">
        
        <Link to="/admin/users" className="dashboard-card">
      <div className="card-icon">👥</div>
      <h3>Manage Users</h3>
      <p>View and manage all system users</p>
    </Link>

        <Link to="/admin/staff" className="dashboard-card">
      <div className="card-icon">🧑‍💼</div>
      <h3>Manage Staff</h3>
      <p>View and manage staff accounts</p>
    </Link>

    

    <Link to="/admin/orders" className="dashboard-card">
      <div className="card-icon">🧺</div>
      <h3>Laundry Orders</h3>
      <p>Track and manage orders</p>
    </Link>

    <div className="dashboard-card">
      <div className="card-icon">⚙️</div>
      <h3>Services & Pricing</h3>
      <p>Edit services and prices</p>
    </div>

    <div className="dashboard-card">
      <div className="card-icon">📊</div>
      <h3>Reports</h3>
      <p>View business analytics</p>
    </div>


      </div>
    </div>
  );
};

export default AdminHome;
