/**
 * AdminProductStats
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "../../../styles/AdminDashboard.css";

interface TopSellingProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
}

interface AdminStatsSummary {
  total_users: number;
  total_orders: number;
  top_selling_products: TopSellingProduct[];
}

export default function AdminProductStats() {
  const [stats, setStats] = useState<AdminStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<AdminStatsSummary>("/admin/stats");
        setStats(response.data);
      } catch (error) {
        const status = (error as { response?: { status?: number } }).response?.status;

        if (status === 401) {
          return;
        }

        setError("Failed to load product stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="admin-page">
      <h1>Product Stats</h1>
      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <p>Loading stats...</p> : null}

      {stats ? (
        <>
          <section className="admin-kpis">
            <article className="admin-kpi-card">
              <h2>Total Users</h2>
              <p>{stats.total_users}</p>
            </article>
            <article className="admin-kpi-card">
              <h2>Total Orders</h2>
              <p>{stats.total_orders}</p>
            </article>
            <article className="admin-kpi-card">
              <h2>Top Products</h2>
              <p>{stats.top_selling_products.length}</p>
            </article>
          </section>

          <section className="admin-panel">
            <h2>Top-Selling Products</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Total Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_selling_products.map((product) => (
                    <tr key={product.product_id}>
                      <td>{product.product_id}</td>
                      <td>{product.product_name}</td>
                      <td>{product.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
