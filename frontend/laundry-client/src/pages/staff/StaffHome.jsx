import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const StaffHome = () => {
  const [staffName, setStaffName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await api.get(`/staff/${staffId}`);
        setStaffName(res.data.fullName);
      } catch (err) {
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
        <div
          className="dashboard-card staff-accent"
          onClick={() => navigate("/staff/orders")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-icon">📦</div>
          <h4>My Orders</h4>
          <p>View all orders assigned to you</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/staff/orders")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-icon">🧼</div>
          <h4>Processing</h4>
          <p>Orders currently being processed</p>
        </div>

        <div
            className="dashboard-card"
            onClick={() => navigate("/staff/history")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon">✅</div>
            <h4>Completed</h4>
            <p>Orders you have completed</p>
          </div>
      </div>
    </div>
  );
};

export default StaffHome;