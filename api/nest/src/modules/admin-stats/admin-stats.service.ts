import { Injectable } from '@nestjs/common';
import { AdminStatsRepository } from './admin-stats.repository';

@Injectable()
export class AdminStatsService {
  constructor(private readonly repo: AdminStatsRepository) {}

  async getSummary() {
    const totalUsers = await this.repo.query("SELECT COUNT(*)::int as total FROM users");
    const totalOrders = await this.repo.query("SELECT COUNT(*)::int as total FROM orders");
    const top = await this.repo.query("SELECT p.id as product_id, p.name as product_name, SUM(oi.quantity)::int as total_sold FROM products p JOIN order_items oi ON oi.product_id = p.id GROUP BY p.id, p.name ORDER BY total_sold DESC LIMIT 10");

    return {
      total_users: (totalUsers?.[0]?.total) || 0,
      total_orders: (totalOrders?.[0]?.total) || 0,
      top_selling_products: top || [],
    };
  }
}
