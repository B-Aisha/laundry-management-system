import React from "react";

const StaffSidebar = ({ isOpen }) => {
  return (
    <div className={`staff-sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li>
          <span className="icon">🏠</span>
          {isOpen && <span className="label">Dashboard</span>}
        </li>
        <li>
          <span className="icon">📦</span>
          {isOpen && <span className="label">Receive Laundry</span>}
        </li>
        <li>
          <span className="icon">🧼</span>
          {isOpen && <span className="label">Processing</span>}
        </li>
        <li>
          <span className="icon">✅</span>
          {isOpen && <span className="label">Ready for Pickup</span>}
        </li>
      </ul>
    </div>
  );
};

export default StaffSidebar;
