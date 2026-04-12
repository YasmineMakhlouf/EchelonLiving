/**
 * UserRepository
 * Handles user persistence and partial updates.
 */
import pool from "../config/db";
import { User, IUserCreate, IUserUpdate } from "../types/user";

class UserRepository {
  static async findAll(): Promise<User[]> {
    const result = await pool.query("SELECT id, name, email, password, role, created_at FROM users");
    return result.rows as User[];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      "SELECT id, name, email, password, role, created_at FROM users WHERE email = $1",
      [email]
    );
    return (result.rows[0] as User) || null;
  }

  static async findById(id: number): Promise<User | null> {
    const userId = Number(id);
    const result = await pool.query("SELECT id, name, email, password, role, created_at FROM users WHERE id = $1", [userId]);
    return (result.rows[0] as User) || null;
  }

  static async create(user: IUserCreate): Promise<User> {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, password, role, created_at",
      [user.name, user.email, user.password, user.role]
    );
    return result.rows[0] as User;
  }

  static async update(id: number, user: IUserUpdate): Promise<User | null> {
    const userId = Number(id);
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    // Build partial-update query from provided fields only.
    if (user.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(user.name);
    }
    if (user.email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(user.email);
    }
    if (user.password) {
      updates.push(`password = $${paramIndex++}`);
      values.push(user.password);
    }
    if (user.role) {
      updates.push(`role = $${paramIndex++}`);
      values.push(user.role);
    }

    if (updates.length === 0) {
      return this.findById(userId);
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, name, email, password, role, created_at`;
    const result = await pool.query(query, values);
    return (result.rows[0] as User) || null;
  }

  static async remove(id: number): Promise<boolean> {
    const userId = Number(id);
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);
    return result.rows.length > 0;
  }
}

export default UserRepository;

