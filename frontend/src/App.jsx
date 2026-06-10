import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }           from './context/AuthContext';
import { CartProvider }           from './context/CartContext';
import { WishlistProvider }       from './context/WishlistContext';
import { ToastProvider }          from './context/ToastContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import BackToTop from './components/common/BackToTop';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

import Home             from './pages/Home';
import Products         from './pages/Products';
import ProductDetail    from './pages/ProductDetail';
import Cart             from './pages/Cart';
import Checkout         from './pages/Checkout';
import Auth             from './pages/Auth';
import Profile          from './pages/Profile';
import Orders           from './pages/Orders';
import OrderDetail      from './pages/OrderDetail';
import Admin            from './pages/Admin';
import AdminProductForm from './pages/AdminProductForm';
import Wishlist         from './pages/Wishlist';
import NotFound         from './pages/NotFound';
import SizeGuide        from './pages/SizeGuide';
import Shipping         from './pages/Shipping';
import Returns          from './pages/Returns';
import Contact          from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/"             element={<Home />} />
                    <Route path="/products"     element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart"         element={<Cart />} />
                    <Route path="/wishlist"     element={<Wishlist />} />
                    <Route path="/login"        element={<Auth mode="login" />} />
                    <Route path="/register"     element={<Auth mode="register" />} />
                    <Route path="/checkout"     element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/orders"       element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/orders/:id"   element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path="/admin"        element={<AdminRoute><Admin /></AdminRoute>} />
                    <Route path="/admin/product/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                    <Route path="/size-guide"   element={<SizeGuide />} />
                    <Route path="/shipping"     element={<Shipping />} />
                    <Route path="/returns"      element={<Returns />} />
                    <Route path="/contact"      element={<Contact />} />
                    <Route path="*"             element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <BackToTop />
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
