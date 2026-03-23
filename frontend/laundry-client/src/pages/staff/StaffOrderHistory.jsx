import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const StaffOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await api.get(`/orders/staff/${staffId}`);
        // Filter only completed orders
        setOrders(res.data.filter((o) => o.status === "Completed"));
      } catch (err) {
        setError("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) return <div className="staff-content"><p>Loading history...</p></div>;
  if (error) return <div className="staff-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="staff-content">
      <h2>Completed Orders</h2>
      <p>All orders you have successfully completed.</p>

      {/* Summary */}
      <div
        style={{
          background: "white",
          padding: "16px 20px",
          borderRadius: "8px",
          border: "1px solid #eee",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "32px" }}>✅</span>
        <div>
          <h3 style={{ margin: 0 }}>{orders.length}</h3>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>Total Completed Orders</p>
        </div>
      </div>

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <h4>No completed orders yet</h4>
          <p style={{ color: "#888" }}>Orders you complete will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.orderId;

            return (
              <div
                key={order.orderId}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
                      👤 {order.customer.fullName} — {order.customer.phone || order.customer.email}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#aaa" }}>
                      Completed:{" "}
                      {new Date(order.updatedAt || order.createdAt).toLocaleDateString("en-KE", {
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
                        background: "#e8f5e9",
                        color: "#22c55e",
                        border: "1px solid #22c55e",
                      }}
                    >
                      Completed
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
                        <span>{item.serviceName} × {item.quantity}</span>
                        <span>KES {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}

                    <hr style={{ margin: "10px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                      <span>Total</span>
                      <span>KES {order.totalPrice?.toFixed(2)}</span>
                    </div>

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

export default StaffOrderHistory;