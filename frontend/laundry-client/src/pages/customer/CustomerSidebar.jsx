import React from "react";

const CustomerSidebar = ({ isOpen }) => {
  return (
    <div className={`customer-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <span className="icon">🏠</span>
          {isOpen && <span className="label">Dashboard</span>}
        </li>
        <li>
          <span className="icon">➕</span>
          {isOpen && <span className="label">New Order</span>}
        </li>
        <li>
          <span className="icon">📦</span>
          {isOpen && <span className="label">My Orders</span>}
        </li>
        <li>
          <span className="icon">🔔</span>
          {isOpen && <span className="label">Notifications</span>}
        </li>
        <li>
          <span className="icon">👤</span>
          {isOpen && <span className="label">Profile</span>}
        </li>
      </ul>
    </div>
  );
};

export default CustomerSidebar;
