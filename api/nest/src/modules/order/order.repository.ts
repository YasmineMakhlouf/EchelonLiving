import { pool } from '../../config/database.provider';

export class OrderRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Order query error:', error);
      throw new Error(`Order query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
