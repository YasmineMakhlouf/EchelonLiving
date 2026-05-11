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
exports.ProductResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_types_1 = require("../common/graphql.types");
const database_provider_1 = require("../config/database.provider");
let ProductResolver = class ProductResolver {
    async products() {
        try {
            const result = await database_provider_1.pool.query('SELECT id, name, price, description FROM products ORDER BY id DESC LIMIT 100');
            return result.rows;
        }
        catch (error) {
            console.error('Products query error:', error);
            return [];
        }
    }
    async product(id) {
        try {
            const result = await database_provider_1.pool.query('SELECT id, name, price, description FROM products WHERE id = $1', [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error('Product query error:', error);
            return null;
        }
    }
    async categories() {
        try {
            const result = await database_provider_1.pool.query('SELECT id, name FROM categories ORDER BY id');
            return result.rows;
        }
        catch (error) {
            console.error('Categories query error:', error);
            return [];
        }
    }
    async productsByCategory(categoryId) {
        try {
            const result = await database_provider_1.pool.query('SELECT p.id, p.name, p.price, p.description FROM products p WHERE p.category_id = $1 ORDER BY p.id DESC LIMIT 50', [categoryId]);
            return result.rows;
        }
        catch (error) {
            console.error('Products by category query error:', error);
            return [];
        }
    }
};
exports.ProductResolver = ProductResolver;
__decorate([
    (0, graphql_1.Query)(() => [graphql_types_1.Product]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "products", null);
__decorate([
    (0, graphql_1.Query)(() => graphql_types_1.Product, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "product", null);
__decorate([
    (0, graphql_1.Query)(() => [graphql_types_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "categories", null);
__decorate([
    (0, graphql_1.Query)(() => [graphql_types_1.Product]),
    __param(0, (0, graphql_1.Args)('categoryId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "productsByCategory", null);
exports.ProductResolver = ProductResolver = __decorate([
    (0, graphql_1.Resolver)(() => graphql_types_1.Product)
], ProductResolver);
//# sourceMappingURL=product.resolver.js.map