/**
 * CategoryProducts
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { RootState } from "../../../store";
import type { Product } from "../services/catalogService";
import { getCategories, getProducts } from "../services/catalogService";
import { addToCart } from "../../cart/services/cartService";
import ProductCard from "../../../components/ui/ProductCard";
import {
  setProducts,
  setCategories,
  setLoading,
  setError,
  clearError,
} from "../../../store/slices/catalogDataSlice";
import {
  setCategorySearchInput,
  setCategoryMinPriceInput,
  setCategoryMaxPriceInput,
  setCategoryColorInput,
  resetCategoryFilters,
} from "../../../store/slices/catalogUiSlice";
import "../../../styles/Products.css";

export default function CategoryProducts() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const products = useSelector((state: RootState) => state.catalogData.products);
  const categories = useSelector((state: RootState) => state.catalogData.categories);
  const loading = useSelector((state: RootState) => state.catalogData.loading);
  const error = useSelector((state: RootState) => state.catalogData.error);
  const { searchInput, minPriceInput, maxPriceInput, colorInput } = useSelector(
    (state: RootState) => state.catalogUi.categoryProductsFilters
  );
  const catalogRevision = useCatalogRefresh();
  const { id } = useParams();
  const categoryId = Number(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const colorOptions = ["", "black", "white", "red", "blue", "brown", "gray", "green", "yellow"];
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [cartMessages, setCartMessages] = useState<Record<number, string>>({});

  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const color = searchParams.get("color");

  const activeFilters = useMemo(
    () => [
      search ? `Search: ${search}` : null,
      color ? `Color: ${color}` : null,
      minPrice ? `Min: $${minPrice}` : null,
      maxPrice ? `Max: $${maxPrice}` : null,
    ].filter((item): item is string => Boolean(item)),
    [search, color, minPrice, maxPrice]
  );

  const hasValidCategoryId = !Number.isNaN(categoryId) && categoryId > 0;

  useEffect(() => {
    dispatch(setCategorySearchInput(search ?? ""));
    dispatch(setCategoryMinPriceInput(minPrice ?? ""));
    dispatch(setCategoryMaxPriceInput(maxPrice ?? ""));
    dispatch(setCategoryColorInput(color ?? ""));
  }, [search, minPrice, maxPrice, color, dispatch]);

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
    dispatch(resetCategoryFilters());
    updateQueryParams({ search: null, minPrice: null, maxPrice: null, color: null });
  };

  useEffect(() => {
    if (!hasValidCategoryId) {
      dispatch(setError("Invalid category."));
      dispatch(setLoading(false));
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const cats = await getCategories();
        dispatch(setCategories(cats));

        const prods = await getProducts({
          categoryId: String(categoryId),
          search: search ?? undefined,
          minPrice: minPrice ?? undefined,
          maxPrice: maxPrice ?? undefined,
          color: color ?? undefined,
        });

        dispatch(setProducts(prods));
      } catch (fetchError) {
        console.error("Failed to fetch category products:", fetchError);
        dispatch(setError("Failed to load this category. Please try again later."));
        dispatch(setProducts([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCategoryProducts();
  }, [categoryId, hasValidCategoryId, search, minPrice, maxPrice, color, catalogRevision, dispatch]);

  const category = categories.find((c) => c.id === categoryId) ?? null;

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
    } catch (err) {
      console.error("Failed to add to cart:", err);
      const message = err instanceof Error ? err.message : "Failed to add item. Please try again.";
      setCartMessages((prev) => ({
        ...prev,
        [product.id]: message,
      }));
    } finally {
      setAddingToCart(null);
    }
  };

  if (!hasValidCategoryId) {
    return (
      <main className="category-products-page">
        <h1>Category</h1>
        <p className="categories-error">Invalid category.</p>
      </main>
    );
  }

  return (
    <main className="category-products-page page-fade-in">
      <header className="products-header">
        <div>
          <p className="products-eyebrow">Category</p>
          <h1>{category ? category.name : "Category"}</h1>
          <p className="products-subtitle">Browse items in this category.</p>
        </div>
      </header>

      <div className="products-layout">
        <aside className="products-sidebar" aria-label="Filters">
          <form className="products-search-form" onSubmit={handleFilterSubmit}>
            <div>
              <h3>Search</h3>
              <div className="filter-group">
                <label htmlFor="category-search">Product name</label>
                <input
                  id="category-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => dispatch(setCategorySearchInput(e.target.value))}
                  placeholder="Find products..."
                />
              </div>
            </div>

            <div>
              <h3>Color</h3>
              <div className="filter-group">
                <label htmlFor="category-color">Select color</label>
                <select
                  id="category-color"
                  value={colorInput}
                  onChange={(e) => dispatch(setCategoryColorInput(e.target.value))}
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
                <label htmlFor="category-min-price">Min price</label>
                <input
                  id="category-min-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minPriceInput}
                  onChange={(e) => dispatch(setCategoryMinPriceInput(e.target.value))}
                  placeholder="$0.00"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="category-max-price">Max price</label>
                <input
                  id="category-max-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPriceInput}
                  onChange={(e) => dispatch(setCategoryMaxPriceInput(e.target.value))}
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
            <p className="products-state">Loading products...</p>
          ) : null}

          {!error && !loading && products.length === 0 ? (
            <div className="products-empty-state" role="status">
              <h2>No products found</h2>
              <p>Try adjusting your search, selected color, or price range.</p>
              {activeFilters.length > 0 ? (
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
    </main>
  );
}
