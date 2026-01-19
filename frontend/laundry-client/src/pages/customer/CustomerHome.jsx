import React from "react";

const CustomerHome = () => {
  return (
    <div className="customer-content">
      <h2>Welcome Back 👋</h2>
      <p>Your laundry is in good hands. Manage your laundry orders easily from here.</p>

     <div className="card-grid">
  <div className="dashboard-card accent">
    <div className="card-icon">🧺</div>
    <h4>New Order</h4>
    <p>Place a new laundry request easily</p>
  </div>

  <div className="dashboard-card">
    <div className="card-icon">📦</div>
    <h4>Track Laundry</h4>
    <p>Check the current status of your items</p>
  </div>

  <div className="dashboard-card">
    <div className="card-icon">📜</div>
    <h4>Order History</h4>
    <p>View previous laundry orders</p>
  </div>

  <div className="dashboard-card">
    <div className="card-icon">🔔</div>
    <h4>Notifications</h4>
    <p>Stay updated on your laundry progress</p>
  </div>
</div>

    </div>
  );
};

export default CustomerHome;
