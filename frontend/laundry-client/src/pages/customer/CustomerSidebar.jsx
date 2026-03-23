import React from "react";
import { Link } from "react-router-dom";

const CustomerSidebar = ({ isOpen }) => {
  return (
    <div className={`customer-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <Link to="/customer" className="sidebar-link">
            <span className="icon">🏠</span>
            {isOpen && <span className="label">Dashboard</span>}
          </Link>
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
          <Link to="/customer/notifications" className="sidebar-link">
            <span className="icon">🔔</span>
            {isOpen && <span className="label">Notifications</span>}
          </Link>
        </li>

        <li>
          <Link to="/customer/profile" className="sidebar-link">
            <span className="icon">👤</span>
            {isOpen && <span className="label">Profile</span>}
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default CustomerSidebar;
