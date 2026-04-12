/**
 * Home
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCatalogRefresh from "../../../hooks/useCatalogRefresh";
import type { Category, Product } from "../services/catalogService";
import {
  getCategories,
  getTrendingProducts,
} from "../services/catalogService";
import "../../../styles/Home.css";

function Home() {
  const catalogRevision = useCatalogRefresh();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategoriesError(err instanceof Error ? err.message : "Failed to load categories. Please try again.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [catalogRevision]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const data = await getTrendingProducts();
        setTrendingProducts(data);
      } catch (err) {
        setProductsError(err instanceof Error ? err.message : "Failed to load trending products. Please try again.");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [catalogRevision]);

  return (
    <main className="home-page page-fade-in">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Curated interiors</p>
          <h1>Furniture that feels composed, calm, and built for everyday living.</h1>
          <p className="home-intro">
            Start with a category, move quickly into products, and find pieces that work together instead of fighting for attention.
          </p>

          <div className="home-hero-actions">
            <Link to="/products" className="home-primary-action">
              Browse products
            </Link>
            <a href="#collections" className="home-secondary-action">
              Explore collections
            </a>
          </div>

          <dl className="home-metrics" aria-label="Store highlights">
            <div>
              <dt>Fast browsing</dt>
              <dd>Jump from category to product detail in one click.</dd>
            </div>
            <div>
              <dt>Focused selection</dt>
              <dd>Shop a tighter catalog with clear categories and filters.</dd>
            </div>
            <div>
              <dt>Room-ready style</dt>
              <dd>Pieces chosen to make modern living spaces feel coherent.</dd>
            </div>
          </dl>
        </div>

        <aside className="home-hero-panel" aria-label="Shopping shortcuts">
          <p className="home-panel-eyebrow">Shop smarter</p>
          <h2>Everything you need to start a room, finish a room, or refresh a corner.</h2>
          <ul className="home-panel-list">
            <li>Browse by category before diving into the full catalog.</li>
            <li>Use products search and filters when you know what you want.</li>
            <li>Save time with a layout that gets out of the way.</li>
          </ul>
          <Link to="/products" className="home-panel-link">
            View the full catalog
          </Link>
        </aside>
      </section>

      {categoriesLoading ? <p className="home-state">Loading categories...</p> : null}
      {categoriesError ? <p className="home-state home-error">{categoriesError}</p> : null}
      {productsLoading ? <p className="home-state">Loading trending products...</p> : null}
      {productsError ? <p className="home-state home-error">{productsError}</p> : null}

      {!categoriesLoading && !categoriesError && (
        <>
          <section className="home-section" aria-labelledby="collections-heading" id="collections">
            <div className="home-section-header">
              <div>
                <p className="home-section-eyebrow">Collections</p>
                <h2 id="collections-heading">Start with a category, then refine from there.</h2>
              </div>
              <p className="home-section-copy">
                The most useful way to shop is often the simplest one: choose a category, compare a few options, then move into the product list.
              </p>
            </div>

            {categories.length > 0 ? (
              <section className="home-category-grid" aria-label="Categories">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    className="home-category-card"
                    to={`/categories/${category.id}`}
                  >
                    <span className="home-category-index">0{index + 1}</span>
                    <span className="home-category-kicker">Explore</span>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="home-category-link">Open products</span>
                  </Link>
                ))}
              </section>
            ) : (
              <div className="home-empty-state">
                <h3>No categories yet</h3>
                <p>
                  Categories will appear here once they are added to the catalog.
                </p>
              </div>
            )}
          </section>

          <section className="home-section" aria-labelledby="trending-heading">
            <div className="home-section-header">
              <div>
                <p className="home-section-eyebrow">Trending</p>
                <h2 id="trending-heading">A small selection of products to keep the home page focused.</h2>
              </div>
              <p className="home-section-copy">
                These are sampled from recent products so the page stays compact while still surfacing items worth browsing.
              </p>
            </div>

            {trendingProducts.length > 0 ? (
              <section className="home-product-grid" aria-label="Trending products">
                {trendingProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="home-product-card">
                    <span className="home-product-kicker">Trending</span>
                    {product.category_name ? <span className="home-product-category">{product.category_name}</span> : null}
                    <h3>{product.name}</h3>
                    <p>{product.description ?? "View details, pricing, and related products."}</p>
                    <div className="home-product-footer">
                      <span className="home-product-price">${Number(product.price).toFixed(2)}</span>
                      <span className="home-category-link">View product</span>
                    </div>
                  </Link>
                ))}
              </section>
            ) : productsLoading ? null : (
              <div className="home-empty-state">
                <h3>No trending products yet</h3>
                <p>
                  Products will appear here once the catalog has been populated.
                </p>
              </div>
            )}
          </section>

          <section className="home-section home-section-inline" aria-labelledby="search-heading">
            <div>
              <p className="home-section-eyebrow">Need precision?</p>
              <h2 id="search-heading">Search the full catalog when you already know the shape of what you want.</h2>
            </div>
            <Link to="/products" className="home-inline-link">
              Search and filter products
            </Link>
          </section>
        </>
      )}

      <section className="home-section home-section-inline" aria-labelledby="about-contact-heading">
        <div>
          <p className="home-section-eyebrow">Get to know us</p>
          <h2 id="about-contact-heading">Want to learn more or contact us directly?</h2>
        </div>
        <div className="home-end-actions">
          <Link to="/about-us" className="home-primary-action">
            About Us
          </Link>
          <a
            href="mailto:yasminemakhlouf1102@gmail.com?subject=Contact%20from%20Echelon%20Living"
            className="home-secondary-action"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}

export default Home;