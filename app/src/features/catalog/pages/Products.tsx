/**
 * Products
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/ui/ProductCard";
import { useAuth } from "../../../context/AuthContext";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { Product } from "../services/catalogService";
import { getProducts } from "../services/catalogService";
import { addToCart } from "../../cart/services/cartService";
import "../../../styles/Products.css";

const SKELETON_CARD_COUNT = 8;

export default function Products() {
  const { token } = useAuth();
  const catalogRevision = useCatalogRefresh();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [cartMessages, setCartMessages] = useState<Record<number, string>>({});

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("minPrice") ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("maxPrice") ?? "");
  const [colorInput, setColorInput] = useState(searchParams.get("color") ?? "");

  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const color = searchParams.get("color");

  const colorOptions = ["", "black", "white", "red", "blue", "brown", "gray", "green", "yellow"];
  const hasActiveFilters = Boolean(categoryId || search || minPrice || maxPrice || color);

  useEffect(() => {
    setSearchInput(search ?? "");
    setMinPriceInput(minPrice ?? "");
    setMaxPriceInput(maxPrice ?? "");
    setColorInput(color ?? "");
  }, [search, minPrice, maxPrice, color]);

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        nextParams.set(key, value.trim());
      } else {
        nextParams.delete(key);
      }
    });

    setSearchParams(nextParams, { replace: true });
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQueryParams({
      search: searchInput,
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
      color: colorInput,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setColorInput("");

    updateQueryParams({
      search: null,
      minPrice: null,
      maxPrice: null,
      color: null,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await getProducts({
          categoryId: categoryId ?? undefined,
          search: search ?? undefined,
          minPrice: minPrice ?? undefined,
          maxPrice: maxPrice ?? undefined,
          color: color ?? undefined,
        });

        setProducts(productData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, search, minPrice, maxPrice, color, hasActiveFilters, catalogRevision]);

  const handleAddToCart = async (product: Product) => {
    if (!token) {
      setCartMessages((prev) => ({
        ...prev,
        [product.id]: "Please log in to add items to cart",
      }));
      return;
    }

    try {
      setAddingToCart(product.id);
      setCartMessages((prev) => ({
        ...prev,
        [product.id]: "",
      }));

      await addToCart(product.id, 1);

      setCartMessages((prev) => ({
        ...prev,
        [product.id]: "Added to cart!",
      }));

      setTimeout(() => {
        setCartMessages((prev) => ({
          ...prev,
          [product.id]: "",
        }));
      }, 3000);
    } catch (addError) {
      console.error("Failed to add to cart:", addError);
      const message = addError instanceof Error ? addError.message : "Failed to add item. Please try again.";
      setCartMessages((prev) => ({
        ...prev,
        [product.id]: message,
      }));
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="products-container page-fade-in">
      <header className="products-header">
        <div>
          <p className="products-eyebrow">Catalog</p>
          <h1>{hasActiveFilters ? "Filtered Products" : "Trending Products"}</h1>
          <p className="products-subtitle">
            Browse products with filters for search, color, and price range.
          </p>
        </div>
      </header>

      <div className="products-layout">
        <aside className="products-sidebar" aria-label="Filters">
          <form className="products-search-form" onSubmit={handleFilterSubmit}>
            <div>
              <h3>Search</h3>
              <div className="filter-group">
                <label htmlFor="product-search">Product name</label>
                <input
                  id="product-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Find products..."
                />
              </div>
            </div>

            <div>
              <h3>Color</h3>
              <div className="filter-group">
                <label htmlFor="product-color">Select color</label>
                <select
                  id="product-color"
                  value={colorInput}
                  onChange={(event) => setColorInput(event.target.value)}
                >
                  {colorOptions.map((option) => (
                    <option key={option || "all"} value={option}>
                      {option ? option.charAt(0).toUpperCase() + option.slice(1) : "All colors"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h3>Price</h3>
              <div className="filter-group">
                <label htmlFor="product-min-price">Min price</label>
                <input
                  id="product-min-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minPriceInput}
                  onChange={(event) => setMinPriceInput(event.target.value)}
                  placeholder="$0.00"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="product-max-price">Max price</label>
                <input
                  id="product-max-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPriceInput}
                  onChange={(event) => setMaxPriceInput(event.target.value)}
                  placeholder="$1000.00"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button type="submit" className="add-to-cart-btn">
                Apply Filters
              </button>
              <button type="button" className="filter-clear-btn" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          </form>
        </aside>

        <section className="products-main" aria-live="polite">
          {error ? <p className="error">{error}</p> : null}

          {!error && loading ? (
            <div className="products-grid products-grid-skeleton" aria-hidden="true">
              {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
                <div key={index} className="product-skeleton-card">
                  <div className="product-skeleton-image" />
                  <div className="product-skeleton-body">
                    <span className="product-skeleton-line product-skeleton-line-title" />
                    <span className="product-skeleton-line" />
                    <span className="product-skeleton-line product-skeleton-line-short" />
                    <span className="product-skeleton-button" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!error && !loading && products.length === 0 ? (
            <div className="products-empty-state" role="status">
              <h2>No products found</h2>
              <p>
                Try adjusting your search, selected color, or price range to discover more products.
              </p>
              {hasActiveFilters ? (
                <button type="button" className="empty-state-action" onClick={handleClearFilters}>
                  Reset Filters
                </button>
              ) : null}
            </div>
          ) : null}

          {!error && !loading && products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  color={product.color}
                  image_url={product.image_url}
                  category_name={product.category_name}
                  description={product.description}
                  stock_quantity={product.stock_quantity}
                  onAddToCart={() => handleAddToCart(product)}
                  isLoading={addingToCart === product.id}
                  message={cartMessages[product.id]}
                  messageType={
                    cartMessages[product.id]?.includes("Failed") ||
                    cartMessages[product.id]?.includes("log in")
                      ? "error"
                      : "success"
                  }
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
