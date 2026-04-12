/**
 * designService
 * Design feature service: handles design request submission.
 */
import api from "../../../api/axios";

export interface DesignRequestPayload {
  title: string;
  notes?: string;
  designDataUrl: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as {
    response?: {
      status?: number;
      data?: ApiErrorResponse;
    };
    message?: string;
  };

  const status = apiError.response?.status;
  if (status === 401) {
    return "Please log in to submit a design request.";
  }

  return apiError.response?.data?.message || apiError.response?.data?.error || apiError.message || fallbackMessage;
};

export const submitDesignRequest = (payload: DesignRequestPayload): Promise<void> => {
  return api.post("/design-requests", {
    title: payload.title.trim(),
    notes: payload.notes?.trim() ?? "",
    designDataUrl: payload.designDataUrl,
  })
    .then(() => {})
    .catch((error) => {
      throw new Error(getApiErrorMessage(error, "Failed to submit your design request."));
    });
};