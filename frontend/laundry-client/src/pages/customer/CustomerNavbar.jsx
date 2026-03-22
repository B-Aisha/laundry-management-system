import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("customerId");
    

    // Redirect to login
    navigate("/auth/login");
  };
  return (
    <div className="customer-navbar">
      <h3>Laundry Services</h3>
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
};

export default CustomerNavbar;
