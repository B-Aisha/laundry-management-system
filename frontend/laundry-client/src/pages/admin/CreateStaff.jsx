import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CreateStaff = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/users/create-staff", formData);

      alert("Staff created successfully");
      navigate("/admin/staff");
    } catch (error) {
      console.error(error);
      alert("Failed to create staff");
    }
  };

  return (
    <div className="admin-content">
      <h2>Create Staff Account</h2>

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="role-btn">
          Create Staff
        </button>
      </form>
    </div>
  );
};

export default CreateStaff;