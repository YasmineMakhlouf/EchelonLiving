/**
 * OrderItemRepository
 * Persists order line items with schema-compatible price column handling.
 */
import { PoolClient } from "pg";
import pool from "../config/db";
import { IOrderItemCreate, OrderItem } from "../types/orderItem";

class OrderItemRepository {
  private static itemPriceColumnPromise: Promise<"price" | "price_at_purchase"> | null = null;

  private static async resolveItemPriceColumn(client?: PoolClient): Promise<"price" | "price_at_purchase"> {
    if (!this.itemPriceColumnPromise) {
      const executor = client ?? pool;

      this.itemPriceColumnPromise = (async () => {
        const result = await executor.query<{ column_name: string }>(
          "SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items' AND column_name IN ('price', 'price_at_purchase')"
        );

        const columnNames = result.rows.map((row) => row.column_name);

        // Support both legacy and newer schemas without branching elsewhere.
        if (columnNames.includes("price_at_purchase")) {
          return "price_at_purchase";
        }

        if (columnNames.includes("price")) {
          return "price";
        }

        throw new Error("order_items table is missing both price and price_at_purchase columns");
      })();
    }

    return this.itemPriceColumnPromise;
  }

  static async findByOrderId(orderId: number, client?: PoolClient): Promise<OrderItem[]> {
    const safeOrderId = Number(orderId);
    const executor = client ?? pool;
    const priceColumn = await this.resolveItemPriceColumn(client);
    const result = await executor.query(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.${priceColumn} AS price, p.name AS product_name, p.description AS product_description, p.color AS product_color, p.size AS product_size, c.name AS product_category_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id LEFT JOIN categories c ON p.category_id = c.id WHERE oi.order_id = $1 ORDER BY oi.id DESC`,
      [safeOrderId]
    );
    return result.rows as OrderItem[];
  }

  static async bulkInsert(orderId: number, items: IOrderItemCreate[], client: PoolClient): Promise<OrderItem[]> {
    if (items.length === 0) {
      return [];
    }

    const safeOrderId = Number(orderId);
  const priceColumn = await this.resolveItemPriceColumn(client);
    const values: Array<number> = [];
    const placeholders: string[] = [];

    for (const item of items) {
      const baseIndex = values.length + 1;
      placeholders.push(`($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`);
      values.push(safeOrderId, Number(item.product_id), Number(item.quantity), Number(item.price));
    }

    const query =
      `INSERT INTO order_items (order_id, product_id, quantity, ${priceColumn}) VALUES ` +
      placeholders.join(", ") +
      ` RETURNING id, order_id, product_id, quantity, ${priceColumn} AS price`;

    const result = await client.query(query, values);
    return result.rows as OrderItem[];
  }
}

export default OrderItemRepository;

