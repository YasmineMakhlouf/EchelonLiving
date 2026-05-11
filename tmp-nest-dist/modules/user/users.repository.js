"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class UsersRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Users query error:', error);
            throw new Error(`Users query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map