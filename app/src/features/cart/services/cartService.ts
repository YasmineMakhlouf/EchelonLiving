/**
 * cartService
 * Cart feature service: handles cart operations (fetch, update, remove, checkout).
 */
import api from "../../../api/axios";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_name?: string;
  price?: number;
  quantity: number;
  created_at?: string;
}

export interface CheckoutResponse {
  id?: number;
  data?: {
    id?: number;
  };
}

export interface ApiErrorResponse {
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

  if (status === 401 || status === 403) {
    return "You need to be logged in for this action.";
  }

  return (
    apiError.response?.data?.message ||
    apiError.response?.data?.error ||
    apiError.message ||
    fallbackMessage
  );
};

export const getCart = (): Promise<CartItem[]> => {
  return api.get<CartItem[]>("/cart-items")
    .then((res) => res.data)
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return [];
      }

      console.error("Failed to fetch cart:", error);
      throw new Error("Failed to load cart. Please try again later.");
    });
};

export const updateQuantity = (cartItemId: number, quantity: number): Promise<CartItem> => {
  if (quantity < 1) {
    return Promise.reject(new Error("Quantity must be at least 1"));
  }

  return api.put<CartItem>(`/cart-items/${cartItemId}`, { quantity })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to update cart item:", error);
      throw new Error(getApiErrorMessage(error, "Failed to update item. Please try again."));
    });
};

export const removeItem = (cartItemId: number): Promise<void> => {
  return api.delete(`/cart-items/${cartItemId}`)
    .then(() => {})
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      console.error("Failed to remove cart item:", error);
      throw new Error(getApiErrorMessage(error, "Failed to remove item. Please try again."));
    });
};

export const checkout = (): Promise<{ orderId?: number }> => {
  return api.post<CheckoutResponse>("/orders", {})
    .then((response) => {
      const createdOrder = response.data?.data ?? response.data;
      const orderId = createdOrder?.id;
      return { orderId };
    })
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        throw new Error("You need to be logged in to checkout.");
      }

      console.error("Failed to checkout:", error);
      throw new Error(getApiErrorMessage(error, "Failed to place order. Please try again."));
    });
};

export const addToCart = (productId: number, quantity: number = 1): Promise<void> => {
  return api.post("/cart-items", {
    product_id: productId,
    quantity,
  })
    .then(() => {})
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        throw new Error("Please log in to add items to cart");
      }

      console.error("Failed to add to cart:", error);
      throw new Error(getApiErrorMessage(error, "Failed to add item. Please try again."));
    });
};
