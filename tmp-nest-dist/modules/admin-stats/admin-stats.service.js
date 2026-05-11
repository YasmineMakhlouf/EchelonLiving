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
exports.AdminStatsService = void 0;
const common_1 = require("@nestjs/common");
const admin_stats_repository_1 = require("./admin-stats.repository");
let AdminStatsService = class AdminStatsService {
    constructor(repo) {
        this.repo = repo;
    }
    async getSummary() {
        const totalUsers = await this.repo.query("SELECT COUNT(*)::int as total FROM users");
        const totalOrders = await this.repo.query("SELECT COUNT(*)::int as total FROM orders");
        const top = await this.repo.query("SELECT p.id as product_id, p.name as product_name, SUM(oi.quantity)::int as total_sold FROM products p JOIN order_items oi ON oi.product_id = p.id GROUP BY p.id, p.name ORDER BY total_sold DESC LIMIT 10");
        return {
            total_users: (totalUsers?.[0]?.total) || 0,
            total_orders: (totalOrders?.[0]?.total) || 0,
            top_selling_products: top || [],
        };
    }
};
exports.AdminStatsService = AdminStatsService;
exports.AdminStatsService = AdminStatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_stats_repository_1.AdminStatsRepository])
], AdminStatsService);
//# sourceMappingURL=admin-stats.service.js.map