import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        const res = await api.get(`/customers/${customerId}`);
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const customerId = localStorage.getItem("customerId");
      const res = await api.put(`/customers/${customerId}`, form);
      setProfile(res.data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="customer-content"><p>Loading profile...</p></div>;

  return (
    <div className="customer-content">
      <h2>My Profile</h2>
      <p>View and manage your personal information.</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          border: "1px solid #eee",
          maxWidth: "500px",
        }}
      >
        {!isEditing ? (
          // --- READ VIEW ---
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Personal Details</h4>
              <button
                onClick={() => { setIsEditing(true); setSuccess(""); }}
                style={{
                  padding: "8px 18px",
                  background: "#1abc9c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                ✏️ Edit
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>FULL NAME</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                  {profile?.fullName || <span style={{ color: "#bbb" }}>Not set</span>}
                </p>
              </div>

              <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>EMAIL</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                  {profile?.email || <span style={{ color: "#bbb" }}>Not set</span>}
                </p>
              </div>

              <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>PHONE</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                  {profile?.phone || <span style={{ color: "#bbb" }}>Not set</span>}
                </p>
              </div>

              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>ADDRESS</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                  {profile?.address || <span style={{ color: "#bbb" }}>Not set</span>}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // --- EDIT VIEW ---
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Edit Details</h4>
              <button
                onClick={() => { setIsEditing(false); setError(""); }}
                style={{
                  padding: "8px 18px",
                  background: "white",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Your full name"
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 0712345678"
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Nairobi, Kenya"
                  rows={3}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;