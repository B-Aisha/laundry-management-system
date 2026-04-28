import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  Pending: { background: "#fff8e1", color: "#f59e0b", border: "#f59e0b" },
  Processing: { background: "#e8f4fd", color: "#3b82f6", border: "#3b82f6" },
  Completed: { background: "#e8f5e9", color: "#22c55e", border: "#22c55e" },
  Cancelled: { background: "#fdecea", color: "#ef4444", border: "#ef4444" },
};

const paymentStatusStyle = {
  Paid:            { background: "#e8f5e9", color: "#22c55e", border: "#22c55e", label: "Paid" },
  PendingDelivery: { background: "#fff8e1", color: "#f59e0b", border: "#f59e0b", label: "Cash on Delivery" },
  Pending:         { background: "#e8f4fd", color: "#3b82f6", border: "#3b82f6", label: "M-Pesa Pending" },
  Unpaid:          { background: "#fdecea", color: "#ef4444", border: "#ef4444", label: "Unpaid" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, staffRes] = await Promise.all([
          api.get("/orders"),
          api.get("/staff"),
        ]);
        setOrders(ordersRes.data);
        setStaff(staffRes.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleAssignStaff = async (orderId, staffId) => {
    if (!staffId) return;
    try {
      setAssigning(orderId);
      const res = await api.put(`/orders/${orderId}/assign/${staffId}`);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId
            ? {
                ...o,
                status: res.data.status,
                assignedStaff: {
                  staffId: res.data.assignedStaffId,
                  fullName: res.data.assignedStaffName,
                },
              }
            : o
        )
      );
    } catch (err) {
      alert("Failed to assign staff. Please try again.");
    } finally {
      setAssigning(null);
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) return <div className="admin-content"><p>Loading orders...</p></div>;
  if (error) return <div className="admin-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="admin-content">
      <h2>All Orders</h2>
      <p>View and manage all customer laundry orders.</p>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["All", "Pending", "Processing", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontWeight: filterStatus === status ? "700" : "400",
              background: filterStatus === status ? "#2e7d32" : "white",
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧺</div>
          <h4>No orders found</h4>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredOrders.map((order) => {
            const statusStyle = statusColors[order.status] || {};
            const isExpanded = expandedOrderId === order.orderId;
            const pymtStyle = paymentStatusStyle[order.paymentStatus] || null;

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
                      👤 {order.customer.fullName} — {order.customer.email}
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

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <strong>KES {order.totalPrice?.toFixed(2)}</strong>

                    {/* Order status badge */}
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

                    {/* Payment status badge — only shown for Completed orders */}
                    {order.status === "Completed" && pymtStyle && (
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: pymtStyle.background,
                          color: pymtStyle.color,
                          border: `1px solid ${pymtStyle.border}`,
                        }}
                      >
                        {pymtStyle.label}
                      </span>
                    )}

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
                        <span>{item.serviceName} × {item.quantity}</span>
                        <span>KES {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}

                    <hr style={{ margin: "10px 0" }} />

                    {/* Total */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                      <span>Total</span>
                      <span>KES {order.totalPrice?.toFixed(2)}</span>
                    </div>

                    {/* Payment info row — only for Completed orders */}
                    {order.status === "Completed" && order.paymentStatus && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                        }}
                      >
                        <span style={{ color: "#888" }}>Payment</span>
                        <span
                          style={{
                            fontWeight: "600",
                            color: pymtStyle?.color || "#333",
                          }}
                        >
                          {pymtStyle?.label || order.paymentStatus}
                        </span>
                      </div>
                    )}

                    {/* Assign Staff */}
                    <div style={{ marginTop: "16px" }}>
                      <h5 style={{ marginBottom: "8px" }}>
                        👷 Assign Staff
                        {order.assignedStaff && (
                          <span style={{ fontWeight: "400", color: "#22c55e", marginLeft: "8px", fontSize: "13px" }}>
                            — Currently: {order.assignedStaff.fullName}
                          </span>
                        )}
                      </h5>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <select
                          defaultValue={order.assignedStaff?.staffId || ""}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontSize: "14px",
                            flex: 1,
                          }}
                          onChange={(e) => handleAssignStaff(order.orderId, e.target.value)}
                        >
                          <option value="">-- Select Staff --</option>
                          {staff.map((s) => (
                            <option key={s.staffId} value={s.staffId}>
                              {s.fullName} — {s.position}
                            </option>
                          ))}
                        </select>
                        {assigning === order.orderId && (
                          <span style={{ fontSize: "13px", color: "#888" }}>Assigning...</span>
                        )}
                      </div>
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

export default AdminOrders;