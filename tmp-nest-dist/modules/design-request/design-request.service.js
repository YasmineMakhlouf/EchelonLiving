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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignRequestService = void 0;
const common_1 = require("@nestjs/common");
const design_request_repository_1 = require("./design-request.repository");
let DesignRequestService = class DesignRequestService {
    constructor(repo) {
        this.repo = repo;
    }
    async list() {
        return this.repo.query(`
      SELECT
        dr.id,
        dr.user_id,
        u.name AS user_name,
        u.email AS user_email,
        dr.title,
        dr.notes,
        dr.design_data_url,
        dr.status,
        dr.admin_notes,
        dr.created_at,
        dr.reviewed_at
      FROM design_requests dr
      INNER JOIN users u ON u.id = dr.user_id
      ORDER BY dr.created_at DESC
    `);
    }
    async create(payload) {
        const userId = Number(payload.user_id ?? payload.userId);
        const title = String(payload.title ?? '').trim();
        const notes = String(payload.notes ?? '').trim() || null;
        const designDataUrl = String(payload.designDataUrl ?? payload.design_data_url ?? '').trim();
        const result = await this.repo.query(`INSERT INTO design_requests
        (user_id, title, notes, design_data_url, status, created_at)
       VALUES
        ($1, $2, $3, $4, 'pending', NOW())
       RETURNING
        id, user_id, title, notes, design_data_url, status, admin_notes, created_at, reviewed_at`, [userId, title, notes, designDataUrl]);
        return result[0];
    }
    async updateStatus(id, payload) {
        const status = String(payload.status ?? 'pending');
        const adminNotes = String(payload.adminNotes ?? payload.admin_notes ?? '').trim() || null;
        const result = await this.repo.query(`UPDATE design_requests
       SET status = $2,
           admin_notes = $3,
           reviewed_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, title, notes, design_data_url, status, admin_notes, created_at, reviewed_at`, [id, status, adminNotes]);
        return result[0] || null;
    }
};
exports.DesignRequestService = DesignRequestService;
exports.DesignRequestService = DesignRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [design_request_repository_1.DesignRequestRepository])
], DesignRequestService);
//# sourceMappingURL=design-request.service.js.map