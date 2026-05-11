/**
 * Orders
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../services/ordersService";
import type { RootState } from "../../../store";
import {
  setOrders,
  setLoading,
  setError,
  clearError,
} from "../../../store/slices/ordersDataSlice";
import "../../../styles/Orders.css";

export default function Orders() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const orders = useSelector((state: RootState) => state.ordersData.orders);
  const loading = useSelector((state: RootState) => state.ordersData.loading);
  const error = useSelector((state: RootState) => state.ordersData.error);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!token || !user) {
        dispatch(setLoading(false));
        dispatch(setOrders([]));
        return;
      }

      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const history = await getOrderHistory(user.id);
        dispatch(setOrders(history));
      } catch (requestError) {
        const message = requestError instanceof Error
          ? requestError.message
          : "Failed to load order history.";
        dispatch(setError(message));
        dispatch(setOrders([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchOrderHistory();
  }, [token, user, dispatch]);

  const grandTotal = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  }, [orders]);

  if (!token) {
    return (
      <main className="orders-page">
        <h1>My Orders</h1>
        <p className="orders-note">Please log in to view your orders.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="orders-page">
        <h1>My Orders</h1>
        <p className="orders-note">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <h1>My Orders</h1>
        <p className="orders-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="orders-summary">
          <span>{orders.length} order(s)</span>
          <strong>Total spent: ${grandTotal.toFixed(2)}</strong>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="orders-note">You have no past orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <section key={order.id} className="order-card">
              <header className="order-card-header">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p>
                    {order.created_at
                      ? `Placed on ${new Date(order.created_at).toLocaleString()}`
                      : order.status
                        ? `Status: ${order.status}`
                        : "Order details unavailable"}
                  </p>
                </div>
                <div className="order-total">${Number(order.total_price).toFixed(2)}</div>
              </header>

              <div className="order-items">
                {order.items.map((item) => (
                  <article key={item.id} className="order-item">
                    <div className="order-item-main">
                      <h3>{item.product_name || `Product #${item.product_id}`}</h3>
                      <p>
                        {item.product_category_name ? `${item.product_category_name} • ` : ""}
                        {item.product_color ? `Color: ${item.product_color} • ` : ""}
                        {item.product_size ? `Size: ${item.product_size}` : ""}
                      </p>
                      {item.product_description ? <small>{item.product_description}</small> : null}
                    </div>
                    <div className="order-item-meta">
                      <span>Qty: {item.quantity}</span>
                      <span>Unit: ${Number(item.price).toFixed(2)}</span>
                      <strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
