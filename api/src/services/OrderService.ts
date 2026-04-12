/**
 * OrderService
 * Handles order retrieval and checkout transaction orchestration.
 */
import pool from "../config/db";
import OrderItemRepository from "../repositories/OrderItemRepository";
import OrderRepository from "../repositories/OrderRepository";
import { Order, OrderWithItems } from "../types/order";
import { IOrderItemCreate } from "../types/orderItem";
import { BadRequestError, NotFoundError } from "../utils/errors";

interface CartCheckoutRow {
  product_id: number;
  quantity: number;
  price: number;
  stock_quantity: number;
}

class OrderService {
  static async getMyOrders(userId: number): Promise<Order[]> {
    return OrderRepository.findByUserId(userId);
  }

  static async getOrderHistory(userId: number): Promise<OrderWithItems[]> {
    const orders = await OrderRepository.findByUserId(userId);

    const history = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItemRepository.findByOrderId(order.id);
        return {
          ...order,
          items,
        };
      })
    );

    return history;
  }

  static async getMyOrderById(userId: number, orderId: number): Promise<OrderWithItems> {
    const order = await OrderRepository.findByIdForUser(orderId, userId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const items = await OrderItemRepository.findByOrderId(order.id);
    return { ...order, items };
  }

  static async checkout(userId: number): Promise<OrderWithItems> {
    const safeUserId = Number(userId);
    const client = await pool.connect();

    try {
      // Checkout is transactional to keep stock/order/cart consistent.
      await client.query("BEGIN");

      const cartResult = await client.query<CartCheckoutRow>(
        "SELECT c.product_id, c.quantity, p.price, p.stock_quantity FROM cart_items c INNER JOIN products p ON p.id = c.product_id WHERE c.user_id = $1 FOR UPDATE OF p",
        [safeUserId]
      );

      if (cartResult.rows.length === 0) {
        throw new BadRequestError("Cart is empty");
      }

      // Validate stock before creating order records.
      for (const row of cartResult.rows) {
        const requestedQty = Number(row.quantity);
        const availableQty = Number(row.stock_quantity);

        if (requestedQty > availableQty) {
          throw new BadRequestError(`Insufficient stock for product ${row.product_id}`);
        }
      }

      const totalPrice = cartResult.rows.reduce((sum, row) => {
        return sum + Number(row.price) * Number(row.quantity);
      }, 0);

      const order = await OrderRepository.create(safeUserId, totalPrice, client);

      const orderItemsPayload: IOrderItemCreate[] = cartResult.rows.map((row) => ({
        product_id: row.product_id,
        quantity: row.quantity,
        price: Number(row.price),
      }));

      const items = await OrderItemRepository.bulkInsert(order.id, orderItemsPayload, client);

      // Re-check in update guard to prevent race conditions under concurrency.
      for (const row of cartResult.rows) {
        const result = await client.query(
          "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1",
          [Number(row.quantity), Number(row.product_id)]
        );

        if (result.rowCount === 0) {
          throw new BadRequestError(`Insufficient stock for product ${row.product_id}`);
        }
      }

      await client.query("DELETE FROM cart_items WHERE user_id = $1", [safeUserId]);
      await client.query("COMMIT");

      return {
        ...order,
        items,
      };
    } catch (error) {
      // Any failure in the sequence must roll back all writes.
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async createFromCart(userId: number): Promise<OrderWithItems> {
    return this.checkout(userId);
  }
}

export default OrderService;

