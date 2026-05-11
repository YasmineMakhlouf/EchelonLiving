import { pool } from '../../config/database.provider';

export class CategoryRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Category query error:', error);
      throw new Error(`Category query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
