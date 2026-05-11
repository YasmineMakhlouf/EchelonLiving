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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const order_repository_1 = require("./order.repository");
let OrderService = class OrderService {
    constructor(repo) {
        this.repo = repo;
    }
    async getById(id) {
        const rows = await this.repo.query('SELECT * FROM orders WHERE id = $1', [id]);
        return rows[0] || null;
    }
    async getHistoryForUser(userId) {
        const orders = await this.repo.query('SELECT id, user_id, total_price, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC, id DESC', [userId]);
        if (orders.length === 0) {
            return [];
        }
        const orderIds = orders.map((order) => order.id);
        const items = await this.repo.query(`SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.quantity,
        p.price,
        p.name AS product_name,
        p.description AS product_description,
        p.color AS product_color,
        p.size AS product_size,
        c.name AS product_category_name
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE oi.order_id = ANY($1::int[])
      ORDER BY oi.id ASC`, [orderIds]);
        return orders.map((order) => ({
            ...order,
            items: items.filter((item) => item.order_id === order.id),
        }));
    }
    async create(payload) {
        const totalPrice = payload.total_price ?? payload.total ?? 0;
        const result = await this.repo.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *', [payload.user_id, totalPrice]);
        return result[0];
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository])
], OrderService);
//# sourceMappingURL=order.service.js.map