/**
 * Cart
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCart,
  updateQuantity,
  removeItem,
  checkout,
} from "../services/cartService";
import { getProductImagesMap } from "../../catalog/services/catalogService";
import type { RootState } from "../../../store";
import {
  setItems,
  setProductImages,
  setLoading,
  setError,
  clearError,
  setCheckoutLoading,
  setCheckoutMessage,
} from "../../../store/slices/cartDataSlice";
import "../../../styles/Cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cartData.items);
  const productImages = useSelector((state: RootState) => state.cartData.productImages);
  const loading = useSelector((state: RootState) => state.cartData.loading);
  const error = useSelector((state: RootState) => state.cartData.error);
  const checkoutLoading = useSelector((state: RootState) => state.cartData.checkoutLoading);
  const checkoutMessage = useSelector((state: RootState) => state.cartData.checkoutMessage);
  const [updating, setUpdating] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      dispatch(setLoading(false));
      dispatch(clearError());
      return;
    }

    const fetchCart = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        if (!user) {
          dispatch(setItems([]));
          return;
        }

        const items = await getCart(user.id);
        dispatch(setItems(items));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        const message = err instanceof Error ? err.message : "Failed to load cart. Please try again later.";
        dispatch(setError(message));
        dispatch(setItems([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCart();
  }, [token, user, dispatch]);

  useEffect(() => {
    if (!token || cartItems.length === 0) {
      return;
    }

    const productIdsWithoutImage = [...new Set(cartItems.map((item) => item.product_id))].filter(
      (productId) => !productImages[productId]
    );

    if (productIdsWithoutImage.length === 0) {
      return;
    }

    const fetchProductImages = async () => {
      try {
        const nextImages = await getProductImagesMap(productIdsWithoutImage);
        if (Object.keys(nextImages).length > 0) {
          dispatch(setProductImages(nextImages));
        }
      } catch {
        // Error handled silently
      }
    };

    fetchProductImages();
  }, [cartItems, productImages, token, dispatch]);

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdating(cartItemId);
      dispatch(clearError());

      const updatedItem = await updateQuantity(cartItemId, newQuantity);
      dispatch(setItems(
        cartItems.map((item) => (item.id === cartItemId ? updatedItem : item))
      ));
    } catch (err) {
      console.error("Failed to update cart item:", err);
      const message = err instanceof Error ? err.message : "Failed to update item. Please try again.";
      dispatch(setError(message));
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setRemoving(cartItemId);
      dispatch(clearError());

      await removeItem(cartItemId);
      dispatch(setItems(cartItems.filter((item) => item.id !== cartItemId)));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      const message = err instanceof Error ? err.message : "Failed to remove item. Please try again.";
      dispatch(setError(message));
    } finally {
      setRemoving(null);
    }
  };

  const handleCheckout = async () => {
    try {
      dispatch(setCheckoutLoading(true));
      dispatch(setCheckoutMessage(null));

      if (!user) {
        dispatch(setCheckoutMessage("You need to be logged in to checkout."));
        return;
      }

      const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
      const { orderId } = await checkout(user.id, totalPrice);

      const successMessage = orderId ? `Order placed successfully! Order ID: ${orderId}` : "Order placed successfully!";
      dispatch(setCheckoutMessage(successMessage));
      dispatch(setItems([]));

      setTimeout(() => {
        dispatch(setCheckoutMessage(null));
      }, 5000);
    } catch (err) {
      console.error("Failed to checkout:", err);
      const message = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      dispatch(setCheckoutMessage(message));
    } finally {
      dispatch(setCheckoutLoading(false));
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!token) {
    return (
      <div className="cart-container page-fade-in">
        <p className="not-authenticated">Please log in to view your cart.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-container page-fade-in">
        <p className="loading">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container page-fade-in">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container page-fade-in">
        <div className="cart-empty-state">
          <h1>Your cart is empty</h1>
          <p>Add items from the catalog and come back to checkout.</p>
          <Link to="/products" className="cart-empty-cta">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container page-fade-in">
      <header className="cart-header">
        <p className="cart-eyebrow">Shopping Cart</p>
        <h1>Review your items</h1>
        <p className="cart-subtitle">{itemCount} item(s) ready for checkout</p>
      </header>

      <div className="cart-layout">
        <section className="cart-items-list" aria-label="Cart items">
          {cartItems.map((item) => {
            const unitPrice = Number(item.price || 0);
            const subtotal = unitPrice * item.quantity;
            const imageUrl = productImages[item.product_id];

            return (
              <article key={item.id} className="cart-item-card">
                <div className="cart-item-image-wrap">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product_name || `Product #${item.product_id}`}
                      className="cart-item-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="cart-item-image-fallback" aria-hidden="true">
                      {(item.product_name || "P").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="cart-item-main">
                  <h2 className="cart-item-name">{item.product_name || `Product #${item.product_id}`}</h2>
                  <p className="cart-item-unit-price">Unit price: ${unitPrice.toFixed(2)}</p>

                  <div className="cart-item-controls">
                    <div className="quantity-controls" aria-label="Quantity controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        aria-label={`Decrease quantity for ${item.product_name || `Product #${item.product_id}`}`}
                      >
                        -
                      </button>

                      <span className="quantity-value" aria-live="polite">
                        {item.quantity}
                      </span>

                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        aria-label={`Increase quantity for ${item.product_name || `Product #${item.product_id}`}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removing === item.id}
                    >
                      {removing === item.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="cart-summary-panel" aria-label="Order summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>

          <button className="checkout-btn" onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
          </button>

          {checkoutMessage ? (
            <p className={`checkout-message ${checkoutMessage.includes("successfully") ? "success" : "error"}`}>
              {checkoutMessage}
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
