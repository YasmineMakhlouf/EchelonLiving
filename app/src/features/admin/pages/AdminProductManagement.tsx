/**
 * AdminProductManagement
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import { emitCatalogChange } from "../../../utils/catalogEvents";
import "../../../styles/AdminDashboard.css";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  size: string;
  stock_quantity: number;
  category_id: number;
  category_name?: string;
}

interface ProductImageResponse {
  id: number;
  product_id: number;
  image_url: string;
}

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  color: string;
  size: string;
  stock_quantity: string;
  category_id: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const initialFormState: ProductFormState = {
  name: "",
  description: "",
  price: "",
  color: "",
  size: "",
  stock_quantity: "",
  category_id: "",
};

export default function AdminProductManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toAbsoluteImageUrl = (url: string): string => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    const baseUrl = api.defaults.baseURL ?? "";
    const apiOrigin = baseUrl.replace(/\/api\/v1\/?$/, "");
    return `${apiOrigin}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
    const apiError = error as {
      response?: {
        status?: number;
        data?: ApiErrorResponse;
      };
      message?: string;
    };

    const status = apiError.response?.status;
    if (status === 401) {
      return "Unauthorized. Please log in again.";
    }

    if (status === 403) {
      return "Only admin users can create or edit products.";
    }

    return (
      apiError.response?.data?.message ||
      apiError.response?.data?.error ||
      apiError.message ||
      fallbackMessage
    );
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.get<Product[] | { data: Product[] }>("/products");
      const payload = Array.isArray(response.data) ? response.data : response.data.data;
      setProducts(payload ?? []);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get<Category[]>("/categories");
        setCategories(response.data);
      } catch (error) {
        const status = (error as { response?: { status?: number } }).response?.status;

        if (status === 401) {
          return;
        }

        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.description.trim().length > 0 &&
      Number(form.price) > 0 &&
      form.color.trim().length > 0 &&
      form.size.trim().length > 0 &&
      Number.isInteger(Number(form.stock_quantity)) &&
      Number(form.stock_quantity) >= 0 &&
      Number(form.category_id) > 0
    );
  }, [form]);

  const setField = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImageFile(null);
    setImagePreviewUrl(null);
    setCurrentImageUrl(null);
    setEditingProductId(null);
  };

  const openDeleteModal = (product: Product) => {
    setDeleteTarget(product);
    setError(null);
    setSuccessMessage(null);
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }
    setDeleteTarget(null);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setSuccessMessage(null);

      await api.delete(`/products/${deleteTarget.id}`);

      emitCatalogChange();

      if (editingProductId === deleteTarget.id) {
        resetForm();
      }

      await loadProducts();
      setSuccessMessage(`Product #${deleteTarget.id} deleted successfully.`);
      setDeleteTarget(null);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const startEditProduct = async (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      color: product.color,
      size: product.size,
      stock_quantity: String(product.stock_quantity),
      category_id: String(product.category_id),
    });
    setImageFile(null);
    setImagePreviewUrl(null);
    setCurrentImageUrl(null);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await api.get<ProductImageResponse[]>(`/products/${product.id}/images`);
      const firstImage = response.data[0];
      if (firstImage?.image_url) {
        setCurrentImageUrl(toAbsoluteImageUrl(firstImage.image_url));
      }
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setCurrentImageUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please fill all required fields correctly.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const productPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        color: form.color.trim(),
        size: form.size.trim(),
        stock_quantity: Number(form.stock_quantity),
        category_id: Number(form.category_id),
      };

      const productResponse = editingProductId
        ? await api.put<Product>(`/products/${editingProductId}`, productPayload)
        : await api.post<Product>("/products", productPayload);
      const product = productResponse.data;

      let uploadedImageUrl: string | null = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await api.post<ProductImageResponse>(
          `/products/${product.id}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedImageUrl = uploadResponse.data.image_url;
      }

      emitCatalogChange();

      await loadProducts();

      if (uploadedImageUrl) {
        setCurrentImageUrl(toAbsoluteImageUrl(uploadedImageUrl));
      }

      if (editingProductId) {
        setSuccessMessage(
          uploadedImageUrl
            ? `Product updated and replacement image uploaded.`
            : "Product updated successfully."
        );
      } else {
        setSuccessMessage(
          uploadedImageUrl
            ? `Product created and image uploaded.`
            : `Product created successfully.`
        );
        resetForm();
      }
    } catch (error) {
      setError(getApiErrorMessage(error, "Failed to save product or upload image."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-page">
      <h1>Product Management</h1>
      {error ? <p className="admin-error">{error}</p> : null}
      {successMessage ? <p className="admin-success">{successMessage}</p> : null}

      <section className="admin-panel">
        <h2>{editingProductId ? `Edit Product #${editingProductId}` : "Create Product"}</h2>
        {loadingCategories ? <p>Loading categories...</p> : null}

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              rows={3}
              required
            />
          </label>

          <div className="admin-product-form-grid">
            <label>
              Price
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) => setField("price", event.target.value)}
                required
              />
            </label>

            <label>
              Color
              <input
                type="text"
                value={form.color}
                onChange={(event) => setField("color", event.target.value)}
                required
              />
            </label>

            <label>
              Size
              <input
                type="text"
                value={form.size}
                onChange={(event) => setField("size", event.target.value)}
                required
              />
            </label>

            <label>
              Stock Quantity
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock_quantity}
                onChange={(event) => setField("stock_quantity", event.target.value)}
                required
              />
            </label>

            <label>
              Category
              <select
                value={form.category_id}
                onChange={(event) => setField("category_id", event.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="admin-file-input-label">
            {editingProductId ? "Replace Product Image" : "Product Image"}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {currentImageUrl ? (
            <div className="admin-image-preview-wrap">
              <p>Current uploaded image</p>
              <img src={currentImageUrl} alt="Current product" className="admin-image-preview" />
            </div>
          ) : null}

          {imagePreviewUrl ? (
            <div className="admin-image-preview-wrap">
              <p>Selected image preview</p>
              <img src={imagePreviewUrl} alt="Product preview" className="admin-image-preview" />
            </div>
          ) : null}

          <div className="admin-actions-row">
            <button type="submit" className="admin-btn" disabled={submitting || loadingCategories || !canSubmit}>
              {submitting ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
            </button>
            {editingProductId ? (
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <h2>All Products</h2>
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category_name ?? product.category_id}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock_quantity}</td>
                    <td className="admin-actions-cell">
                      <button
                        className="admin-btn"
                        onClick={() => startEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => openDeleteModal(product)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {deleteTarget ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <h3>Delete Product</h3>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> (ID: {deleteTarget.id})?
            </p>
            <div className="admin-actions-row">
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={confirmDeleteProduct}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
