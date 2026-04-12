/**
 * ProductImageRepository
 * Persists product image metadata and retrieval queries.
 */
import pool from "../config/db";
import { ProductImage } from "../types/productImage";

class ProductImageRepository {
  static async create(productId: number, imageUrl: string): Promise<ProductImage> {
    const safeProductId = Number(productId);
    const result = await pool.query(
      "INSERT INTO product_images (product_id, image_url, created_at) VALUES ($1, $2, NOW()) RETURNING id, product_id, image_url, created_at",
      [safeProductId, imageUrl]
    );

    return result.rows[0] as ProductImage;
  }

  static async findByProductId(productId: number): Promise<ProductImage[]> {
    const safeProductId = Number(productId);
    const result = await pool.query(
      "SELECT id, product_id, image_url, created_at FROM product_images WHERE product_id = $1 ORDER BY created_at DESC",
      [safeProductId]
    );

    return result.rows as ProductImage[];
  }
}

export default ProductImageRepository;

