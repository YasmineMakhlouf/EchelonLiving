import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';

type ProductQueryOptions = {
  page?: string | number;
  limit?: string | number;
  category_id?: string | number;
  categoryId?: string | number;
  min_price?: string | number;
  minPrice?: string | number;
  max_price?: string | number;
  maxPrice?: string | number;
  color?: string;
  size?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

type ProductWritePayload = {
  name?: string;
  description?: string;
  price?: number;
  color?: string;
  size?: string;
  stock_quantity?: number;
  category_id?: number;
};

@Injectable()
export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async list(filters: ProductQueryOptions = {}) {
    const whereClauses: string[] = [];
    const values: Array<string | number> = [];

    const resolvedCategoryId = Number(filters.category_id ?? filters.categoryId);
    if (!Number.isNaN(resolvedCategoryId) && resolvedCategoryId > 0) {
      values.push(resolvedCategoryId);
      whereClauses.push(`p.category_id = $${values.length}`);
    }

    const resolvedMinPrice = Number(filters.min_price ?? filters.minPrice);
    if (!Number.isNaN(resolvedMinPrice)) {
      values.push(resolvedMinPrice);
      whereClauses.push(`p.price >= $${values.length}`);
    }

    const resolvedMaxPrice = Number(filters.max_price ?? filters.maxPrice);
    if (!Number.isNaN(resolvedMaxPrice)) {
      values.push(resolvedMaxPrice);
      whereClauses.push(`p.price <= $${values.length}`);
    }

    if (typeof filters.color === 'string' && filters.color.trim()) {
      values.push(filters.color.trim());
      whereClauses.push(`LOWER(TRIM(p.color)) = LOWER(TRIM($${values.length}))`);
    }

    if (typeof filters.size === 'string' && filters.size.trim()) {
      values.push(filters.size.trim());
      whereClauses.push(`p.size = $${values.length}`);
    }

    if (typeof filters.search === 'string' && filters.search.trim()) {
      values.push(`%${filters.search.trim()}%`);
      whereClauses.push(`p.name ILIKE $${values.length}`);
    }

    const safeLimit = Math.max(1, Number(filters.limit) || 100);
    const safePage = Math.max(1, Number(filters.page) || 1);
    const isPopularSort = filters.sortBy === 'popular';
    const sortColumn = filters.sortBy === 'price' ? 'p.price' : 'p.created_at';
    const sortDirection = typeof filters.sortOrder === 'string' && filters.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (safePage - 1) * safeLimit;

    let query = `
      SELECT
        p.id,
        p.name,
        p.price,
        p.description,
        p.color,
        p.size,
        p.stock_quantity,
        p.category_id,
        c.name AS category_name,
        pi.image_url,
        COALESCE(cp.cart_add_count, 0) AS cart_add_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
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
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    values.push(safeLimit);
    values.push(offset);
    query += isPopularSort
      ? ` ORDER BY COALESCE(cp.cart_add_count, 0) DESC, p.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`
      : ` ORDER BY ${sortColumn} ${sortDirection} LIMIT $${values.length - 1} OFFSET $${values.length}`;

    return this.repo.query(query, values);
  }

  async getById(id: number) {
    const rows = await this.repo.query(`SELECT
      p.id,
      p.name,
      p.price,
      p.description,
      p.color,
      p.size,
      p.stock_quantity,
      p.category_id,
      c.name AS category_name,
      pi.image_url
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN LATERAL (
      SELECT image_url
      FROM product_images
      WHERE product_id = p.id
      ORDER BY created_at DESC
      LIMIT 1
    ) pi ON TRUE
    WHERE p.id = $1`, [id]);
    return rows[0] || null;
  }

  async create(payload: ProductWritePayload) {
    const rows = await this.repo.query(
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
        payload.name,
        payload.description,
        payload.price,
        payload.color,
        payload.size,
        payload.stock_quantity,
        payload.category_id,
      ],
    );

    return rows[0];
  }

  async update(id: number, payload: ProductWritePayload) {
    const updates: string[] = [];
    const values: Array<string | number> = [];
    let paramIndex = 1;

    if (payload.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(payload.name);
    }
    if (payload.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(payload.description);
    }
    if (payload.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(payload.price);
    }
    if (payload.color !== undefined) {
      updates.push(`color = $${paramIndex++}`);
      values.push(payload.color);
    }
    if (payload.size !== undefined) {
      updates.push(`size = $${paramIndex++}`);
      values.push(payload.size);
    }
    if (payload.stock_quantity !== undefined) {
      updates.push(`stock_quantity = $${paramIndex++}`);
      values.push(payload.stock_quantity);
    }
    if (payload.category_id !== undefined) {
      updates.push(`category_id = $${paramIndex++}`);
      values.push(payload.category_id);
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const rows = await this.repo.query(
      `WITH updated AS (
        UPDATE products
        SET ${updates.join(', ')}
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
      ) pi ON TRUE`,
      values,
    );

    if (!rows[0]) {
      throw new NotFoundException('Product not found');
    }

    return rows[0];
  }

  async remove(id: number) {
    const rows = await this.repo.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (!rows[0]) {
      throw new NotFoundException('Product not found');
    }
  }
}
