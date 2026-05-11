/**
 * ordersService
 * Orders feature service: handles order history retrieval.
 */
import { graphqlRequest } from "../../../api/graphql";

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
  status?: string;
  created_at?: string;
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

export const getOrderHistory = (userId: number): Promise<OrderWithItems[]> => {
  return graphqlRequest<any>(
    `
      query OrderHistory($userId: Int!) {
        orderHistory(userId: $userId) {
          id
          userId
          total
          status
        }
      }
    `,
    { userId },
  )
    .then((res) => {
      const raw = res.orderHistory || [];
      // Normalize server response to the client shape and keep items empty unless the API exposes them.
      return raw.map((o: any) => ({
        id: o.id,
        user_id: o.userId ?? o.user_id,
        total_price: o.total ?? o.total_price,
        status: o.status,
        items: [],
      }));
    })
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return [];
      }

      throw new Error(getApiErrorMessage(error, "Failed to load order history."));
    });
};
