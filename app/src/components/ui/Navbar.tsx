/**
 * Navbar
 * Frontend UI components module for Echelon Living app.
 */
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";
import type { RootState } from "../../store";
import "../../styles/layout/Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(clearAuth());
    window.location.assign("/");
  };

  return (
    <header className="layout-navbar">
      <div className="layout-container layout-navbar-inner">
        <Link to="/" className="layout-brand" aria-label="Echelon Living home">
          ECHELON LIVING
        </Link>

        <nav aria-label="Primary" className="layout-nav-links">
          <NavLink to="/" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`} end>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
            Products
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
            Categories
          </NavLink>

          {token && (
            <>
              <NavLink to="/design-studio" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                Design Studio
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                Cart
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                Orders
              </NavLink>
              {user?.role === "admin" && (
                <>
                  <NavLink to="/admin/users" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                    Admin Users
                  </NavLink>
                  <NavLink to="/admin/categories" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                    Admin Categories
                  </NavLink>
                  <NavLink to="/admin/products" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                    Admin Products
                  </NavLink>
                  <NavLink to="/admin/stats" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                    Admin Stats
                  </NavLink>
                  <NavLink
                    to="/admin/design-requests"
                    className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}
                  >
                    Admin Designs
                  </NavLink>
                </>
              )}
            </>
          )}

          {!token && (
            <>
              <NavLink to="/login" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `layout-nav-link ${isActive ? "is-active" : ""}`}>
                Register
              </NavLink>
            </>
          )}
        </nav>

        <div className="layout-nav-auth">
          {token ? (
            <button type="button" className="layout-logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="layout-login-chip">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
