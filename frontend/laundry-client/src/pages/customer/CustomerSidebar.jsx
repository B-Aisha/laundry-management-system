import React from "react";
import { Link } from "react-router-dom";

const CustomerSidebar = ({ isOpen }) => {
  return (
    <div className={`customer-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <span className="icon">🏠</span>
          {isOpen && <span className="label">Dashboard</span>}
        </li>

        <li>
          <Link to="/customer/new-order" className="sidebar-link">
            <span className="icon">➕</span>
            {isOpen && <span className="label">New Order</span>}
          </Link>
        </li>
    
        <li>
          <Link to="/customer/orders" className="sidebar-link">
            <span className="icon">📦</span>
            {isOpen && <span className="label">My Orders</span>}
          </Link>
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
