import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  Pending: { background: "#fff8e1", color: "#f59e0b", border: "#f59e0b" },
  Processing: { background: "#e8f4fd", color: "#3b82f6", border: "#3b82f6" },
  Completed: { background: "#e8f5e9", color: "#22c55e", border: "#22c55e" },
  Cancelled: { background: "#fdecea", color: "#ef4444", border: "#ef4444" },
};

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await api.get(`/orders/staff/${staffId}`);
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);
      await api.put(`/orders/${orderId}/status`, { status });

      // Update order in state
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) return <div className="staff-content"><p>Loading orders...</p></div>;
  if (error) return <div className="staff-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="staff-content">
      <h2>My Orders</h2>
      <p>All laundry orders currently assigned to you.</p>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["All", "Processing", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontWeight: filterStatus === status ? "700" : "400",
              background: filterStatus === status ? "#1565c0" : "white",
              color: filterStatus === status ? "white" : "#333",
              transition: "all 0.2s",
            }}
          >
            {status}
            <span style={{ marginLeft: "6px", fontSize: "12px" }}>
              ({status === "All" ? orders.length : orders.filter((o) => o.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
          <h4>No orders found</h4>
          <p style={{ color: "#888" }}>You have no orders assigned to you yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredOrders.map((order) => {
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

                    {/* Action Button — only show if not already Completed or Cancelled */}
                    {order.status === "Processing" && (
                      <div style={{ marginTop: "16px" }}>
                        <button
                          onClick={() => handleUpdateStatus(order.orderId, "Completed")}
                          disabled={updating === order.orderId}
                          style={{
                            padding: "10px 24px",
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px",
                            opacity: updating === order.orderId ? 0.7 : 1,
                          }}
                        >
                          {updating === order.orderId ? "Updating..." : "✅ Mark as Completed"}
                        </button>

                        <button
                        onClick={() => handleUpdateStatus(order.orderId, "Cancelled")}
                        disabled={updating === order.orderId}
                        style={{
                            padding: "10px 24px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px",
                            opacity: updating === order.orderId ? 0.7 : 1,
                        }}
                        >
                        {updating === order.orderId ? "Updating..." : "❌ Cancel Order"}
                        </button>



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

export default StaffOrders;