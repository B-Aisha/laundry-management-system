import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");

    // Optional: remove stored user info
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/auth/login");
  };

  return (
    <div className="admin-navbar">
      <h3>Laundry Admin</h3>
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
};

export default AdminNavbar;