"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const database_provider_1 = require("../../config/database.provider");
class AuthRepository {
    createToken(payload) {
        const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        const body = Buffer.from(JSON.stringify({ ...payload, exp: expiresAt })).toString('base64url');
        return `${header}.${body}.`;
    }
    async login(email, password) {
        try {
            const result = await database_provider_1.pool.query('SELECT id, name, email, role FROM users WHERE email = $1 LIMIT 1', [email]);
            const user = result.rows[0];
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: this.createToken(user),
            };
        }
        catch (error) {
            console.error('Login query error:', error);
            throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async register(payload) {
        try {
            const result = await database_provider_1.pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role', [payload.name, payload.email, payload.password, payload.role || 'customer']);
            const user = result.rows[0];
            return {
                ...user,
                token: this.createToken(user),
            };
        }
        catch (error) {
            console.error('Register query error:', error);
            throw new Error(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map