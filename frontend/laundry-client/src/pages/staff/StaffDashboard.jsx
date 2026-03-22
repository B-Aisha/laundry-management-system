import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffNavbar from "./StaffNavbar";
import StaffSidebar from "./StaffSidebar";
import "./staff.css";

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="staff-wrapper">
      <StaffNavbar />

      <div className="staff-body">
        <StaffSidebar isOpen={sidebarOpen} />

        <div className="staff-main">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;