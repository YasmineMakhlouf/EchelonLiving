/**
 * CategoryRepository
 * Handles category persistence and dynamic update statements.
 */
import pool from "../config/db";
import { Category, ICategoryCreate, ICategoryUpdate } from "../types/category";

class CategoryRepository {
  static async findAll(): Promise<Category[]> {
    const result = await pool.query("SELECT id, name, description FROM categories");
    return result.rows as Category[];
  }

  static async findById(id: number): Promise<Category | null> {
    const categoryId = Number(id);
    const result = await pool.query("SELECT id, name, description FROM categories WHERE id = $1", [categoryId]);
    return (result.rows[0] as Category) || null;
  }

  static async create(category: ICategoryCreate): Promise<Category> {
    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description",
      [category.name, category.description]
    );
    return result.rows[0] as Category;
  }

  static async update(id: number, category: ICategoryUpdate): Promise<Category | null> {
    const categoryId = Number(id);
    const updates: string[] = [];
    const values: string[] = [];
    let paramIndex = 1;

    // Build update columns dynamically to support partial PATCH payloads.
    if (category.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(category.name);
    }
    if (category.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(category.description);
    }

    if (updates.length === 0) {
      return this.findById(categoryId);
    }

    const query = `UPDATE categories SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, name, description`;
    const result = await pool.query(query, [...values, String(categoryId)]);
    return (result.rows[0] as Category) || null;
  }

  static async remove(id: number): Promise<boolean> {
    const categoryId = Number(id);
    const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING id", [categoryId]);
    return result.rows.length > 0;
  }
}

export default CategoryRepository;

