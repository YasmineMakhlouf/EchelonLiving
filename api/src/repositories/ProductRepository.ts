/**
 * ProductRepository
 * Handles product queries, recommendation lookups, and dynamic filtering.
 */
import pool from "../config/db";
import { IProductCreate, IProductUpdate, Product, ProductWithReviews } from "../types/product";

interface ProductWithReviewRow {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  color: string;
  size: string;
  stock_quantity: number;
  category_id: number;
  created_at: Date;
  category_name: string | null;
  review_id: number | null;
  review_user_id: number | null;
  review_rating: number | null;
  review_comment: string | null;
  review_created_at: Date | null;
  review_user_name: string | null;
}

type PaginationParam = number | string | undefined;

interface ProductQueryOptions {
  page?: PaginationParam;
  limit?: PaginationParam;
  category_id?: PaginationParam;
  categoryId?: PaginationParam;
  min_price?: PaginationParam;
  minPrice?: PaginationParam;
  max_price?: PaginationParam;
  maxPrice?: PaginationParam;
  color?: string;
  size?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

class ProductRepository {
  static async findRecommendedByUser(userId: number, limit = 10): Promise<Product[]> {
    const safeUserId = Number(userId);
    const safeLimit = Math.max(1, Number(limit) || 10);

    const query = `
      WITH purchased_products AS (
        SELECT DISTINCT oi.product_id
        FROM orders o
        INNER JOIN order_items oi ON oi.order_id = o.id
        WHERE o.user_id = $1
      ),
      preferred_categories AS (
        SELECT p.category_id, COUNT(*)::int AS purchase_count
        FROM orders o
        INNER JOIN order_items oi ON oi.order_id = o.id
        INNER JOIN products p ON p.id = oi.product_id
        WHERE o.user_id = $1
        GROUP BY p.category_id
      )
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        pi.image_url,
        p.color,
        p.size,
        p.stock_quantity,
        p.category_id,
        p.created_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY created_at DESC
        LIMIT 1
      ) pi ON TRUE
      LEFT JOIN preferred_categories pc ON pc.category_id = p.category_id
      WHERE p.id NOT IN (SELECT product_id FROM purchased_products)
      ORDER BY
        COALESCE(pc.purchase_count, 0) DESC,
        p.created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [safeUserId, safeLimit]);
    return result.rows as Product[];
  }

  static async findAll(options: ProductQueryOptions = {}): Promise<Product[]> {
    const hasLimit = Object.prototype.hasOwnProperty.call(options, "limit");
    const {
      page = 1,
      limit = 10,
      category_id,
      categoryId,
      min_price,
      minPrice,
      max_price,
      maxPrice,
      color,
      size,
      search,
      sortBy,
      sortOrder,
    } = options;

    const safePage = Math.max(1, Number(page) || 1);
    let safeLimit = Math.max(1, Number(limit) || 10);
    const offset = (safePage - 1) * safeLimit;

    const whereClauses: string[] = [];
    const values: Array<string | number> = [];

    // Build optional filters dynamically while keeping parameterized SQL.
    const resolvedCategoryId = Number(category_id ?? categoryId);
    if (!Number.isNaN(resolvedCategoryId) && resolvedCategoryId > 0) {
      values.push(resolvedCategoryId);
      whereClauses.push(`p.category_id = $${values.length}`);
    }

    const resolvedMinPrice = Number(min_price ?? minPrice);
    if (!Number.isNaN(resolvedMinPrice)) {
      values.push(resolvedMinPrice);
      whereClauses.push(`p.price >= $${values.length}`);
    }

    const resolvedMaxPrice = Number(max_price ?? maxPrice);
    if (!Number.isNaN(resolvedMaxPrice)) {
      values.push(resolvedMaxPrice);
      whereClauses.push(`p.price <= $${values.length}`);
    }

    if (typeof color === "string" && color.trim().length > 0) {
      values.push(color.trim());
      whereClauses.push(`LOWER(TRIM(p.color)) = LOWER(TRIM($${values.length}))`);
    }

    if (typeof size === "string" && size.trim().length > 0) {
      values.push(size.trim());
      whereClauses.push(`p.size = $${values.length}`);
    }

    if (typeof search === "string" && search.trim().length > 0) {
      values.push(`%${search.trim()}%`);
      whereClauses.push(`p.name ILIKE $${values.length}`);
    }

    const isPopularSort = sortBy === "popular";
    const sortColumn = sortBy === "price" ? "p.price" : "p.created_at";
    const sortDirection = typeof sortOrder === "string" && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    if (isPopularSort && !hasLimit) {
      // Popular mode defaults to a larger slice when client does not pass limit.
      const countResult = await pool.query("SELECT COUNT(*)::int AS count FROM products");
      const totalProducts = Number(countResult.rows[0]?.count ?? 0);
      safeLimit = Math.max(1, Math.ceil(totalProducts / 2));
    }

    const offsetValue = isPopularSort && !hasLimit ? 0 : (safePage - 1) * safeLimit;

    let query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        pi.image_url,
        p.color,
        p.size,
        p.stock_quantity,
        p.category_id,
        p.created_at,
        c.name AS category_name,
        COALESCE(cp.cart_add_count, 0) AS cart_add_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY created_at DESC
        LIMIT 1
      ) pi ON TRUE
      LEFT JOIN (
        SELECT product_id, SUM(quantity)::int AS cart_add_count
        FROM cart_items
        GROUP BY product_id
      ) cp ON cp.product_id = p.id`;

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    values.push(safeLimit);
    values.push(offsetValue);
    query += isPopularSort
      ? ` ORDER BY COALESCE(cp.cart_add_count, 0) DESC, p.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`
      : ` ORDER BY ${sortColumn} ${sortDirection} LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return result.rows as Product[];
  }

  static async findById(id: number): Promise<Product | null> {
    const productId = Number(id);
    const result = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        pi.image_url,
        p.color,
        p.size,
        p.stock_quantity,
        p.category_id,
        p.created_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY created_at DESC
        LIMIT 1
      ) pi ON TRUE
      WHERE p.id = $1`,
      [productId]
    );
    return (result.rows[0] as Product) || null;
  }

  static async findByIdWithReviews(id: number): Promise<ProductWithReviews | null> {
    const productId = Number(id);
    const result = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        pi.image_url,
        p.color,
        p.size,
        p.stock_quantity,
        p.category_id,
        p.created_at,
        c.name AS category_name,
        r.id AS review_id,
        r.user_id AS review_user_id,
        r.rating AS review_rating,
        r.comment AS review_comment,
        r.created_at AS review_created_at,
        u.name AS review_user_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY created_at DESC
        LIMIT 1
      ) pi ON TRUE
      LEFT JOIN reviews r ON r.product_id = p.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE p.id = $1
      ORDER BY r.created_at DESC`,
      [productId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const firstRow = result.rows[0] as ProductWithReviewRow;
    const product: ProductWithReviews = {
      id: firstRow.id,
      name: firstRow.name,
      description: firstRow.description,
      price: firstRow.price,
      image_url: firstRow.image_url ?? undefined,
      color: firstRow.color,
      size: firstRow.size,
      stock_quantity: firstRow.stock_quantity,
      category_id: firstRow.category_id,
      created_at: firstRow.created_at,
      category_name: firstRow.category_name ?? undefined,
      reviews: [],
    };

    for (const row of result.rows) {
      if (row.review_id === null) {
        continue;
      }

      product.reviews.push({
        id: row.review_id,
        user_id: row.review_user_id as number,
        rating: row.review_rating as number,
        comment: row.review_comment as string,
        created_at: row.review_created_at as Date,
        user_name: row.review_user_name ?? undefined,
      });
    }

    return product;
  }

  static async create(product: IProductCreate): Promise<Product> {
    const result = await pool.query(
      `WITH inserted AS (
        INSERT INTO products (name, description, price, color, size, stock_quantity, category_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
      )
      SELECT
        i.id,
        i.name,
        i.description,
        i.price,
        pi.image_url,
        i.color,
        i.size,
        i.stock_quantity,
        i.category_id,
        i.created_at,
        c.name AS category_name
      FROM inserted i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = i.id
        ORDER BY created_at DESC
        LIMIT 1
      ) pi ON TRUE`,
      [
        product.name,
        product.description,
        product.price,
        product.color,
        product.size,
        product.stock_quantity,
        product.category_id,
      ]
    );
    return result.rows[0] as Product;
  }

  static async update(id: number, product: IProductUpdate): Promise<Product | null> {
    const productId = Number(id);
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (product.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(product.name);
    }
    if (product.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(product.description);
    }
    if (product.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(product.price);
    }
    if (product.color !== undefined) {
      updates.push(`color = $${paramIndex++}`);
      values.push(product.color);
    }
    if (product.size !== undefined) {
      updates.push(`size = $${paramIndex++}`);
      values.push(product.size);
    }
    if (product.stock_quantity !== undefined) {
      updates.push(`stock_quantity = $${paramIndex++}`);
      values.push(product.stock_quantity);
    }
    if (product.category_id !== undefined) {
      updates.push(`category_id = $${paramIndex++}`);
      values.push(product.category_id);
    }

    if (updates.length === 0) {
      return this.findById(productId);
    }

    values.push(productId);
    const query = `WITH updated AS (
      UPDATE products
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    )
    SELECT
      u.id,
      u.name,
      u.description,
      u.price,
      pi.image_url,
      u.color,
      u.size,
      u.stock_quantity,
      u.category_id,
      u.created_at,
      c.name AS category_name
    FROM updated u
    LEFT JOIN categories c ON u.category_id = c.id
    LEFT JOIN LATERAL (
      SELECT image_url
      FROM product_images
      WHERE product_id = u.id
      ORDER BY created_at DESC
      LIMIT 1
    ) pi ON TRUE`;
    const result = await pool.query(query, values);
    return (result.rows[0] as Product) || null;
  }

  static async remove(id: number): Promise<boolean> {
    const productId = Number(id);
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [productId]);
    return result.rows.length > 0;
  }
}

export default ProductRepository;

