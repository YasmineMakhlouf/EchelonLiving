/**
 * AdminUserManagement
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "../../../styles/AdminDashboard.css";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<UserRow[]>("/users");
      setUsers(response.data);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = (id: number, role: "admin" | "customer") => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
  };

  const saveUserRole = async (user: UserRow) => {
    try {
      setSavingUserId(user.id);
      await api.put(`/users/${user.id}`, { role: user.role });
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to update user role");
    } finally {
      setSavingUserId(null);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      setDeletingUserId(userId);
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <main className="admin-page">
      <h1>User Management</h1>
      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(user.id, event.target.value as "admin" | "customer")
                      }
                    >
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="admin-actions-cell">
                    <button
                      className="admin-btn"
                      onClick={() => saveUserRole(user)}
                      disabled={savingUserId === user.id}
                    >
                      {savingUserId === user.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => deleteUser(user.id)}
                      disabled={deletingUserId === user.id}
                    >
                      {deletingUserId === user.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
