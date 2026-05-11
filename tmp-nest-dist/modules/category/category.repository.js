"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class CategoryRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Category query error:', error);
            throw new Error(`Category query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=category.repository.js.map