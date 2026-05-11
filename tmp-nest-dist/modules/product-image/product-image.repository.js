"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class ProductImageRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Product image query error:', error);
            throw new Error(`Product image query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.ProductImageRepository = ProductImageRepository;
//# sourceMappingURL=product-image.repository.js.map