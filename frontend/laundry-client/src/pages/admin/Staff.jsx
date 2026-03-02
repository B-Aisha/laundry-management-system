import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await api.get("/admin/users");

      // Filter users with role Staff
      const staffUsers = response.data.filter(
        (user) => user.userType === "Staff"
      );
      setStaff(staffUsers);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
    finally {
    setLoading(false);
    }
  };

  useEffect(() => {
  fetchStaff();
  }, []);

  const toggleActive = async (id) => {
  try {
    const response = await api.put(`/admin/users/${id}/toggle-active`);

    setStaff((prevStaff) =>
      prevStaff.map((user) =>
        user.id === id
          ? { ...user, isActive: response.data.isActive }
          : user
      )
    );
  } catch (error) {
    console.error(error);
    alert("Failed to update status");
  }
};

  if (loading) return <p>Loading staff...</p>;

  return (
    <div className="staff-container">
      <h2>Manage Staff Accounts</h2>
      <div className="table-header">
        <Link to="/admin/create-staff" className="add-btn">
        + Add Staff
        </Link>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>
                {user.isActive ? (
                    <span className="active-badge">Active</span>
                ) : (
                    <span className="inactive-badge">Inactive</span>
                )}
                </td>

                <td>
                <button
                    onClick={() => toggleActive(user.id)}
                    className="toggle-btn"
                >
                    {user.isActive ? "Deactivate" : "Activate"}
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Staff;