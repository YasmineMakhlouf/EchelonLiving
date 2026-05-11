import { pool } from '../../config/database.provider';

export class ReviewRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Review query error:', error);
      throw new Error(`Review query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
