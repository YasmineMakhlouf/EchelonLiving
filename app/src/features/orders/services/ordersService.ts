/**
 * ordersService
 * Orders feature service: handles order history retrieval.
 */
import api from "../../../api/axios";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
  product_description?: string;
  product_color?: string;
  product_size?: string;
  product_category_name?: string;
}

export interface OrderWithItems {
  id: number;
  user_id: number;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const apiError = error as {
    response?: {
      data?: ApiErrorResponse;
    };
    message?: string;
  };

  return apiError.response?.data?.message || apiError.response?.data?.error || apiError.message || fallbackMessage;
};

export const getOrderHistory = (): Promise<OrderWithItems[]> => {
  return api.get<OrderWithItems[]>("/orders/history")
    .then((response) => response.data)
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return [];
      }

      throw new Error(getApiErrorMessage(error, "Failed to load order history."));
    });
};
