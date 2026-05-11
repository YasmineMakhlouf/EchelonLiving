import { pool } from '../../config/database.provider';

export class CartItemRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Cart item query error:', error);
      throw new Error(`Cart item query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
