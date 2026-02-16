import React from "react";

const StaffHome = () => {
  return (
    <div className="staff-content">
      <h2>Welcome back, Staff 👋</h2>
<p>Here's what's happening with today's tasks.</p>



      <div className="card-grid">
        <div className="dashboard-card">Receive Laundry</div>
        <div className="dashboard-card">Update Status</div>
        <div className="dashboard-card">Completed Orders</div>
      </div>
    </div>
  );
};

export default StaffHome;
