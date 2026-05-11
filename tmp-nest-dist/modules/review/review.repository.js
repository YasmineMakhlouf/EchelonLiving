"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class ReviewRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Review query error:', error);
            throw new Error(`Review query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=review.repository.js.map