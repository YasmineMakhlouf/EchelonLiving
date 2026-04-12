/**
 * AboutUs
 * Frontend pages module for Echelon Living app.
 */
import { Link } from "react-router-dom";
import "../../../styles/AboutUs.css";

export default function AboutUs() {
  return (
    <main className="about-page">
      <section className="about-card">
        <p className="about-eyebrow">About Echelon Living</p>
        <h1>We build calm, practical spaces for everyday life.</h1>
        <p className="about-intro">
          Echelon Living is focused on furniture and home pieces that balance comfort,
          quality, and modern style. We curate products that are easy to mix, easy to
          use, and designed to make your home feel cohesive.
        </p>

        <div className="about-grid" aria-label="What we value">
          <article>
            <h2>Our mission</h2>
            <p>
              Help people create homes that feel warm, intentional, and functional,
              without making shopping complicated.
            </p>
          </article>

          <article>
            <h2>What we offer</h2>
            <p>
              Thoughtful categories, clear product information, and a streamlined shopping
              experience from discovery to checkout.
            </p>
          </article>

          <article>
            <h2>Our promise</h2>
            <p>
              Keep improving our collection and platform so customers can find pieces
              that work beautifully in real homes.
            </p>
          </article>
        </div>

        <div className="about-actions">
          <Link to="/products" className="about-primary-action">
            Browse products
          </Link>
          <Link to="/" className="about-secondary-action">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}