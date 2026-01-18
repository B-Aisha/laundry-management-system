import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminHome from "./AdminHome";
import "./admin.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-wrapper">
      <AdminNavbar />

      <div className="admin-body">
        <AdminSidebar isOpen={sidebarOpen} />

        <div className="admin-main">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <AdminHome />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
