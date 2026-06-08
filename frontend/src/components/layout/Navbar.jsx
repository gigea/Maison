import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">MAISON</Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/products?category=dresses" onClick={() => setMenuOpen(false)}>Dresses</NavLink>
          <NavLink to="/products?category=tops" onClick={() => setMenuOpen(false)}>Tops</NavLink>
          <NavLink to="/products?gender=men" onClick={() => setMenuOpen(false)}>Men</NavLink>
          <NavLink to="/products?gender=women" onClick={() => setMenuOpen(false)}>Women</NavLink>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <span className="navbar-name">Hi, {user.name.split(' ')[0]}</span>
              {isAdmin && <Link to="/admin" className="btn btn-ghost btn-sm">Admin</Link>}
              <Link to="/orders" className="btn btn-ghost btn-sm">Orders</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          )}
          <Link to="/cart" className="cart-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <button className="menu-toggle hide-desktop" onClick={() => setMenuOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
