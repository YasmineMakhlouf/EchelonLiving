import { Injectable } from '@nestjs/common';
import { DesignRequestRepository } from './design-request.repository';

@Injectable()
export class DesignRequestService {
  constructor(private readonly repo: DesignRequestRepository) {}

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

  async create(payload: any) {
    const userId = Number(payload.user_id ?? payload.userId);
    const title = String(payload.title ?? '').trim();
    const notes = String(payload.notes ?? '').trim() || null;
    const designDataUrl = String(payload.designDataUrl ?? payload.design_data_url ?? '').trim();

    const result = await this.repo.query(
      `INSERT INTO design_requests
        (user_id, title, notes, design_data_url, status, created_at)
       VALUES
        ($1, $2, $3, $4, 'pending', NOW())
       RETURNING
        id, user_id, title, notes, design_data_url, status, admin_notes, created_at, reviewed_at`,
      [userId, title, notes, designDataUrl],
    );
    return result[0];
  }

  async updateStatus(id: number, payload: any) {
    const status = String(payload.status ?? 'pending');
    const adminNotes = String(payload.adminNotes ?? payload.admin_notes ?? '').trim() || null;

    const result = await this.repo.query(
      `UPDATE design_requests
       SET status = $2,
           admin_notes = $3,
           reviewed_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, title, notes, design_data_url, status, admin_notes, created_at, reviewed_at`,
      [id, status, adminNotes],
    );

    return result[0] || null;
  }
}
