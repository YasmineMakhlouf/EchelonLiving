"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class ProductRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Product query error:', error);
            throw new Error(`Product query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=product.repository.js.map