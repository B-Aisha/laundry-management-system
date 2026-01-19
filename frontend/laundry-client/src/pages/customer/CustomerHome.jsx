import React from "react";

const CustomerHome = () => {
  return (
    <div className="customer-content">
      <h2>Welcome Back 👋</h2>
      <p>Manage your laundry orders easily from here.</p>

      <div className="card-grid">
        <div className="dashboard-card">Place New Order</div>
        <div className="dashboard-card">Track Laundry Status</div>
        <div className="dashboard-card">View Order History</div>
        <div className="dashboard-card">Notifications</div>
      </div>
    </div>
  );
};

export default CustomerHome;
