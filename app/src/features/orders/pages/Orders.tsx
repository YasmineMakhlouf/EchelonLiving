/**
 * Orders
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getOrderHistory } from "../services/ordersService";
import type { OrderWithItems } from "../services/ordersService";
import "../../../styles/Orders.css";

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!token) {
        setLoading(false);
        setOrders([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const history = await getOrderHistory();
        setOrders(history);
      } catch (requestError) {
        const message = requestError instanceof Error
          ? requestError.message
          : "Failed to load order history.";
        setError(message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [token]);

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
                  <p>Placed on {new Date(order.created_at).toLocaleString()}</p>
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
