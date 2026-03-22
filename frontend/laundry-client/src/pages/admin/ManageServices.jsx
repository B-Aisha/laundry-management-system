import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingService, setEditingService] = useState(null); // service being edited
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    unit: "kg",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services/all");
      setServices(res.data);
    } catch (err) {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", pricePerUnit: "", unit: "kg" });
    setEditingService(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description || "",
      pricePerUnit: service.pricePerUnit,
      unit: service.unit,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingService) {
        // Update existing
        await api.put(`/services/${editingService.serviceId}`, form);
        setSuccess("Service updated successfully.");
      } else {
        // Create new
        await api.post("/services", form);
        setSuccess("Service created successfully.");
      }
      resetForm();
      fetchServices();
    } catch (err) {
      setError("Failed to save service. Please try again.");
    }
  };

  const handleToggle = async (serviceId) => {
    try {
      await api.put(`/services/${serviceId}/toggle`);
      fetchServices();
    } catch (err) {
      setError("Failed to toggle service.");
    }
  };

  if (loading) return <div className="admin-content"><p>Loading services...</p></div>;

  return (
    <div className="admin-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2>Manage Services</h2>
          <p>Add, edit, or deactivate laundry services.</p>
        </div>
        <button
          className="add-btn"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? "Cancel" : "+ Add Service"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fdecea", color: "#ef4444", border: "1px solid #ef4444", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#e8f5e9", color: "#22c55e", border: "1px solid #22c55e", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px" }}>
          {success}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="form-container" style={{ maxWidth: "100%", marginBottom: "24px" }}>
          <h4>{editingService ? "Edit Service" : "New Service"}</h4>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Service name e.g. Wash & Fold"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="number"
                placeholder="Price per unit (KES)"
                value={form.pricePerUnit}
                onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                min="0"
                step="0.01"
                required
                style={{ flex: 1 }}
              />
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
              >
                <option value="kg">kg</option>
                <option value="piece">piece</option>
                <option value="bag">bag</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="role-btn">
                {editingService ? "Update Service" : "Create Service"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer", background: "white" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="staff-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.serviceId}>
                <td>{service.serviceId}</td>
                <td><strong>{service.name}</strong></td>
                <td style={{ color: "#666", fontSize: "13px" }}>{service.description || "—"}</td>
                <td>KES {service.pricePerUnit?.toFixed(2)}</td>
                <td>{service.unit}</td>
                <td>
                  <span className={service.isActive ? "active-badge" : "inactive-badge"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="role-btn" onClick={() => handleEdit(service)}>
                    Edit
                  </button>
                  <button
                    className={service.isActive ? "delete-btn" : "role-btn"}
                    onClick={() => handleToggle(service.serviceId)}
                  >
                    {service.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageServices;