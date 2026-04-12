/**
 * DesignRequestService
 * Validates and manages custom design-request workflows.
 */
import DesignRequestRepository from "../repositories/DesignRequestRepository";
import { DesignRequest, DesignRequestStatus } from "../types/designRequest";

class DesignRequestService {
  static async submitDesign(input: {
    userId: number;
    title: string;
    notes?: string;
    designDataUrl: string;
  }): Promise<DesignRequest> {
    // Reject empty titles early before touching persistence.
    if (!input.title.trim()) {
      throw new Error("Title is required");
    }

    // Frontend sends drawing data as a data URL payload.
    if (!input.designDataUrl.startsWith("data:image/")) {
      throw new Error("A valid drawing is required");
    }

    return DesignRequestRepository.create({
      userId: input.userId,
      title: input.title.trim(),
      notes: input.notes?.trim() || null,
      designDataUrl: input.designDataUrl,
    });
  }

  static async listDesignRequests(): Promise<DesignRequest[]> {
    return DesignRequestRepository.findAll();
  }

  static async reviewDesignRequest(input: {
    requestId: number;
    status: DesignRequestStatus;
    adminNotes?: string;
  }): Promise<DesignRequest | null> {
    return DesignRequestRepository.updateStatus({
      requestId: input.requestId,
      status: input.status,
      adminNotes: input.adminNotes?.trim() || null,
    });
  }
}

export default DesignRequestService;

