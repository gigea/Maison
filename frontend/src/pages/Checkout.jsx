import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = shipping, 2 = payment, 3 = confirm
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'Algeria' });
  const [payment, setPayment] = useState('card');

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  const handleOrder = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({
          product: i.product._id, name: i.product.name,
          image: i.product.images[0], price: i.product.salePrice || i.product.price,
          size: i.size, color: i.color, quantity: i.qty,
        })),
        shippingAddress: address, paymentMethod: payment,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
      });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page page-top container">
      <h1>Checkout</h1>

      {/* Steps */}
      <div className="checkout-steps">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className={`step ${step > i ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
            <span className="step-num">{step > i+1 ? '✓' : i+1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          {error && <p className="alert alert-error">{error}</p>}

          {step === 1 && (
            <div className="card checkout-card">
              <h3>Shipping Address</h3>
              {['street', 'city', 'state', 'zip', 'country'].map(f => (
                <div className="form-group" key={f}>
                  <label className="form-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                  <input className="form-input" value={address[f]}
                    onChange={e => setAddress({ ...address, [f]: e.target.value })} required />
                </div>
              ))}
              <button className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!address.street || !address.city || !address.zip}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card checkout-card">
              <h3>Payment Method</h3>
              {['card', 'paypal', 'cash_on_delivery'].map(m => (
                <label key={m} className="payment-option">
                  <input type="radio" name="payment" value={m}
                    checked={payment === m} onChange={() => setPayment(m)} />
                  <span className="payment-label">
                    {m === 'card' ? '💳 Credit / Debit Card' : m === 'paypal' ? '🅿️ PayPal' : '💵 Cash on Delivery'}
                  </span>
                </label>
              ))}
              {payment === 'card' && (
                <div className="card-placeholder">
                  <p>Card processing will be integrated via Stripe / similar.</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card checkout-card">
              <h3>Review & Place Order</h3>
              <div className="review-address">
                <p><strong>Ship to:</strong> {address.street}, {address.city}, {address.country} {address.zip}</p>
                <p><strong>Payment:</strong> {payment}</p>
              </div>
              <div className="review-items">
                {items.map(item => (
                  <div key={item.key} className="review-item">
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <div>
                      <p>{item.product.name}</p>
                      <p className="review-item-meta">{item.size} · {item.color} · x{item.qty}</p>
                    </div>
                    <span>${((item.product.salePrice || item.product.price) * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-accent btn-full" onClick={handleOrder} disabled={loading}>
                  {loading ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="checkout-summary card">
          <h3>Order Summary ({items.length} items)</h3>
          {items.map(i => (
            <div key={i.key} className="summary-item">
              <span>{i.product.name} x{i.qty}</span>
              <span>${((i.product.salePrice || i.product.price) * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr className="divider" />
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <hr className="divider" />
          <div className="summary-row summary-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div>
        </div>
      </div>
    </div>
  );
}
