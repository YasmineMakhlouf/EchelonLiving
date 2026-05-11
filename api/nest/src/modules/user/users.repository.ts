import { pool } from '../../config/database.provider';

export class UsersRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Users query error:', error);
      throw new Error(`Users query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
