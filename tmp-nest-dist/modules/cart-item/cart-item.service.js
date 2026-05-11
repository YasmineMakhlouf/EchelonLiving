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
exports.CartItemService = void 0;
const common_1 = require("@nestjs/common");
const cart_item_repository_1 = require("./cart-item.repository");
let CartItemService = class CartItemService {
    constructor(repo) {
        this.repo = repo;
    }
    async listForUser(userId) {
        return this.repo.query('SELECT * FROM cart_items WHERE user_id = $1 ORDER BY id DESC', [userId]);
    }
    async add(payload) {
        const result = await this.repo.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [payload.user_id, payload.product_id, payload.quantity || 1]);
        return result[0];
    }
    async update(id, quantity) {
        const result = await this.repo.query('UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *', [quantity, id]);
        return result[0] || null;
    }
    async remove(id) {
        const result = await this.repo.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [id]);
        return result[0] || null;
    }
};
exports.CartItemService = CartItemService;
exports.CartItemService = CartItemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_item_repository_1.CartItemRepository])
], CartItemService);
//# sourceMappingURL=cart-item.service.js.map