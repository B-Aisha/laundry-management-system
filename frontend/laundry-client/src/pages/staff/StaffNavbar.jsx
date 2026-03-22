import React from "react";
import { useNavigate } from "react-router-dom";

const StaffNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("staffId");

    // Redirect to login
    navigate("/auth/login");
  };
  return (
    <div className="staff-navbar">
      <h3>Laundry Staff</h3>
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
};

export default StaffNavbar;
