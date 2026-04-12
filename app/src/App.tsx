/**
 * App
 * Central route map for public, authenticated, and admin-only pages.
 */
import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import useCatalogRealtimeSync from "./hooks/useCatalogRealtimeSync";
import AdminCategoryManagement from "./features/admin/pages/AdminCategoryManagement";
import AdminDesignRequests from "./features/admin/pages/AdminDesignRequests";
import AdminProductManagement from "./features/admin/pages/AdminProductManagement";
import AdminProductStats from "./features/admin/pages/AdminProductStats";
import AdminUserManagement from "./features/admin/pages/AdminUserManagement";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Cart from "./features/cart/pages/Cart";
import AboutUs from "./features/catalog/pages/AboutUs";
import Categories from "./features/catalog/pages/Categories";
import CategoryProducts from "./features/catalog/pages/CategoryProducts";
import Home from "./features/catalog/pages/Home";
import ProductDetails from "./features/catalog/pages/ProductDetails";
import Products from "./features/catalog/pages/Products";
import DesignStudio from "./features/design/pages/DesignStudio";
import Orders from "./features/orders/pages/Orders";

function App() {
  // Global realtime listener that triggers catalog refresh events across pages.
  useCatalogRealtimeSync();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryProducts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/design-studio"
          element={
            <ProtectedRoute>
              <DesignStudio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategoryManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <AdminRoute>
              <AdminProductStats />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/design-requests"
          element={
            <AdminRoute>
              <AdminDesignRequests />
            </AdminRoute>
          }
        />
        {/* Redirect unknown routes to home to keep navigation predictable. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
