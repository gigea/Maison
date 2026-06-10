import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import CartDrawer from '../common/CartDrawer';
import SearchBar  from '../common/SearchBar';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => typeof window !== 'undefined' && localStorage.getItem('theme') || 'light');

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    try {
      const active = localStorage.getItem('theme') || theme;
      document.documentElement.setAttribute('data-theme', active === 'dark' ? 'dark' : '');
      localStorage.setItem('theme', active);
      setTheme(active);
    } catch (e) { /* ignore during SSR/test */ }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-logo">MAISON</Link>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/products"                        onClick={() => setMenuOpen(false)}>Shop</NavLink>
            <NavLink to="/products?category=dresses"       onClick={() => setMenuOpen(false)}>Dresses</NavLink>
            <NavLink to="/products?category=tops"          onClick={() => setMenuOpen(false)}>Tops</NavLink>
            <NavLink to="/products?gender=men"             onClick={() => setMenuOpen(false)}>Men</NavLink>
            <NavLink to="/products?gender=women"           onClick={() => setMenuOpen(false)}>Women</NavLink>
            <NavLink to="/products?featured=true"          onClick={() => setMenuOpen(false)}>Sale</NavLink>
          </div>

          <div className="navbar-actions">
            {/* Search */}
            <button className="navbar-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="navbar-icon-btn" title="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="navbar-user">
                {isAdmin && <Link to="/admin" className="btn btn-ghost btn-sm hide-mobile">Admin</Link>}
                <Link to="/profile" className="btn btn-ghost btn-sm">Profile</Link>
                <Link to="/orders" className="btn btn-ghost btn-sm hide-mobile">Orders</Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm hide-mobile">Logout</button>
                <span className="navbar-greeting hide-mobile">Hi, {user.name.split(' ')[0]}</span>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Login</Link>
            )}

            {/* Cart */}
            <button className="navbar-icon-btn cart-trigger" onClick={() => setDrawerOpen(true)} title="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
            </button>

            {/* Theme toggle */}
            <button className="navbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              )}
            </button>

            <button className="menu-toggle hide-desktop" onClick={() => setMenuOpen(v => !v)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
