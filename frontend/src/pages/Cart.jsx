import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) return navigate('/login?redirect=/checkout');
    navigate('/checkout');
  };

  if (items.length === 0)
    return (
      <div className="page-top container cart-empty">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );

  return (
    <div className="cart-page page-top container">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {items.map(item => (
            <div key={item.key} className="cart-item card">
              <img src={item.product.images[0]} alt={item.product.name} className="cart-img" />
              <div className="cart-item-info">
                <Link to={`/products/${item.product._id}`} className="cart-item-name">
                  {item.product.name}
                </Link>
                {item.size  && <p className="cart-item-meta">Size: {item.size}</p>}
                {item.color && <p className="cart-item-meta">Color: {item.color}</p>}
                <div className="cart-item-bottom">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                  </div>
                  <span className="cart-item-price">
                    ${((item.product.salePrice || item.product.price) * item.qty).toFixed(2)}
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.key)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear cart</button>
        </div>

        {/* Summary */}
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <hr className="divider" />
          <div className="summary-row summary-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div>
          {subtotal < 100 && <p className="free-ship-note">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>}
          <button className="btn btn-primary btn-full" onClick={handleCheckout}>
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: 8 }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
