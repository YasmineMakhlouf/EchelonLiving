"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("./product.repository");
let ProductService = class ProductService {
    constructor(repo) {
        this.repo = repo;
    }
    async list(filters = {}) {
        const whereClauses = [];
        const values = [];
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
    async getById(id) {
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
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], ProductService);
//# sourceMappingURL=product.service.js.map