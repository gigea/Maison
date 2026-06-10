import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { _id, name, price, salePrice, images, category, rating, numReviews, sizes, stock } = product;
  const { addItem } = useCart();
  const toast = useToast();
  const discount = salePrice ? Math.round((1 - salePrice / price) * 100) : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = sizes?.[0] || '';
    addItem(product, defaultSize, '', 1);
    toast.show(`${name} added to cart`, 'success');
  };

  return (
    <Link to={`/products/${_id}`} className="product-card">
      <div className="product-card-img">
        <img
          src={images[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={name} loading="lazy"
        />
        {discount && <span className="badge badge-sale product-badge">-{discount}%</span>}
        {stock === 0 && <span className="badge product-badge-oos">Sold Out</span>}

        {/* Wishlist button */}
        <WishlistButton product={product} className="card-wishlist-btn" />

        {/* Quick add */}
        <div className="product-card-overlay">
          {stock > 0
            ? <button className="btn btn-primary btn-sm quick-add-btn" onClick={handleQuickAdd}>Quick Add</button>
            : <span className="btn btn-sm" style={{background:'rgba(255,255,255,0.8)',color:'var(--c-muted)'}}>Sold Out</span>
          }
        </div>
      </div>

      <div className="product-card-info">
        <p className="product-card-cat">{category}</p>
        <h3 className="product-card-name">{name}</h3>
        <div className="product-card-footer">
          <div className="product-card-price">
            {salePrice
              ? <><span className="price-sale">${salePrice}</span><span className="price-original">${price}</span></>
              : <span>${price}</span>}
          </div>
          {numReviews > 0 && (
            <div className="product-card-rating">
              <span className="star">★</span>
              <span>{rating.toFixed(1)}</span>
              <span className="rating-count">({numReviews})</span>
            </div>
          )}
        </div>
        <div className="product-card-stock">
          {stock > 0
            ? <span className={`stock-pill ${stock < 10 ? 'stock-low' : ''}`}>In stock: {stock}</span>
            : <span className="stock-pill stock-out">Sold out</span>}
        </div>
      </div>
    </Link>
  );
}
