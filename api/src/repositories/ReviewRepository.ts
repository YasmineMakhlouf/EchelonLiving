/**
 * ReviewRepository
 * Persists review records and joins product/user display fields.
 */
import pool from "../config/db";
import { IReviewCreate, IReviewUpdate, Review } from "../types/review";

class ReviewRepository {
  static async findAll(): Promise<Review[]> {
    const result = await pool.query(
      "SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at, p.name AS product_name, u.name AS user_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id LEFT JOIN users u ON r.user_id = u.id"
    );
    return result.rows as Review[];
  }

  static async findById(id: number): Promise<Review | null> {
    const reviewId = Number(id);
    const result = await pool.query(
      "SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at, p.name AS product_name, u.name AS user_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id LEFT JOIN users u ON r.user_id = u.id WHERE r.id = $1",
      [reviewId]
    );
    return (result.rows[0] as Review) || null;
  }

  static async create(review: IReviewCreate): Promise<Review> {
    const result = await pool.query(
      "WITH inserted AS (INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *) SELECT i.id, i.product_id, i.user_id, i.rating, i.comment, i.created_at, p.name AS product_name, u.name AS user_name FROM inserted i LEFT JOIN products p ON i.product_id = p.id LEFT JOIN users u ON i.user_id = u.id",
      [review.product_id, review.user_id, review.rating, review.comment]
    );
    return result.rows[0] as Review;
  }

  static async update(id: number, review: IReviewUpdate): Promise<Review | null> {
    const reviewId = Number(id);
    const updates: string[] = [];
    const values: Array<number | string> = [];
    let paramIndex = 1;

    if (review.product_id !== undefined) {
      updates.push(`product_id = $${paramIndex++}`);
      values.push(review.product_id);
    }
    if (review.user_id !== undefined) {
      updates.push(`user_id = $${paramIndex++}`);
      values.push(review.user_id);
    }
    if (review.rating !== undefined) {
      updates.push(`rating = $${paramIndex++}`);
      values.push(review.rating);
    }
    if (review.comment !== undefined) {
      updates.push(`comment = $${paramIndex++}`);
      values.push(review.comment);
    }

    if (updates.length === 0) {
      return this.findById(reviewId);
    }

    values.push(reviewId);
    const query = `WITH updated AS (UPDATE reviews SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *) SELECT u.id, u.product_id, u.user_id, u.rating, u.comment, u.created_at, p.name AS product_name, usr.name AS user_name FROM updated u LEFT JOIN products p ON u.product_id = p.id LEFT JOIN users usr ON u.user_id = usr.id`;
    const result = await pool.query(query, values);
    return (result.rows[0] as Review) || null;
  }

  static async remove(id: number): Promise<boolean> {
    const reviewId = Number(id);
    const result = await pool.query<Review>("DELETE FROM reviews WHERE id = $1 RETURNING id", [reviewId]);
    return result.rows.length > 0;
  }
}

export default ReviewRepository;

