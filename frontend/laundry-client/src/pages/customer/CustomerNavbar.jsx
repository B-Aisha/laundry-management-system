import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerNavbar = () => {
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
    <div className="customer-navbar">
      <h3>Laundry Services</h3>
      <button className="logout-btn">Sign Out</button>
    </div>
  );
};

export default CustomerNavbar;
