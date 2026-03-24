import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!orderId) {
    return (
      <div className="customer-content">
        <p>No order found. Please place an order first.</p>
      </div>
    );
  }

  const handleCash = async () => {
    try {
      setLoading(true);
      setError("");
      await api.post("/payments/cash", { orderId });
      setSuccess("Cash on delivery selected! Payment will be collected upon delivery.");
      setTimeout(() => navigate("/customer/orders"), 2000);
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to process payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMpesa = async () => {
    if (!phone) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/payments/mpesa", { orderId, phoneNumber: phone });
      setSuccess("STK Push sent! Check your phone and enter your M-Pesa PIN.");
      setTimeout(() => navigate("/customer/orders"), 3000);
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to initiate M-Pesa payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedMethod === "cash") handleCash();
    else if (selectedMethod === "mpesa") handleMpesa();
  };

  return (
    <div className="customer-content">
      <h2>Complete Payment</h2>
      <p>Choose how you'd like to pay for your order.</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      {/* Order Summary */}
      <div
        style={{
          background: "white",
          padding: "16px 20px",
          borderRadius: "8px",
          border: "1px solid #eee",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>Order #{orderId}</strong>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>
            Select a payment method below
          </p>
        </div>
        <strong style={{ fontSize: "18px" }}>KES {totalPrice?.toFixed(2)}</strong>
      </div>

      {/* Payment Methods */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>

        {/* M-Pesa */}
        <div
          onClick={() => setSelectedMethod("mpesa")}
          style={{
            background: "white",
            border: `2px solid ${selectedMethod === "mpesa" ? "#1abc9c" : "#eee"}`,
            borderRadius: "8px",
            padding: "16px 20px",
            cursor: "pointer",
            transition: "border 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>📱</span>
            <div>
              <strong>M-Pesa</strong>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#888" }}>
                Pay via STK Push — you'll get a prompt on your phone
              </p>
            </div>
            {selectedMethod === "mpesa" && (
              <span style={{ marginLeft: "auto", color: "#1abc9c", fontWeight: "700" }}>✓</span>
            )}
          </div>

          {/* Phone input — only show when selected */}
          {selectedMethod === "mpesa" && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: "12px" }}
            >
              <input
                type="text"
                placeholder="Enter M-Pesa number e.g. 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div
          onClick={() => setSelectedMethod("cash")}
          style={{
            background: "white",
            border: `2px solid ${selectedMethod === "cash" ? "#1abc9c" : "#eee"}`,
            borderRadius: "8px",
            padding: "16px 20px",
            cursor: "pointer",
            transition: "border 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>💵</span>
            <div>
              <strong>Cash on Delivery</strong>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#888" }}>
                Pay in cash when your laundry is delivered
              </p>
            </div>
            {selectedMethod === "cash" && (
              <span style={{ marginLeft: "auto", color: "#1abc9c", fontWeight: "700" }}>✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="auth-btn"
        onClick={handleSubmit}
        disabled={!selectedMethod || loading}
        style={{ width: "100%", maxWidth: "500px" }}
      >
        {loading
          ? "Processing..."
          : selectedMethod === "mpesa"
          ? `Pay KES ${totalPrice?.toFixed(2)} via M-Pesa`
          : selectedMethod === "cash"
          ? "Confirm Cash on Delivery"
          : "Select a payment method"}
      </button>

      <button
        onClick={() => navigate("/customer/orders")}
        style={{
          marginTop: "12px",
          background: "none",
          border: "none",
          color: "#888",
          cursor: "pointer",
          fontSize: "13px",
          display: "block",
        }}
      >
        Skip for now → Go to My Orders
      </button>
    </div>
  );
};

export default Payment;