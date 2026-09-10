import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminTheme } from './pages/admin/AdminTheme';

// Customer layout wrapper
const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-root min-h-screen">
      <Routes>
        {/* Customer Facing Routes */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <HomePage />
            </CustomerLayout>
          }
        />
        <Route
          path="/products"
          element={
            <CustomerLayout>
              <ProductsPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <CustomerLayout>
              <ProductDetailPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerLayout>
              <CheckoutPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <CustomerLayout>
              <ProfilePage />
            </CustomerLayout>
          }
        />
        <Route
          path="/customize"
          element={
            <CustomerLayout>
              <AdminTheme />
            </CustomerLayout>
          }
        />

        {/* Isolated Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="theme" element={<AdminTheme />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
