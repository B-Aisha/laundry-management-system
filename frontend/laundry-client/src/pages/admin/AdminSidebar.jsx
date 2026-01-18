import React from "react";

const AdminSidebar = ({ isOpen }) => {
  return (
    <div className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <span className="icon">🏠</span>
          {isOpen && <span className="label">Dashboard</span>}
        </li>
        <li>
          <span className="icon">👥</span>
          {isOpen && <span className="label">Manage Users</span>}
        </li>
        <li>
          <span className="icon">🧺</span>
          {isOpen && <span className="label">Orders</span>}
        </li>
        <li>
          <span className="icon">⚙️</span>
          {isOpen && <span className="label">Services</span>}
        </li>
        <li>
          <span className="icon">📊</span>
          {isOpen && <span className="label">Reports</span>}
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
