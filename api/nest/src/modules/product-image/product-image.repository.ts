import { pool } from '../../config/database.provider';

export class ProductImageRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Product image query error:', error);
      throw new Error(`Product image query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
