import { pool } from '../../config/database.provider';

export class ProductRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Product query error:', error);
      throw new Error(`Product query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
