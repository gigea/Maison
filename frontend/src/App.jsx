import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

import Home             from './pages/Home';
import Products         from './pages/Products';
import ProductDetail    from './pages/ProductDetail';
import Cart             from './pages/Cart';
import Checkout         from './pages/Checkout';
import Auth             from './pages/Auth';
import Orders           from './pages/Orders';
import OrderDetail      from './pages/OrderDetail';
import Admin            from './pages/Admin';
import AdminProductForm from './pages/AdminProductForm';
import NotFound         from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/"             element={<Home />} />
              <Route path="/products"     element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart"         element={<Cart />} />
              <Route path="/login"        element={<Auth mode="login" />} />
              <Route path="/register"     element={<Auth mode="register" />} />

              {/* Protected — must be logged in */}
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

              {/* Admin only */}
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/product/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
