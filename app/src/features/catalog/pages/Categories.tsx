/**
 * Categories
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { Category } from "../services/catalogService";
import {
  getCategories,
  getCategoryImagesMap,
} from "../services/catalogService";
import "../../../styles/Categories.css";

export default function Categories() {
  const catalogRevision = useCatalogRefresh();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const spotlightCategories = useMemo(() => categories.slice(0, 4), [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const nextCategories = await getCategories();
        setCategories(nextCategories);

        const imageMap = await getCategoryImagesMap(nextCategories);
        setCategoryImages(imageMap);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(err instanceof Error ? err.message : "Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [catalogRevision]);

  if (loading) {
    return (
      <main className="categories-page">
        <p className="categories-state">Loading categories...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="categories-page">
        <p className="categories-state categories-error">{error}</p>
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
