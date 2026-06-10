import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Wishlist.css';

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();

  const handleMoveToCart = (product) => {
    addItem(product, product.sizes?.[0] || '', '', 1);
    toggle(product);
    toast.show(`${product.name} moved to cart`, 'success');
  };

  return (
    <div className="wishlist-page page-top container">
      <h1>My Wishlist {items.length > 0 && <span className="wl-count">{items.length}</span>}</h1>

      {items.length === 0 ? (
        <div className="wl-empty">
          <span className="wl-empty-icon">♡</span>
          <p>Your wishlist is empty</p>
          <Link to="/products" className="btn btn-primary">Discover Products</Link>
        </div>
      ) : (
        <>
          <div className="wl-grid">
            {items.map(product => (
              <div key={product._id} className="wl-card card">
                <Link to={`/products/${product._id}`} className="wl-img-wrap">
                  <img src={product.images?.[0]} alt={product.name}
                    onError={e => e.target.src='https://via.placeholder.com/300x380?text=?'} />
                  {product.salePrice && <span className="badge badge-sale wl-badge">Sale</span>}
                </Link>
                <div className="wl-info">
                  <p className="wl-cat">{product.category}</p>
                  <Link to={`/products/${product._id}`} className="wl-name">{product.name}</Link>
                  <p className="wl-price">
                    {product.salePrice
                      ? <><span className="price-sale">${product.salePrice}</span> <s>${product.price}</s></>
                      : `$${product.price}`}
                  </p>
                  <div className="wl-actions">
                    <button className="btn btn-primary btn-sm btn-full" onClick={() => handleMoveToCart(product)}
                      disabled={product.stock === 0}>
                      {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => toggle(product)} title="Remove">♡</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="wl-footer">
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </>
      )}
    </div>
  );
}
