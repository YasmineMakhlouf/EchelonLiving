import { pool } from '../../config/database.provider';

export class DesignRequestRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Design request query error:', error);
      throw new Error(`Design request query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
