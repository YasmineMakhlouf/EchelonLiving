/**
 * ProductDetails
 * Frontend pages module for Echelon Living app.
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { Product } from "../services/catalogService";
import { getProductById } from "../services/catalogService";
import { addToCart } from "../../cart/services/cartService";
import { toAbsoluteImageUrl } from "../../../api/image";
import "../../../styles/ProductDetails.css";

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductWithReviews extends Product {
  reviews?: Review[];
}

export default function ProductDetails() {
  const catalogRevision = useCatalogRefresh();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(Number(id));
        setProduct(data as ProductWithReviews);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product. Please try again later.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, catalogRevision]);

  const handleAddToCart = async () => {
    if (!token) {
      setCartMessage("Please log in to add items to cart");
      return;
    }

    if (!product) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      await addToCart(product.id, quantity);

      setCartMessage(`Added ${quantity} item(s) to cart!`);
      setQuantity(1);

      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add item to cart. Please try again.";
      setCartMessage(message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="product-details-container"><p className="loading">Loading product...</p></div>;
  }

  if (error) {
    return <div className="product-details-container"><p className="error">{error}</p></div>;
  }

  if (!product) {
    return <div className="product-details-container"><p className="error">Product not found</p></div>;
  }

  const productImageUrl = toAbsoluteImageUrl(product.image_url);

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="product-details-container">
      <div className="product-details-section">
        <div className="product-details-image">
          {productImageUrl && (
            <img src={productImageUrl} alt={product.name} />
          )}
        </div>

        <div className="product-details-info">
          <h1 className="product-details-name">{product.name}</h1>

          {product.category_name && (
            <p className="product-details-category">{product.category_name}</p>
          )}

          <p className="product-details-price">${Number(product.price).toFixed(2)}</p>

          {product.description && (
            <p className="product-details-description">{product.description}</p>
          )}

          <div className="product-stock">
            <span
              className={`stock-status ${
                (product.stock_quantity ?? 0) > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {(product.stock_quantity ?? 0) > 0
                ? `${product.stock_quantity} in stock`
                : "Out of stock"}
            </span>
          </div>

          {(product.stock_quantity ?? 0) > 0 && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock_quantity ?? 1))
                  }
                />
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              {cartMessage && (
                <p
                  className={`cart-message ${
                    cartMessage.includes("Failed") ? "error" : "success"
                  }`}
                >
                  {cartMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>

        {!product.reviews || product.reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          <>
            <div className="reviews-summary">
              <div className="average-rating">
                <span className="rating-value">{averageRating}</span>
                <span className="rating-count">
                  ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            <div className="reviews-list">
              {product.reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">
                      {review.user_name || "Anonymous"}
                    </span>
                    <span className="review-rating">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
