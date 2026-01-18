import React, { useState } from "react";
import StaffNavbar from "./StaffNavbar";
import StaffSidebar from "./StaffSidebar";
import StaffHome from "./StaffHome";
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

          <StaffHome />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
