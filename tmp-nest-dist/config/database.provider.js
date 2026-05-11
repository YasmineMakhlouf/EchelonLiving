"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PG_POOL = exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'echelon_living',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});
exports.PG_POOL = 'PG_POOL';
//# sourceMappingURL=database.provider.js.map