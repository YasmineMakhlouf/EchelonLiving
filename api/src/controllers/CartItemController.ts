/**
 * CartItemController
 * Handles authenticated shopping-cart operations for the current user.
 */
import { Request, Response } from "express";
import CartItemService from "../services/CartItemService";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

class CartItemController {
  static async getMyCart(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    // Cart endpoints are user-scoped and require an authenticated identity.
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const cartItems = await CartItemService.getCart(userId);
    res.json(cartItems);
  }

  static async addToCart(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const cartItem = await CartItemService.addToCart(userId, req.body);
    res.status(201).json(cartItem);
  }

  static async updateQuantity(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Route params arrive as strings; convert before passing to services.
    const itemId = Number(req.params.id);
    const cartItem = await CartItemService.updateQuantity(userId, itemId, req.body);
    res.json(cartItem);
  }

  static async removeItem(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const itemId = Number(req.params.id);
    await CartItemService.removeItem(userId, itemId);
    res.status(204).send();
  }
}

export default CartItemController;

