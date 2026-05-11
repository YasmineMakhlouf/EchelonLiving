"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class CartItemRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Cart item query error:', error);
            throw new Error(`Cart item query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.CartItemRepository = CartItemRepository;
//# sourceMappingURL=cart-item.repository.js.map