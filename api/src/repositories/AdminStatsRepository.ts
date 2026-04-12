/**
 * AdminStatsRepository
 * Executes read-only aggregate queries for admin reporting.
 */
import pool from "../config/db";
import { TopSellingProduct } from "../types/adminStats";

class AdminStatsRepository {
  static async getTotalUsers(): Promise<number> {
    const result = await pool.query("SELECT COUNT(*)::text AS count FROM users");
    return Number((result.rows[0] as { count: string })?.count ?? 0);
  }

  static async getTotalOrders(): Promise<number> {
    const result = await pool.query("SELECT COUNT(*)::text AS count FROM orders");
    return Number((result.rows[0] as { count: string })?.count ?? 0);
  }

  static async getTopSellingProducts(limit = 5): Promise<TopSellingProduct[]> {
    // Clamp limit so callers cannot request invalid or huge negative pages.
    const safeLimit = Math.max(1, Number(limit) || 5);

    const result = await pool.query(
      "SELECT p.id AS product_id, p.name AS product_name, COALESCE(SUM(oi.quantity), 0)::int AS total_sold FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id GROUP BY p.id, p.name ORDER BY total_sold DESC, p.name ASC LIMIT $1",
      [safeLimit]
    );

    return result.rows as TopSellingProduct[];
  }
}

export default AdminStatsRepository;

