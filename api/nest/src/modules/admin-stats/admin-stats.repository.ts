import { Injectable } from '@nestjs/common';
import { pool } from '../../config/database.provider';

@Injectable()
export class AdminStatsRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
