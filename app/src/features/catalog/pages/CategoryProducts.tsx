/**
 * CategoryProducts
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { Category, Product } from "../services/catalogService";
import {
  getCategories,
  getProducts,
} from "../services/catalogService";
import { addToCart } from "../../cart/services/cartService";
import { toAbsoluteImageUrl } from "../../../api/image";
import "../../../styles/Products.css";

export default function CategoryProducts() {
  const { token } = useAuth();
  const catalogRevision = useCatalogRefresh();
  const { id } = useParams();
  const categoryId = Number(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [cartMessages, setCartMessages] = useState<{ [key: number]: string }>({});
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("minPrice") ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("maxPrice") ?? "");
  const [colorInput, setColorInput] = useState(searchParams.get("color") ?? "");

  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const color = searchParams.get("color");
  const colorOptions = ["", "black", "white", "red", "blue", "brown", "gray", "green", "yellow"];
  const activeFilters = useMemo(
    () => [
      search ? `Search: ${search}` : null,
      color ? `Color: ${color}` : null,
      minPrice ? `Min: $${minPrice}` : null,
      maxPrice ? `Max: $${maxPrice}` : null,
    ].filter((item): item is string => Boolean(item)),
    [search, color, minPrice, maxPrice]
  );

  const hasValidCategoryId = useMemo(() => !Number.isNaN(categoryId) && categoryId > 0, [categoryId]);

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

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    if (!hasValidCategoryId) {
      setError("Invalid category.");
      setLoading(false);
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const categories = await getCategories();
        const foundCategory = categories.find(c => c.id === categoryId);
        setCategory(foundCategory || null);

        const products = await getProducts({
          categoryId: String(categoryId),
          search: search ?? undefined,
          minPrice: minPrice ?? undefined,
          maxPrice: maxPrice ?? undefined,
          color: color ?? undefined,
        });

        setProducts(products);
      } catch (fetchError) {
        console.error("Failed to fetch category products:", fetchError);
        setError("Failed to load this category. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, hasValidCategoryId, search, minPrice, maxPrice, color, catalogRevision]);

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

  if (loading) {
    return (
      <main className="products-container" aria-busy="true">
        <p className="loading" role="status" aria-live="polite">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-container">
        <p className="error" role="alert">{error}</p>
      </main>
    );
  }

  return (
    <main className="products-container">
      <header className="products-header">
        <div>
          <p className="products-eyebrow">Category</p>
          <h1>{category?.name ?? "Category Products"}</h1>
          <p className="products-subtitle">
            {category?.description ?? "Use filters to narrow down what fits your space."}
          </p>

          <div className="products-header-meta" aria-live="polite">
            <span className="products-result-badge">{products.length} product{products.length === 1 ? "" : "s"}</span>
            {activeFilters.length > 0 ? (
              <span className="products-filter-badge">{activeFilters.length} active filter{activeFilters.length === 1 ? "" : "s"}</span>
            ) : null}
          </div>

          {activeFilters.length > 0 ? (
            <ul className="products-active-filters" aria-label="Active filters">
              {activeFilters.map((filter) => (
                <li key={filter} className="products-filter-pill">{filter}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <Link to="/categories" className="products-nav-link">
          Back to categories
        </Link>
      </header>

      <div className="products-layout">
        <aside className="products-sidebar" aria-label="Product filters">
          <form className="products-search-form" onSubmit={handleFilterSubmit}>
            <p className="products-filter-hint">Apply one or more filters, then press Search.</p>

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
              <button type="submit" className="add-to-cart-btn" aria-label="Apply product filters">
                Search
              </button>
              <button type="button" className="filter-clear-btn" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          </form>
        </aside>

        <section className="products-content" aria-live="polite">
          {products.length === 0 ? (
            <p className="no-products">No products in this category match your filters.</p>
          ) : (
            <ul className="products-grid products-grid-list" role="list">
              {products.map((product, index) => {
                const productImageUrl = toAbsoluteImageUrl(product.image_url);
                const inStock = (product.stock_quantity ?? 0) > 0;

                return (
                  <li
                    key={product.id}
                    className="product-card product-card-animated"
                    style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
                  >
                    <div className="product-media">
                      {productImageUrl ? (
                        <img
                          src={productImageUrl}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder" aria-hidden="true">No image</div>
                      )}
                      <span className={`product-stock ${inStock ? "in" : "out"}`}>
                        {inStock ? "In stock" : "Out of stock"}
                      </span>
                    </div>

                    <div className="product-info">
                      <h2 className="product-name">{product.name}</h2>
                      {product.category_name && (
                        <p className="product-category">{product.category_name}</p>
                      )}
                      <p className="product-price">${Number(product.price).toFixed(2)}</p>
                      {product.description && (
                        <p className="product-description">{product.description}</p>
                      )}

                      <div className="product-actions">
                        <Link to={`/products/${product.id}`} className="product-details-link">
                          View details
                        </Link>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                          disabled={addingToCart === product.id || !inStock}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          {addingToCart === product.id ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>

                      {cartMessages[product.id] && (
                        <p
                          className={`cart-message ${cartMessages[product.id].includes("Failed") || cartMessages[product.id].includes("log in") ? "error" : "success"}`}
                          role="status"
                        >
                          {cartMessages[product.id]}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
