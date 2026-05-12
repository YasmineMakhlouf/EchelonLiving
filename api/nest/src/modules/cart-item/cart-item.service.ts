import { Injectable } from '@nestjs/common';
import { CartItemRepository } from './cart-item.repository';

@Injectable()
export class CartItemService {
  constructor(private readonly repo: CartItemRepository) {}

  async listForUser(userId: number) {
    const results = await this.repo.query(
      'SELECT c.id, c.user_id, c.product_id, c.quantity, c.price_at_time, p.name AS product_name, p.price FROM cart_items c LEFT JOIN products p ON p.id = c.product_id WHERE c.user_id = $1 ORDER BY c.id DESC',
      [userId]
    );
    return results.map(this.transformCartItem);
  }

  async add(payload: any) {
    const result = await this.repo.query(
      `INSERT INTO cart_items (user_id, product_id, quantity, price_at_time) 
       SELECT $1, $2, $3, p.price FROM products p WHERE p.id = $2 
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity 
       RETURNING *`,
      [payload.user_id, payload.product_id, payload.quantity || 1],
    );
    
    if (!result[0]) return null;
    
    // Fetch product details for the response
    const productResult = await this.repo.query(
      'SELECT name, price FROM products WHERE id = $1',
      [payload.product_id],
    );
    
    const row = result[0];
    row.product_name = productResult[0]?.name;
    row.price = productResult[0]?.price || row.price_at_time;
    
    return this.transformCartItem(row);
  }

  async update(id: number, quantity: number) {
    const result = await this.repo.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id],
    );
    
    if (!result[0]) return null;
    
    const row = result[0];
    
    // Fetch product details for the response
    const productResult = await this.repo.query(
      'SELECT name, price FROM products WHERE id = $1',
      [row.product_id],
    );
    
    row.product_name = productResult[0]?.name;
    row.price = productResult[0]?.price || row.price_at_time;
    
    return this.transformCartItem(row);
  }

  async remove(id: number) {
    const result = await this.repo.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [id]);
    return this.transformCartItem(result[0]) || null;
  }

  private transformCartItem(row: any) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      productId: row.product_id,
      quantity: row.quantity,
      product_name: row.product_name,
      price: row.price || row.price_at_time,
      created_at: row.created_at,
      price_at_time: row.price_at_time,
    };
  }
}
