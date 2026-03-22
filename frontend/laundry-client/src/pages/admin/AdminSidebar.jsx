import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ isOpen }) => {
  return (
    <div className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <Link to="/admin">
            <span className="icon">🏠</span>
            {isOpen && <span className="label">Dashboard</span>}
          </Link>
        </li>

        <li>
          <Link to="/admin/users">
            <span className="icon">👥</span>
            {isOpen && <span className="label">Manage Users</span>}
          </Link>
        </li>

        <li>
          <Link to="/admin/staff">
            <span className="icon">🧑‍💼</span>
            {isOpen && <span className="label">Manage Staff</span>}
        </Link>
        </li>

        <li>
          <Link to="/admin/orders">
            <span className="icon">🧺</span>
            {isOpen && <span className="label">Orders</span>}
          </Link>
        </li>

        <li>
          <Link to="/admin/services">
            <span className="icon">⚙️</span>
            {isOpen && <span className="label">Services</span>}
          </Link>
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