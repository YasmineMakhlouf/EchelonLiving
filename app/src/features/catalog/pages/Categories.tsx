/**
 * Categories
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { RootState } from "../../../store";
import {
  getCategories,
  getCategoryImagesMap,
} from "../services/catalogService";
import {
  setCategories,
  setCategoryImages,
  setLoading,
  clearError,
} from "../../../store/slices/catalogDataSlice";
import "../../../styles/Categories.css";

export default function Categories() {
  const dispatch = useDispatch();
  const catalogRevision = useCatalogRefresh();
  const categories = useSelector((state: RootState) => state.catalogData.categories);
  const categoryImages = useSelector((state: RootState) => state.catalogData.categoryImages);
  const loading = useSelector((state: RootState) => state.catalogData.loading);

  const spotlightCategories = useMemo(() => categories.slice(0, 4), [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const nextCategories = await getCategories();
        dispatch(setCategories(nextCategories));

        const imageMap = await getCategoryImagesMap(nextCategories);
        dispatch(setCategoryImages(imageMap));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCategories();
  }, [catalogRevision, dispatch]);

  if (loading) {
    return (
      <main className="categories-page">
        <p className="categories-state">Loading categories...</p>
      </main>
    );
  }

  return (
    <main className="categories-page">
      <section className="categories-header">
        <p className="categories-eyebrow">Shop by category</p>
        <h1>Choose a category first, then filter products the way you like.</h1>
        <p>
          Click any category to open its own page with filters for search, color, and price.
        </p>
      </section>

      <section className="categories-spotlight" aria-label="Category spotlight">
        {spotlightCategories.map((category) => {
          const hasImage = Boolean(categoryImages[category.id]);
          const cardStyle = hasImage
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(25, 20, 15, 0.12), rgba(25, 20, 15, 0.58)), url(${categoryImages[category.id]})`,
              }
            : undefined;

          return (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className={`category-spotlight-card ${hasImage ? "has-image" : ""}`}
              style={cardStyle}
            >
              <div className="category-spotlight-overlay">
                <h2>{category.name}</h2>
                <span className="category-spotlight-button">View All</span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="categories-list" aria-labelledby="all-categories-heading">
        <div className="categories-list-header">
          <h2 id="all-categories-heading">All categories</h2>
          <Link to="/products" className="categories-all-products-link">
            Explore trending products
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="categories-list-grid">
            {categories.map((category) => (
              <Link key={category.id} to={`/categories/${category.id}`} className="categories-list-card">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span>Open category</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="categories-state">No categories available yet.</p>
        )}
      </section>
    </main>
  );
}
