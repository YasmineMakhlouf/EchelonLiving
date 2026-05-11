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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResolver = exports.OrderResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_types_1 = require("../common/graphql.types");
const database_provider_1 = require("../config/database.provider");
let OrderResolver = class OrderResolver {
    async createOrder(userId, total, status = 'pending') {
        try {
            const result = await database_provider_1.pool.query('INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id, user_id as userId, total, status', [userId, total, status]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Create order mutation error:', error);
            throw new Error(`Order creation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.OrderResolver = OrderResolver;
__decorate([
    (0, graphql_1.Mutation)(() => graphql_types_1.Order),
    __param(0, (0, graphql_1.Args)('userId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('total', { type: () => String })),
    __param(2, (0, graphql_1.Args)('status', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
exports.OrderResolver = OrderResolver = __decorate([
    (0, graphql_1.Resolver)(() => graphql_types_1.Order)
], OrderResolver);
let CartResolver = class CartResolver {
    async addCartItem(userId, productId, quantity = 1) {
        try {
            const result = await database_provider_1.pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id, user_id as userId, product_id as productId, quantity', [userId, productId, quantity]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Add cart item mutation error:', error);
            throw new Error(`Cart item addition failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.CartResolver = CartResolver;
__decorate([
    (0, graphql_1.Mutation)(() => graphql_types_1.CartItem),
    __param(0, (0, graphql_1.Args)('userId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('productId', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('quantity', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "addCartItem", null);
exports.CartResolver = CartResolver = __decorate([
    (0, graphql_1.Resolver)(() => graphql_types_1.CartItem)
], CartResolver);
//# sourceMappingURL=order.resolver.js.map