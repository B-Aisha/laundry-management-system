import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CustomerHome = () => {
  const [customerName, setCustomerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        const res = await api.get(`/customers/${customerId}`);
        setCustomerName(res.data.fullName);
      } catch (err) {
        // fallback: try reading from the user object saved at login
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setCustomerName(user.fullName || "");
      }
    };

    fetchCustomer();
  }, []);

  return (
    <div className="customer-content">
      <h2>Welcome Back {customerName ? `, ${customerName} 👋` : "👋"}</h2>
      <p>Your laundry is in good hands. Manage your laundry orders easily from here.</p>

        <div
          className="dashboard-card accent"
          onClick={() => navigate("/customer/new-order")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-icon">🧺</div>
          <h4>New Order</h4>
          <p>Place a new laundry request easily</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📦</div>
          <h4>Track Laundry</h4>
          <p>Check the current status of your items</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📜</div>
          <h4>Order History</h4>
          <p>View previous laundry orders</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h4>Notifications</h4>
          <p>Stay updated on your laundry progress</p>
        </div>
    </div>
    
  );
};

export default CustomerHome;