/**
 * DesignRequestRepository
 * Persists design requests and admin review decisions.
 */
import pool from "../config/db";
import { DesignRequest, DesignRequestStatus } from "../types/designRequest";

class DesignRequestRepository {
  static async create(input: {
    userId: number;
    title: string;
    notes: string | null;
    designDataUrl: string;
  }): Promise<DesignRequest> {
    const result = await pool.query(
      `
        INSERT INTO design_requests (user_id, title, notes, design_data_url, status, created_at)
        VALUES ($1, $2, $3, $4, 'pending', NOW())
        RETURNING id, user_id, title, notes, design_data_url, status, admin_notes, created_at, reviewed_at
      `,
      [input.userId, input.title, input.notes, input.designDataUrl]
    );

    return result.rows[0] as DesignRequest;
  }

  static async findAll(): Promise<DesignRequest[]> {
    // Includes user identity fields for admin listing screens.
    const result = await pool.query(
      `
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
      `
    );

    return result.rows as DesignRequest[];
  }

  static async updateStatus(input: {
    requestId: number;
    status: DesignRequestStatus;
    adminNotes: string | null;
  }): Promise<DesignRequest | null> {
    const result = await pool.query(
      `
        UPDATE design_requests
        SET status = $2,
            admin_notes = $3,
            reviewed_at = NOW()
        WHERE id = $1
        RETURNING id, user_id, title, notes, design_data_url, status, admin_notes, created_at, reviewed_at
      `,
      [input.requestId, input.status, input.adminNotes]
    );

    return (result.rows[0] as DesignRequest | undefined) ?? null;
  }
}

export default DesignRequestRepository;

