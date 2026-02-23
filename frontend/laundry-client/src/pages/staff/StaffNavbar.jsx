import React from "react";
import { useNavigate } from "react-router-dom";

const StaffNavbar = () => {
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
    <div className="staff-navbar">
      <h3>Laundry Staff</h3>
      <button className="logout-btn">Sign Out</button>
    </div>
  );
};

export default StaffNavbar;
