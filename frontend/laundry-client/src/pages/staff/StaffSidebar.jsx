import React from "react";
import { Link } from "react-router-dom";

const StaffSidebar = ({ isOpen }) => {
  return (
    <div className={`staff-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <Link to="/staff" className="sidebar-link">
            <span className="icon">🏠</span>
            {isOpen && <span className="label">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/staff/orders" className="sidebar-link">
            <span className="icon">📦</span>
            {isOpen && <span className="label">My Orders</span>}
          </Link>
        </li>

        <li>
          <Link to="/staff/history" className="sidebar-link">
            <span className="icon">✅</span>
            {isOpen && <span className="label">Completed Orders</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StaffSidebar;