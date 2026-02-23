import api from "./axios";

export const getAllUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, role, {
    headers: { "Content-Type": "application/json" },
  });
