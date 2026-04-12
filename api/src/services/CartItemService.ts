/**
 * CartItemService
 * Encapsulates shopping-cart business logic for customer sessions.
 */
import CartItemRepository from "../repositories/CartItemRepository";
import { CartItem, ICartItemCreate, ICartItemUpdate } from "../types/cartItem";
import { NotFoundError } from "../utils/errors";

class CartItemService {
  static async getCart(userId: number): Promise<CartItem[]> {
    return CartItemRepository.findByUserId(userId);
  }

  static async addToCart(userId: number, data: ICartItemCreate): Promise<CartItem> {
    return CartItemRepository.addOrIncrement(userId, data.product_id, data.quantity);
  }

  static async updateQuantity(userId: number, itemId: number, data: ICartItemUpdate): Promise<CartItem> {
    const updated = await CartItemRepository.updateQuantity(itemId, userId, data.quantity);
    if (!updated) {
      throw new NotFoundError("Cart item not found");
    }
    return updated;
  }

  static async removeItem(userId: number, itemId: number): Promise<boolean> {
    const deleted = await CartItemRepository.remove(itemId, userId);
    if (!deleted) {
      throw new NotFoundError("Cart item not found");
    }
    return deleted;
  }
}

export default CartItemService;

