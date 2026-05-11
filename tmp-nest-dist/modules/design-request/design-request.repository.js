"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignRequestRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class DesignRequestRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Design request query error:', error);
            throw new Error(`Design request query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.DesignRequestRepository = DesignRequestRepository;
//# sourceMappingURL=design-request.repository.js.map