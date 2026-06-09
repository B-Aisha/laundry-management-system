import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const USERS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    setSelectedRoles({ ...selectedRoles, [userId]: role });
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
      fetchUsers();
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
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  // 1. Filter first
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.userType.toLowerCase().includes(query)
    );
  });

  // 2. Then paginate the filtered results
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Reset to page 1 whenever search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-content">
      <h2>Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name, email, or role..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

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
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                  <select
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Customer">Customer</option>
                  </select>
                </td>
                <td>
                  <button className="role-btn" onClick={() => updateRole(user.id)}>
                    Update
                  </button>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            &laquo; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;