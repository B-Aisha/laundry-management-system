import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  Pending: { background: "#fff8e1", color: "#f59e0b", border: "#f59e0b" },
  Processing: { background: "#e8f4fd", color: "#3b82f6", border: "#3b82f6" },
  Completed: { background: "#e8f5e9", color: "#22c55e", border: "#22c55e" },
  Cancelled: { background: "#fdecea", color: "#ef4444", border: "#ef4444" },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        const res = await api.get(`/orders/customer/${customerId}`);
        setOrders(res.data);
      } catch (err) {
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

  if (loading) return <div className="customer-content"><p>Loading orders...</p></div>;
  if (error) return <div className="customer-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="customer-content">
      <h2>My Orders</h2>
      <p>Track and review all your laundry orders.</p>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧺</div>
          <h4>No orders yet</h4>
          <p style={{ color: "#888" }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const statusStyle = statusColors[order.status] || {};
            const isExpanded = expandedOrderId === order.orderId;

            return (
              <div
                key={order.orderId}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                  overflow: "hidden",
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleExpand(order.orderId)}
                >
                  <div>
                    <strong>Order #{order.orderId}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <strong>KES {order.totalPrice?.toFixed(2)}</strong>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: statusStyle.background,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={{ color: "#aaa", fontSize: "18px" }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      padding: "16px 20px",
                      background: "#fafafa",
                    }}
                  >
                    {/* Items */}
                    <h5 style={{ marginBottom: "10px" }}>Items</h5>
                    {order.items.map((item) => (
                      <div
                        key={item.orderItemId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          {item.serviceName} × {item.quantity}
                        </span>
                        <span>KES {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}

                    <hr style={{ margin: "10px 0" }} />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "600",
                      }}
                    >
                      <span>Total</span>
                      <span>KES {order.totalPrice?.toFixed(2)}</span>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "10px",
                          background: "#fff8e1",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#666",
                        }}
                      >
                        📝 <strong>Note:</strong> {order.notes}
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