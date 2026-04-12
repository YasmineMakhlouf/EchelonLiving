/**
 * AdminStatsController
 * Exposes admin-only dashboard summary endpoints.
 */
import { Request, Response } from "express";
import AdminStatsService from "../services/AdminStatsService";

class AdminStatsController {
  static async getSummary(_req: Request, res: Response): Promise<void> {
    // Summary aggregates multiple metrics used by the admin dashboard.
    const summary = await AdminStatsService.getSummary();
    res.json(summary);
  }
}

export default AdminStatsController;

