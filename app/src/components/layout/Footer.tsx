/**
 * Footer
 * Frontend layout module for Echelon Living app.
 */
import { Link } from "react-router-dom";
import "../../styles/layout/Footer.css";

function Footer() {
  return (
    <footer className="layout-footer">
      <div className="layout-container layout-footer-inner">
        <p className="layout-footer-brand">Echelon Living</p>
        <nav className="layout-footer-links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about-us">About</Link>
        </nav>
        <p className="layout-footer-copy">Designed for calm, modern spaces.</p>
      </div>
    </footer>
  );
}

export default Footer;
