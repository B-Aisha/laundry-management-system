import React, { useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHome from "./CustomerHome";
import "./customer.css";

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="customer-wrapper">
      <CustomerNavbar />

      <div className="customer-body">
        <CustomerSidebar isOpen={sidebarOpen} />

        <div className="customer-main">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <CustomerHome />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
