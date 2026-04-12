/**
 * DesignRequestController
 * Handles customer design-request submissions and admin review actions.
 */
import { Request, Response } from "express";
import type { RequestWithUser } from "../middlewares/authMiddleware";
import DesignRequestService from "../services/DesignRequestService";

class DesignRequestController {
  static async create(req: Request, res: Response): Promise<void> {
    // The authenticated user id is attached by auth middleware.
    const userId = Number((req as RequestWithUser).user?.id);
    const { title, notes, designDataUrl } = req.body as {
      title?: string;
      notes?: string;
      designDataUrl?: string;
    };

    const designRequest = await DesignRequestService.submitDesign({
      userId,
      title: title ?? "",
      notes,
      designDataUrl: designDataUrl ?? "",
    });

    res.status(201).json(designRequest);
  }

  static async index(_req: Request, res: Response): Promise<void> {
    const designRequests = await DesignRequestService.listDesignRequests();
    res.json(designRequests);
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    // Admin chooses the review status and optional internal notes.
    const requestId = Number(req.params.id);
    const { status, adminNotes } = req.body as {
      status?: "pending" | "approved" | "rejected";
      adminNotes?: string;
    };

    const updated = await DesignRequestService.reviewDesignRequest({
      requestId,
      status: status ?? "pending",
      adminNotes,
    });

    if (!updated) {
      res.status(404).json({ message: "Design request not found" });
      return;
    }

    res.json(updated);
  }
}

export default DesignRequestController;

