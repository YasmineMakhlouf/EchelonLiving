/**
 * CartItemRepository
 * Persists user cart data and cart-quantity mutations.
 */
import pool from "../config/db";
import { CartItem } from "../types/cartItem";

class CartItemRepository {
  static async findByUserId(userId: number): Promise<CartItem[]> {
    const safeUserId = Number(userId);
    const result = await pool.query(
      "SELECT c.id, c.user_id, c.product_id, c.quantity, c.price_at_time, p.name AS product_name, COALESCE(c.price_at_time, p.price) AS price FROM cart_items c LEFT JOIN products p ON p.id = c.product_id WHERE c.user_id = $1 ORDER BY c.id DESC",
      [safeUserId]
    );
    return result.rows as CartItem[];
  }

  static async addOrIncrement(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const safeUserId = Number(userId);
    const safeProductId = Number(productId);
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    // Upsert-like flow: increment existing item, otherwise insert a new row.
    const existing = await pool.query(
      "SELECT id, user_id, product_id, quantity, price_at_time FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [safeUserId, safeProductId]
    );

    if (existing.rows[0]) {
      const updated = await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 AND user_id = $3 RETURNING id, user_id, product_id, quantity, price_at_time",
        [safeQuantity, existing.rows[0].id, safeUserId]
      );
      return updated.rows[0] as CartItem;
    }

    const inserted = await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity, price_at_time) SELECT $1, $2, $3, p.price FROM products p WHERE p.id = $2 RETURNING id, user_id, product_id, quantity, price_at_time",
      [safeUserId, safeProductId, safeQuantity]
    );

    if (inserted.rows.length === 0) {
      const error = new Error("Product not found") as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    return inserted.rows[0] as CartItem;
  }

  static async updateQuantity(itemId: number, userId: number, quantity: number): Promise<CartItem | null> {
    const safeItemId = Number(itemId);
    const safeUserId = Number(userId);
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    const result = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING id, user_id, product_id, quantity, price_at_time",
      [safeQuantity, safeItemId, safeUserId]
    );

    return (result.rows[0] as CartItem) || null;
  }

  static async remove(itemId: number, userId: number): Promise<boolean> {
    const safeItemId = Number(itemId);
    const safeUserId = Number(userId);

    const result = await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [safeItemId, safeUserId]
    );

    return result.rows.length > 0;
  }
}

export default CartItemRepository;

