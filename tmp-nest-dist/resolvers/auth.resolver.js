"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_types_1 = require("../common/graphql.types");
const database_provider_1 = require("../config/database.provider");
let AuthResolver = class AuthResolver {
    async login(email, password) {
        try {
            const result = await database_provider_1.pool.query('SELECT id, email, role FROM users WHERE email = $1 LIMIT 1', [email]);
            const user = result.rows[0];
            if (!user)
                return null;
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                token: 'placeholder-jwt-token',
            };
        }
        catch (error) {
            console.error('Login mutation error:', error);
            return null;
        }
    }
    async register(email, password, role = 'customer') {
        try {
            const result = await database_provider_1.pool.query('INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role', [email, password, role]);
            const user = result.rows[0];
            return {
                id: user.id,
                email: user.email,
                role: user.role,
            };
        }
        catch (error) {
            console.error('Register mutation error:', error);
            throw new Error(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => graphql_types_1.AuthPayload, { nullable: true }),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_types_1.AuthPayload),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('password')),
    __param(2, (0, graphql_1.Args)('role', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)()
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map