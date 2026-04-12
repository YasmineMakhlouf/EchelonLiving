/**
 * OrderController
 * Exposes authenticated endpoints for viewing and creating user orders.
 */
import { Request, Response } from "express";
import OrderService from "../services/OrderService";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

class OrderController {
  static async getOrderHistory(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    // Orders are private data; enforce authentication before querying.
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const orders = await OrderService.getOrderHistory(userId);
    res.json(orders);
  }

  static async getMyOrders(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const orders = await OrderService.getMyOrders(userId);
    res.json(orders);
  }

  static async getMyOrderById(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Route parameter is cast to number for repository/service filtering.
    const orderId = Number(req.params.id);
    const order = await OrderService.getMyOrderById(userId, orderId);
    res.json(order);
  }

  static async createFromCart(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const order = await OrderService.createFromCart(userId);
    res.status(201).json(order);
  }
}

export default OrderController;

