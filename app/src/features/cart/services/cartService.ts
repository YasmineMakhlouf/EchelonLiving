/**
 * cartService
 * Cart feature service: handles cart operations (fetch, update, remove, checkout).
 */
import { graphqlRequest } from "../../../api/graphql";
import { isTokenExpired } from "../../../utils/authToken";

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

interface CreateOrderMutationData {
  createOrder: {
    id: number;
  };
}

interface AddCartItemMutationData {
  addCartItem: {
    id: number;
  };
}

interface StoredAuthUser {
  id?: number;
}

const AUTH_LOGOUT_EVENT = "echelon-auth-logout";

const getCurrentUserId = (): number | null => {
  try {
    const authUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("token");

    // Require both a stored user and a valid token before treating user as authenticated.
    if (!authUser || !token) {
      return null;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
      return null;
    }

    const parsed = JSON.parse(authUser) as StoredAuthUser;
    return typeof parsed.id === "number" ? parsed.id : null;
  } catch {
    return null;
  }
};

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

  const message = apiError.message?.toLowerCase() ?? "";
  if (message.includes("no authorization header") || message.includes("unauthorized")) {
    return "You need to be logged in for this action.";
  }

  return (
    apiError.response?.data?.message ||
    apiError.response?.data?.error ||
    apiError.message ||
    fallbackMessage
  );
};

export const getCart = (userId: number): Promise<CartItem[]> => {
    return graphqlRequest<{ cartItems: CartItem[] }>(
    `
      query CartItems($userId: Int!) {
        cartItems(userId: $userId) {
          id
          user_id: userId
          product_id: productId
          product_name
          price
          quantity
        }
      }
    `,
    { userId },
  )
    .then((data) => data.cartItems || [])
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return [];
      }

      console.error('Failed to fetch cart:', error);
      throw new Error('Failed to load cart. Please try again later.');
    });
};

export const updateQuantity = (cartItemId: number, quantity: number): Promise<CartItem> => {
  if (quantity < 1) {
    return Promise.reject(new Error("Quantity must be at least 1"));
  }
  return graphqlRequest<{ updateCartItem: CartItem }>(
    `
      mutation UpdateCartItem($id: Int!, $quantity: Int!) {
        updateCartItem(id: $id, quantity: $quantity) {
          id
          quantity
        }
      }
    `,
    { id: cartItemId, quantity },
  )
    .then((data) => data.updateCartItem)
    .catch((error) => {
      console.error('Failed to update cart item:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to update item. Please try again.'));
    });
};

export const removeItem = (cartItemId: number): Promise<void> => {
  return graphqlRequest<{ removeCartItem: boolean }>(
    `
      mutation RemoveCartItem($id: Int!) {
        removeCartItem(id: $id)
      }
    `,
    { id: cartItemId },
  )
    .then(() => {})
    .catch((error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      console.error('Failed to remove cart item:', error);
      throw new Error(getApiErrorMessage(error, 'Failed to remove item. Please try again.'));
    });
};

export const checkout = (userId: number, total: number): Promise<{ orderId?: number }> => {
  return graphqlRequest<CreateOrderMutationData>(
    `
      mutation CreateOrder($userId: Int!, $total: String!, $status: String) {
        createOrder(userId: $userId, total: $total, status: $status) {
          id
        }
      }
    `,
    {
      userId,
      total: String(total),
      status: "pending",
    }
  )
    .then((data) => {
      return { orderId: data.createOrder?.id };
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
  const userId = getCurrentUserId();

  if (!userId) {
    return Promise.reject(new Error("Please log in to add items to cart"));
  }

  return graphqlRequest<AddCartItemMutationData>(
    `
      mutation AddCartItem($userId: Int!, $productId: Int!, $quantity: Int) {
        addCartItem(userId: $userId, productId: $productId, quantity: $quantity) {
          id
        }
      }
    `,
    {
      userId,
      productId,
      quantity,
    }
  )
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
