"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStatsRepository = void 0;
const common_1 = require("@nestjs/common");
const database_provider_1 = require("../../config/database.provider");
let AdminStatsRepository = class AdminStatsRepository {
    async query(text, params) {
        try {
            const result = await database_provider_1.pool.query(text, params);
            return result.rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.AdminStatsRepository = AdminStatsRepository;
exports.AdminStatsRepository = AdminStatsRepository = __decorate([
    (0, common_1.Injectable)()
], AdminStatsRepository);
//# sourceMappingURL=admin-stats.repository.js.map