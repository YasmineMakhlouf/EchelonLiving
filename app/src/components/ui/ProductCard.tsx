/**
 * ProductCard
 * Frontend UI components module for Echelon Living app.
 */
import Button from "./Button";
import { toAbsoluteImageUrl } from "../../api/image";
import "../../styles/components/products/ProductCard.css";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  color?: string;
  image_url?: string;
  category_name?: string;
  description?: string;
  stock_quantity?: number;
  onAddToCart?: (productId: number) => void;
  onViewDetails?: (productId: number) => void;
  isLoading?: boolean;
  message?: string;
  messageType?: "success" | "error";
}

function ProductCard({
  id,
  name,
  price,
  color,
  image_url,
  category_name,
  description,
  stock_quantity,
  onAddToCart,
  onViewDetails,
  isLoading = false,
  message,
  messageType = "success",
}: ProductCardProps) {
  const inStock = (stock_quantity ?? 0) > 0;
  const productImageUrl = toAbsoluteImageUrl(image_url);

  return (
    <article className="product-card-v2">
      <div className="product-card-v2-image-wrapper">
        {productImageUrl ? (
          <img src={productImageUrl} alt={name} className="product-card-v2-image" loading="lazy" />
        ) : (
          <div className="product-card-v2-fallback" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        {!inStock ? <span className="product-card-v2-badge">Out of stock</span> : null}
      </div>

      <div className="product-card-v2-content">
        {category_name ? <p className="product-card-v2-category">{category_name}</p> : null}
        <h3 className="product-card-v2-name">{name}</h3>
        <p className="product-card-v2-price">${Number(price).toFixed(2)}</p>

        {color ? (
          <p className="product-card-v2-color">
            Color: <span>{color}</span>
          </p>
        ) : null}

        {description ? <p className="product-card-v2-description">{description}</p> : null}

        <div className="product-card-v2-actions">
          {onViewDetails ? (
            <Button variant="secondary" size="small" onClick={() => onViewDetails(id)} fullWidth>
              View Details
            </Button>
          ) : null}

          {onAddToCart ? (
            <Button
              variant="primary"
              size="small"
              onClick={() => onAddToCart(id)}
              disabled={isLoading || !inStock}
              fullWidth
            >
              {isLoading ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          ) : null}
        </div>

        {message ? (
          <p className={`product-card-v2-message product-card-v2-message-${messageType}`}>{message}</p>
        ) : null}
      </div>
    </article>
  );
}

export default ProductCard;
