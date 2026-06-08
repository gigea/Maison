import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound page-top">
      <div className="notfound-inner">
        <p className="notfound-code">404</p>
        <h1>Page not found</h1>
        <p className="notfound-sub">The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <Link to="/"        className="btn btn-primary">Go Home</Link>
          <Link to="/products" className="btn btn-outline">Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
