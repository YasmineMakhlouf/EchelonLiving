/**
 * OrderRepository
 * Handles order persistence with backward-compatible price schema support.
 */
import { PoolClient } from "pg";
import pool from "../config/db";
import { Order } from "../types/order";

interface OrderPriceSchema {
  hasTotalPrice: boolean;
  hasFinalPrice: boolean;
  hasStatus: boolean;
}

class OrderRepository {
  private static priceSchemaPromise: Promise<OrderPriceSchema> | null = null;

  private static async resolvePriceSchema(client?: PoolClient): Promise<OrderPriceSchema> {
    if (!this.priceSchemaPromise) {
      const executor = client ?? pool;

      this.priceSchemaPromise = (async () => {
        const result = await executor.query<{ column_name: string }>(
          "SELECT column_name FROM information_schema.columns WHERE table_name = 'orders' AND column_name IN ('total_price', 'final_price', 'status')"
        );

        // Read available columns once and cache for subsequent queries.
        const columnNames = result.rows.map((row) => row.column_name);
        const hasTotalPrice = columnNames.includes("total_price");
        const hasFinalPrice = columnNames.includes("final_price");
        const hasStatus = columnNames.includes("status");

        if (!hasTotalPrice && !hasFinalPrice) {
          throw new Error("orders table is missing both total_price and final_price columns");
        }

        return {
          hasTotalPrice,
          hasFinalPrice,
          hasStatus,
        };
      })();
    }

    return this.priceSchemaPromise;
  }

  private static getSelectPriceExpression(schema: OrderPriceSchema): string {
    if (schema.hasFinalPrice && schema.hasTotalPrice) {
      return "COALESCE(final_price, total_price)";
    }

    return schema.hasFinalPrice ? "final_price" : "total_price";
  }

  static async findByUserId(userId: number, client?: PoolClient): Promise<Order[]> {
    const safeUserId = Number(userId);
    const executor = client ?? pool;
    const priceSchema = await this.resolvePriceSchema(client);
    const selectPriceExpression = this.getSelectPriceExpression(priceSchema);
    const result = await executor.query(
      `SELECT id, user_id, ${selectPriceExpression} AS total_price, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [safeUserId]
    );
    return result.rows as Order[];
  }

  static async findByIdForUser(orderId: number, userId: number, client?: PoolClient): Promise<Order | null> {
    const safeOrderId = Number(orderId);
    const safeUserId = Number(userId);
    const executor = client ?? pool;
    const priceSchema = await this.resolvePriceSchema(client);
    const selectPriceExpression = this.getSelectPriceExpression(priceSchema);
    const result = await executor.query(
      `SELECT id, user_id, ${selectPriceExpression} AS total_price, created_at FROM orders WHERE id = $1 AND user_id = $2`,
      [safeOrderId, safeUserId]
    );
    return (result.rows[0] as Order) || null;
  }

  static async create(userId: number, totalPrice: number, client: PoolClient): Promise<Order> {
    const safeUserId = Number(userId);
    const priceSchema = await this.resolvePriceSchema(client);
    const selectPriceExpression = this.getSelectPriceExpression(priceSchema);

    const columns: string[] = ["user_id"];
    const placeholders: string[] = ["$1"];
    const values: Array<number | string> = [safeUserId];

    if (priceSchema.hasTotalPrice) {
      columns.push("total_price");
      placeholders.push(`$${values.length + 1}`);
      values.push(totalPrice);
    }

    if (priceSchema.hasFinalPrice) {
      columns.push("final_price");
      placeholders.push(`$${values.length + 1}`);
      values.push(totalPrice);
    }

    if (priceSchema.hasStatus) {
      columns.push("status");
      placeholders.push(`$${values.length + 1}`);
      values.push("pending");
    }

    const query =
      `INSERT INTO orders (${columns.join(", ")}, created_at) VALUES (${placeholders.join(", ")}, NOW()) ` +
      `RETURNING id, user_id, ${selectPriceExpression} AS total_price, created_at`;

    const result = await client.query(query, values);
    return result.rows[0] as Order;
  }
}

export default OrderRepository;

