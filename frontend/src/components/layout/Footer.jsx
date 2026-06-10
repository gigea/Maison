import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">MAISON</span>
          <p>Curated fashion for the modern wardrobe. Quality pieces, thoughtfully made.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <Link to="/products?gender=women">Women</Link>
            <Link to="/products?gender=men">Men</Link>
            <Link to="/products?category=accessories">Accessories</Link>
            <Link to="/products?featured=true">New Arrivals</Link>
          </div>
          <div>
            <h4>Help</h4>
            <Link to="/size-guide">Size Guide</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/shipping">Shipping</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} MAISON. All rights reserved.</span>
      </div>
    </footer>
  );
}
