import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const StaffHome = () => {
  const [staffName, setStaffName] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await api.get(`/staff/${staffId}`);
        setStaffName(res.data.fullName);
      } catch (err) {
        // fallback to login-saved user object
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setStaffName(user.fullName || "");
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="staff-content">
      <h2>Welcome Back{staffName ? `, ${staffName} 👋` : " 👋"}</h2>
      <p>Here's what's happening with your laundry operations today.</p>

      <div className="card-grid">
        <div className="dashboard-card">Receive Laundry</div>
        <div className="dashboard-card">Update Status</div>
        <div className="dashboard-card">Completed Orders</div>
      </div>
    </div>
  );
};

export default StaffHome;