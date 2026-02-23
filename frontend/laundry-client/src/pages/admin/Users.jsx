import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles({
      ...selectedRoles,
      [userId]: role,
    });
  };

  const updateRole = async (userId) => {
    const role = selectedRoles[userId];

    if (!role) {
      alert("Please select a role first");
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/role`, role, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Role updated successfully");
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/admin/users/${userId}`);

    alert("User deleted successfully");
    fetchUsers(); // refresh list
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user");
  }
};

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-content">
      <h2>Manage Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Action</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>

              <td>
                <select
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Customer">Customer</option>
                </select>
              </td>

              <td>
                <button
                  className="role-btn"
                  onClick={() => updateRole(user.id)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;