/**
 * AdminCategoryManagement
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { emitCatalogChange } from "../../../utils/catalogEvents";
import "../../../styles/AdminDashboard.css";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Category[]>("/categories");
      setCategories(response.data);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setError(null);
      const response = await api.post<Category>("/categories", {
        name: name.trim(),
        description: description.trim(),
      });
      setCategories((prev) => [response.data, ...prev]);
      setName("");
      setDescription("");
      emitCatalogChange();
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to create category");
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingDescription(category.description ?? "");
  };

  const saveEdit = async () => {
    if (!editingId) {
      return;
    }

    try {
      setError(null);
      const response = await api.put<Category>(`/categories/${editingId}`, {
        name: editingName.trim(),
        description: editingDescription.trim(),
      });
      setCategories((prev) => prev.map((c) => (c.id === editingId ? response.data : c)));
      setEditingId(null);
      setEditingName("");
      setEditingDescription("");
      emitCatalogChange();
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to update category");
    }
  };

  const removeCategory = async (id: number) => {
    try {
      setError(null);
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      emitCatalogChange();
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to delete category");
    }
  };

  return (
    <main className="admin-page">
      <h1>Category Management</h1>
      {error ? <p className="admin-error">{error}</p> : null}

      <section className="admin-panel">
        <h2>Create Category</h2>
        <div className="admin-form-grid">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button className="admin-btn" onClick={addCategory}>Add</button>
        </div>
      </section>

      <section className="admin-panel">
        <h2>All Categories</h2>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                      {editingId === category.id ? (
                        <input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td>
                      {editingId === category.id ? (
                        <input
                          value={editingDescription}
                          onChange={(event) => setEditingDescription(event.target.value)}
                        />
                      ) : (
                        category.description
                      )}
                    </td>
                    <td className="admin-actions-cell">
                      {editingId === category.id ? (
                        <>
                          <button className="admin-btn" onClick={saveEdit}>Save</button>
                          <button className="admin-btn admin-btn-secondary" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="admin-btn" onClick={() => startEdit(category)}>
                            Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger"
                            onClick={() => removeCategory(category.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
