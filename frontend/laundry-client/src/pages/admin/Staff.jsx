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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

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
          </tr>
        </thead>

        <tbody>
          {staff.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Staff;