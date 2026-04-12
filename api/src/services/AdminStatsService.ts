/**
 * AdminStatsService
 * Aggregates dashboard metrics used by the admin area.
 */
import AdminStatsRepository from "../repositories/AdminStatsRepository";
import { AdminStatsSummary } from "../types/adminStats";

class AdminStatsService {
  static async getSummary(): Promise<AdminStatsSummary> {
    // Read independent metrics concurrently to reduce dashboard latency.
    const [totalUsers, totalOrders, topSellingProducts] = await Promise.all([
      AdminStatsRepository.getTotalUsers(),
      AdminStatsRepository.getTotalOrders(),
      AdminStatsRepository.getTopSellingProducts(5),
    ]);

    return {
      total_users: totalUsers,
      total_orders: totalOrders,
      top_selling_products: topSellingProducts,
    };
  }
}

export default AdminStatsService;

