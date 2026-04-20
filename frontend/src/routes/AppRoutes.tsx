import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import Spinner from "../components/ui/Spinner";
import ProtectedRoute from "../components/shared/ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import StorefrontLayout from "../layouts/StorefrontLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";

import ProductsPage from "../pages/storefront/ProductsPage";
import CheckoutPage from "../pages/storefront/CheckoutPage";
import CustomerOrdersPage from "../pages/storefront/CustomerOrdersPage";
import CustomerOrderDetailPage from "../pages/storefront/CustomerOrderDetailPage";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/products"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin — role guard */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin">
          <AdminLayout><AdminDashboardPage /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute role="admin">
          <AdminLayout><AdminOrdersPage /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders/:id" element={
        <ProtectedRoute role="admin">
          <AdminLayout><AdminOrderDetailPage /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute role="admin">
          <AdminLayout><AdminProductsPage /></AdminLayout>
        </ProtectedRoute>
      } />

      {/* Storefront — public */}
      <Route path="/products" element={
        <StorefrontLayout><ProductsPage /></StorefrontLayout>
      } />

      {/* Storefront — auth required */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <StorefrontLayout><CheckoutPage /></StorefrontLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <StorefrontLayout><CustomerOrdersPage /></StorefrontLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders/:id" element={
        <ProtectedRoute>
          <StorefrontLayout><CustomerOrderDetailPage /></StorefrontLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
