import { Injectable } from '@nestjs/common';
import { CartItemRepository } from './cart-item.repository';

@Injectable()
export class CartItemService {
  constructor(private readonly repo: CartItemRepository) {}

  async listForUser(userId: number) {
    return this.repo.query('SELECT * FROM cart_items WHERE user_id = $1 ORDER BY id DESC', [userId]);
  }

  async add(payload: any) {
    const result = await this.repo.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [payload.user_id, payload.product_id, payload.quantity || 1],
    );
    return result[0];
  }

  async update(id: number, quantity: number) {
    const result = await this.repo.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id],
    );
    return result[0] || null;
  }

  async remove(id: number) {
    const result = await this.repo.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [id]);
    return result[0] || null;
  }
}
