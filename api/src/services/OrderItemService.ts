/**
 * OrderItemService
 * Returns order line items while enforcing ownership checks.
 */
import OrderItemRepository from "../repositories/OrderItemRepository";
import OrderRepository from "../repositories/OrderRepository";
import { OrderItem } from "../types/orderItem";
import { NotFoundError } from "../utils/errors";

class OrderItemService {
  static async getByOrderId(userId: number, orderId: number): Promise<OrderItem[]> {
    const order = await OrderRepository.findByIdForUser(orderId, userId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return OrderItemRepository.findByOrderId(order.id);
  }
}

export default OrderItemService;

