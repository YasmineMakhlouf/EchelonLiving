"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogEventsRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class CatalogEventsRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Catalog events query error:', error);
            throw new Error(`Catalog events query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.CatalogEventsRepository = CatalogEventsRepository;
//# sourceMappingURL=catalog-events.repository.js.map