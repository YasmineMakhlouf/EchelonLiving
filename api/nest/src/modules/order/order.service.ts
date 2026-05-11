import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';

type OrderRow = {
  id: number;
  user_id: number;
  total_price: number | string;
  created_at?: string;
  status?: string;
};

type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price?: number;
  product_name?: string;
  product_description?: string;
  product_color?: string;
  product_size?: string;
  product_category_name?: string;
};

@Injectable()
export class OrderService {
  constructor(private readonly repo: OrderRepository) {}

  async getById(id: number) {
    const rows = await this.repo.query('SELECT * FROM orders WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async getHistoryForUser(userId: number) {
    const orders = (await this.repo.query(
      'SELECT id, user_id, total_price, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC, id DESC',
      [userId],
    )) as OrderRow[];

    if (orders.length === 0) {
      return [];
    }

    const orderIds = orders.map((order) => order.id);
    const items = (await this.repo.query(
      `SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.quantity,
        p.price,
        p.name AS product_name,
        p.description AS product_description,
        p.color AS product_color,
        p.size AS product_size,
        c.name AS product_category_name
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE oi.order_id = ANY($1::int[])
      ORDER BY oi.id ASC`,
      [orderIds],
    )) as OrderItemRow[];

    return orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      total: String(order.total_price),
      status: order.status ?? 'pending',
      createdAt: order.created_at,
      items: items
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.id,
          orderId: item.order_id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product_name: item.product_name,
          product_description: item.product_description,
          product_color: item.product_color,
          product_size: item.product_size,
          product_category_name: item.product_category_name,
        })),
    }));
  }

  async create(payload: any) {
    const totalPrice = payload.total_price ?? payload.total ?? 0;
    const result = await this.repo.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *',
      [payload.user_id, totalPrice],
    );
    const created = result[0];

    return {
      id: created.id,
      userId: created.user_id,
      total: String(created.total_price ?? totalPrice),
      status: created.status ?? 'pending',
      createdAt: created.created_at,
    };
  }
}
