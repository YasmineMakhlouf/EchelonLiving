import { pool } from '../../config/database.provider';

export class AuthRepository {
  async findByEmail(email: string) {
    try {
      const result = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('findByEmail error:', error);
      throw error;
    }
  }

  async createUser(payload: { name?: string | null; email: string; password_hash: string; role?: string }) {
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [payload.name, payload.email, payload.password_hash, payload.role || 'customer'],
      );
      return result.rows[0];
    } catch (error) {
      console.error('createUser error:', error);
      throw error;
    }
  }
}
