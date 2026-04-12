/**
 * OrderItemController
 * Returns line items belonging to a user-owned order.
 */
import { Request, Response } from "express";
import OrderItemService from "../services/OrderItemService";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

class OrderItemController {
  static async getByOrderId(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    // Protect order item lookup behind authentication.
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Parse order id from URL segment before handing off to service layer.
    const orderId = Number(req.params.orderId);
    const items = await OrderItemService.getByOrderId(userId, orderId);
    res.json(items);
  }
}

export default OrderItemController;

