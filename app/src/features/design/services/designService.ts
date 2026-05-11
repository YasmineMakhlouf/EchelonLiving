/**
 * designService
 * Design feature service: handles design request submission.
 */
import api from "../../../api/axios";
import { graphqlRequest } from "../../../api/graphql";

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

export const submitDesignRequest = (data: { title: string; notes?: string; designDataUrl: string; userId: number }): Promise<{ id: number }> => {
  return graphqlRequest<{ createDesignRequest: { id: number } }>(
    `
      mutation CreateDesignRequest($userId: Int!, $title: String!, $designDataUrl: String!, $notes: String) {
        createDesignRequest(userId: $userId, title: $title, designDataUrl: $designDataUrl, notes: $notes) {
          id
        }
      }
    `,
    {
      userId: data.userId,
      title: data.title,
      designDataUrl: data.designDataUrl,
      notes: data.notes,
    },
  )
    .then((res) => res.createDesignRequest)
    .catch((error) => {
      console.error('Failed to submit design request:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to submit design request. Please try again.'));
    });
};