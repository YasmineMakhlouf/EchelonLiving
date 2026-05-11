import { pool } from '../../config/database.provider';

export class CatalogEventsRepository {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Catalog events query error:', error);
      throw new Error(`Catalog events query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
