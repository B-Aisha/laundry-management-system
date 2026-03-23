import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      const res = await api.get(`/notifications/${customerId}`);
      setNotifications(res.data);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      await api.put(`/notifications/${customerId}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <div className="customer-content"><p>Loading notifications...</p></div>;
  if (error) return <div className="customer-content"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="customer-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div>
          <h2>Notifications</h2>
          <p style={{ margin: 0 }}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              padding: "8px 16px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #eee",
            marginTop: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔔</div>
          <h4>No notifications yet</h4>
          <p style={{ color: "#888" }}>We'll notify you when something happens with your orders.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              style={{
                background: n.isRead ? "white" : "#f0fdf4",
                border: `1px solid ${n.isRead ? "#eee" : "#22c55e"}`,
                borderRadius: "8px",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px", marginTop: "2px" }}>
                  {n.isRead ? "🔔" : "🔕"}
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: n.isRead ? "400" : "600" }}>
                    {n.message}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#aaa" }}>
                    {new Date(n.createdAt).toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n.notificationId)}
                  style={{
                    padding: "6px 12px",
                    background: "white",
                    border: "1px solid #22c55e",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#22c55e",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;