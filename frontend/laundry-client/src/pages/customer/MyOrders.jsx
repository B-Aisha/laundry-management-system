import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  Pending:    { background: "#fff8e1", color: "#f59e0b", border: "#f59e0b" },
  Processing: { background: "#e8f4fd", color: "#3b82f6", border: "#3b82f6" },
  Completed:  { background: "#e8f5e9", color: "#22c55e", border: "#22c55e" },
  Cancelled:  { background: "#fdecea", color: "#ef4444", border: "#ef4444" },
};

const paymentStatusStyle = {
  Paid:            { background: "#e8f5e9", color: "#22c55e", border: "#22c55e", label: "Paid" },
  PendingDelivery: { background: "#fff8e1", color: "#f59e0b", border: "#f59e0b", label: "Cash on Delivery" },
  Pending:         { background: "#e8f4fd", color: "#3b82f6", border: "#3b82f6", label: "M-Pesa Pending" },
  Unpaid:          { background: "#fdecea", color: "#ef4444", border: "#ef4444", label: "Unpaid" },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Payment panel state
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        const res = await api.get(`/orders/customer/${customerId}`);
        setOrders(res.data);
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/status`, { status: "Cancelled" });
      setOrders((prev) =>
        prev.map((o) => o.orderId === orderId ? { ...o, status: "Cancelled" } : o)
      );
    } catch {
      alert("Failed to cancel order. Please try again.");
    }
  };

  const openPayment = (orderId) => {
    setPayingOrderId(orderId);
    setSelectedMethod(null);
    setPhone("");
    setPayError("");
    setPaySuccess("");
  };

  const closePayment = () => {
    setPayingOrderId(null);
    setSelectedMethod(null);
    setPhone("");
    setPayError("");
    setPaySuccess("");
  };

  const handleCash = async (orderId) => {
    try {
      setPayLoading(true);
      setPayError("");
      await api.post("/payments/cash", { orderId });
      setPaySuccess("Cash on delivery confirmed! Payment collected on pickup.");
      setOrders((prev) =>
        prev.map((o) => o.orderId === orderId ? { ...o, paymentStatus: "Paid" } : o)
      );
      setTimeout(closePayment, 2500);
    } catch (err) {
      setPayError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to process payment."
      );
    } finally {
      setPayLoading(false);
    }
  };

  const handleMpesa = async (orderId, totalPrice) => {
    if (!phone) {
      setPayError("Please enter your M-Pesa phone number.");
      return;
    }
    try {
      setPayLoading(true);
      setPayError("");
      await api.post("/payments/mpesa", { orderId, phoneNumber: phone });
      setPaySuccess("STK Push sent! Enter your M-Pesa PIN on your phone.");
      setOrders((prev) =>
        prev.map((o) => o.orderId === orderId ? { ...o, paymentStatus: "Pending" } : o)
      );
      setTimeout(closePayment, 3000);
    } catch (err) {
      setPayError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to initiate M-Pesa payment."
      );
    } finally {
      setPayLoading(false);
    }
  };

  const handlePaySubmit = (orderId, totalPrice) => {
    if (selectedMethod === "cash") handleCash(orderId);
    else if (selectedMethod === "mpesa") handleMpesa(orderId, totalPrice);
  };

  if (loading) return <div className="customer-content"><p>Loading orders...</p></div>;
  if (error)   return <div className="customer-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="customer-content">
      <h2>My Orders</h2>
      <p>Track and review all your laundry orders.</p>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "8px", border: "1px solid #eee" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧺</div>
          <h4>No orders yet</h4>
          <p style={{ color: "#888" }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const statusStyle = statusColors[order.status] || {};
            const isExpanded = expandedOrderId === order.orderId;
            const isPaying = payingOrderId === order.orderId;
            const pymtStyle = paymentStatusStyle[order.paymentStatus] || null;
            const canPay = order.status === "Completed" && 
              order.paymentStatus !== "Paid" && 
              order.paymentStatus !== "Pending" && 
              order.paymentStatus !== "PendingDelivery";

            return (
              <div key={order.orderId} style={{ background: "white", borderRadius: "8px", border: "1px solid #eee", overflow: "hidden" }}>

                {/* Order Header */}
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" }}
                  onClick={() => toggleExpand(order.orderId)}
                >
                  <div>
                    <strong>Order #{order.orderId}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric", month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <strong>KES {order.totalPrice?.toFixed(2)}</strong>

                    {/* Payment status badge */}
                    {order.status === "Completed" && pymtStyle && (
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: pymtStyle.background, color: pymtStyle.color, border: `1px solid ${pymtStyle.border}` }}>
                        {pymtStyle.label}
                      </span>
                    )}

                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: statusStyle.background, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                      {order.status}
                    </span>
                    <span style={{ color: "#aaa", fontSize: "18px" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #eee", padding: "16px 20px", background: "#fafafa" }}>

                    {/* Items */}
                    <h5 style={{ marginBottom: "10px" }}>Items</h5>
                    {order.items.map((item) => (
                      <div key={item.orderItemId} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                        <span>{item.serviceName} × {item.quantity}</span>
                        <span>KES {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                    <hr style={{ margin: "10px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                      <span>Total</span>
                      <span>KES {order.totalPrice?.toFixed(2)}</span>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div style={{ marginTop: "12px", padding: "10px", background: "#fff8e1", borderRadius: "6px", fontSize: "13px", color: "#666" }}>
                        📝 <strong>Note:</strong> {order.notes}
                      </div>
                    )}

                    {/* Cancel button */}
                    {order.status === "Pending" && (
                      <div style={{ marginTop: "16px" }}>
                        <button
                          onClick={() => handleCancel(order.orderId)}
                          style={{ padding: "10px 24px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
                        >
                          ❌ Cancel Order
                        </button>
                      </div>
                    )}

                    {/* Pay Now button — only when completed and unpaid */}
                    {canPay && !isPaying && (
                      <div style={{ marginTop: "16px" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); openPayment(order.orderId); }}
                          style={{ padding: "10px 24px", background: "#1abc9c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
                        >
                          💳 Pay Now — KES {order.totalPrice?.toFixed(2)}
                        </button>
                      </div>
                    )}

                    {/* Inline Payment Panel */}
                    {isPaying && (
                      <div style={{ marginTop: "20px", padding: "16px", background: "white", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                        <h5 style={{ marginBottom: "12px" }}>Choose Payment Method</h5>

                        {payError && <div className="auth-error" style={{ marginBottom: "12px" }}>{payError}</div>}
                        {paySuccess && <div className="auth-success" style={{ marginBottom: "12px" }}>{paySuccess}</div>}

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>

                          {/* M-Pesa option */}
                          <div
                            onClick={() => setSelectedMethod("mpesa")}
                            style={{ border: `2px solid ${selectedMethod === "mpesa" ? "#1abc9c" : "#eee"}`, borderRadius: "8px", padding: "14px 16px", cursor: "pointer", transition: "border 0.2s" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "22px" }}>📱</span>
                              <div>
                                <strong style={{ fontSize: "14px" }}>M-Pesa</strong>
                                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>STK Push to your phone</p>
                              </div>
                              {selectedMethod === "mpesa" && <span style={{ marginLeft: "auto", color: "#1abc9c", fontWeight: "700" }}>✓</span>}
                            </div>
                            {selectedMethod === "mpesa" && (
                              <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px" }}>
                                <input
                                  type="text"
                                  placeholder="e.g. 0712345678"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Cash option */}
                          <div
                            onClick={() => setSelectedMethod("cash")}
                            style={{ border: `2px solid ${selectedMethod === "cash" ? "#1abc9c" : "#eee"}`, borderRadius: "8px", padding: "14px 16px", cursor: "pointer", transition: "border 0.2s" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "22px" }}>💵</span>
                              <div>
                                <strong style={{ fontSize: "14px" }}>Cash on Pickup</strong>
                                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>Pay when you collect your laundry</p>
                              </div>
                              {selectedMethod === "cash" && <span style={{ marginLeft: "auto", color: "#1abc9c", fontWeight: "700" }}>✓</span>}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            className="auth-btn"
                            onClick={() => handlePaySubmit(order.orderId, order.totalPrice)}
                            disabled={!selectedMethod || payLoading}
                            style={{ flex: 1 }}
                          >
                            {payLoading
                              ? "Processing..."
                              : selectedMethod === "mpesa"
                              ? `Pay KES ${order.totalPrice?.toFixed(2)} via M-Pesa`
                              : selectedMethod === "cash"
                              ? "Confirm Cash on Pickup"
                              : "Select a method above"}
                          </button>
                          <button
                            onClick={closePayment}
                            style={{ padding: "10px 16px", background: "none", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", color: "#888", fontSize: "14px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;