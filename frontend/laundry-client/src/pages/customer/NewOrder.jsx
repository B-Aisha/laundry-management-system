import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const NewOrder = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // { serviceId, quantity }
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load available services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data);
      } catch (err) {
        setError("Failed to load services. Please try again.");
      }
    };
    fetchServices();
  }, []);

  // Toggle a service on/off in the order
  const handleServiceToggle = (serviceId) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.serviceId === serviceId);
      if (exists) {
        return prev.filter((i) => i.serviceId !== serviceId);
      } else {
        return [...prev, { serviceId, quantity: 1 }];
      }
    });
  };

  // Update quantity for a selected service
  const handleQuantityChange = (serviceId, value) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.serviceId === serviceId
          ? { ...i, quantity: parseFloat(value) || 1 }
          : i
      )
    );
  };

  // Calculate order total
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const service = services.find((s) => s.serviceId === item.serviceId);
      return total + (service ? service.pricePerUnit * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (selectedItems.length === 0) {
      setError("Please select at least one service.");
      return;
    }

    try {
      setLoading(true);

        const customerId = parseInt(localStorage.getItem("customerId"));

            const res = await api.post("/orders", {
            customerId,
            notes,
            items: selectedItems.map((i) => ({
                serviceId: i.serviceId,
                quantity: i.quantity,
            })),
            });

      setSuccess(`Order #${res.data.orderId} placed successfully!`);
      setSelectedItems([]);
      setNotes("");

      // Redirect to orders list after 2 seconds
      setTimeout(() => navigate("/customer"), 2000);// redirect to customer/orders after making that page
    } catch (err) {
        setError(
  typeof err.response?.data === "string"
    ? err.response.data
    : "Failed to place order. Please try again."
        );


    } finally {
      setLoading(false);
    }
  };

  const isSelected = (serviceId) =>
    selectedItems.some((i) => i.serviceId === serviceId);

  const getQuantity = (serviceId) =>
    selectedItems.find((i) => i.serviceId === serviceId)?.quantity || 1;

  return (
    <div className="customer-content">
      <h2>Place a New Order</h2>
      <p>Select the services you need and we'll take care of the rest.</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Services Grid */}
        <h4 style={{ marginBottom: "12px" }}>Available Services</h4>
        <div className="card-grid">
          {services.map((service) => (
            <div
              key={service.serviceId}
              className={`dashboard-card ${isSelected(service.serviceId) ? "accent" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleServiceToggle(service.serviceId)}
            >
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <p>
                <strong>
                  KES {service.pricePerUnit} / {service.unit}
                </strong>
              </p>

              {/* Quantity input — only show when selected */}
              {isSelected(service.serviceId) && (
                <div
                  onClick={(e) => e.stopPropagation()} // prevent card toggle
                  style={{ marginTop: "10px" }}
                >
                  <label style={{ fontSize: "13px" }}>
                    Quantity ({service.unit}):
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={getQuantity(service.serviceId)}
                    onChange={(e) =>
                      handleQuantityChange(service.serviceId, e.target.value)
                    }
                    style={{
                      width: "80px",
                      marginLeft: "8px",
                      padding: "4px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        {selectedItems.length > 0 && (
          <div
            style={{
              margin: "24px 0",
              padding: "16px",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            <h4>Order Summary</h4>
            {selectedItems.map((item) => {
              const service = services.find((s) => s.serviceId === item.serviceId);
              return (
                <div
                  key={item.serviceId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {service?.name} × {item.quantity} {service?.unit}
                  </span>
                  <span>
                    KES {(service?.pricePerUnit * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Total</strong>
              <strong>KES {calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ marginBottom: "16px" }}>
          <label>
            <strong>Special Instructions (optional)</strong>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Handle with care, separate colors..."
            rows={3}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </div>

        <button
          className="auth-btn"
          type="submit"
          disabled={loading || selectedItems.length === 0}
        >
          {loading ? "Placing Order..." : `Place Order — KES ${calculateTotal().toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default NewOrder;