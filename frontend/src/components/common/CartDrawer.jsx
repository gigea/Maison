import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleCheckout = () => {
    onClose();
    navigate(user ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Your Cart {totalItems > 0 && <span className="drawer-count">{totalItems}</span>}</h3>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <span className="drawer-empty-icon">🛍️</span>
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary btn-sm" onClick={onClose}>Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map(item => (
                <div key={item.key} className="drawer-item">
                  <Link to={`/products/${item.product._id}`} onClick={onClose}>
                    <img src={item.product.images[0]} alt={item.product.name} className="drawer-img" />
                  </Link>
                  <div className="drawer-item-info">
                    <Link to={`/products/${item.product._id}`} onClick={onClose} className="drawer-item-name">
                      {item.product.name}
                    </Link>
                    <p className="drawer-item-meta">
                      {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `${item.color}`}
                    </p>
                    <div className="drawer-item-row">
                      <div className="qty-mini">
                        <button onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                      </div>
                      <span className="drawer-item-price">
                        ${((item.product.salePrice || item.product.price) * item.qty).toFixed(2)}
                      </span>
                      <button className="drawer-remove" onClick={() => removeItem(item.key)} title="Remove">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              {subtotal < 100 && (
                <div className="drawer-free-ship">
                  <div className="free-ship-bar">
                    <div className="free-ship-fill" style={{ width: `${(subtotal / 100) * 100}%` }} />
                  </div>
                  <p>${(100 - subtotal).toFixed(2)} away from free shipping</p>
                </div>
              )}
              <div className="drawer-subtotal">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleCheckout}>
                {user ? 'Checkout' : 'Login to Checkout'}
              </button>
              <Link to="/cart" className="btn btn-outline btn-full drawer-view-cart" onClick={onClose}>
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
