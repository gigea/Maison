import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const {
    _id, name, price, salePrice, images,
    category, rating, numReviews, featured,
    stock, sizes, colors,
  } = product;

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const defaultSize = sizes?.[0] || '';
  const defaultColor = colors?.[0]?.name || '';
  const discount = salePrice ? Math.round((1 - salePrice / price) * 100) : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) return;
    addItem(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${_id}`} className="product-card-link">
        <div className="product-card-img">
          <img
            src={images[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={name}
            loading="lazy"
          />
          <div className="product-card-badges">
            {featured && <span className="badge badge-new product-badge">Featured</span>}
            {stock > 0 && stock < 5 && <span className="badge badge-warning product-badge">Low stock</span>}
            {stock === 0 && <span className="badge badge-danger product-badge">Sold out</span>}
          </div>
          {discount && <span className="badge badge-sale product-badge">-{discount}%</span>}
          <div className="product-card-overlay">
            <span className="btn btn-primary btn-sm">Quick View</span>
          </div>
        </div>
        <div className="product-card-info">
          <p className="product-card-cat">{category}</p>
          <h3 className="product-card-name">{name}</h3>
          <div className="product-card-footer">
            <div className="product-card-price">
              {salePrice ? (
                <>
                  <span className="price-sale">${salePrice}</span>
                  <span className="price-original">${price}</span>
                </>
              ) : (
                <span>${price}</span>
              )}
            </div>
            {numReviews > 0 && (
              <div className="product-card-rating">
                <span className="star">★</span>
                <span>{rating.toFixed(1)}</span>
                <span className="rating-count">({numReviews})</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="product-card-actions">
        <button type="button"
          className={`btn btn-outline btn-sm ${added ? 'btn-success' : ''}`}
          onClick={handleQuickAdd}
          disabled={stock === 0}
        >
          {stock === 0 ? 'Sold out' : added ? 'Added' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
