import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './OrderDetail.css';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center page-top"><div className="spinner" /></div>;
  if (error)   return <div className="page-top container"><p className="alert alert-error">{error}</p></div>;
  if (!order)  return null;

  const currentStep = order.status === 'cancelled'
    ? -1
    : STATUS_STEPS.indexOf(order.status);

  return (
    <div className="order-detail page-top container">
      {/* Header */}
      <div className="od-header">
        <div>
          <Link to="/orders" className="od-back">← My Orders</Link>
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="od-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`badge badge-${order.status} badge-lg`}>{order.status}</span>
      </div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' ? (
        <div className="od-timeline card">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className={`timeline-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
              <div className="timeline-dot">
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              {i < STATUS_STEPS.length - 1 && <div className={`timeline-line ${i < currentStep ? 'filled' : ''}`} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-error">This order was cancelled.</div>
      )}

      <div className="od-layout">
        {/* Items */}
        <div className="od-main">
          <div className="card od-card">
            <h3>Items Ordered</h3>
            {order.items.map(item => (
              <div key={item._id} className="od-item">
                <img src={item.image || 'https://via.placeholder.com/80x100'} alt={item.name} />
                <div className="od-item-info">
                  <p className="od-item-name">{item.name}</p>
                  <p className="od-item-meta">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' · '}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  <p className="od-item-meta">Qty: {item.quantity}</p>
                </div>
                <span className="od-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="card od-card">
            <h3>Shipping Address</h3>
            <address className="od-address">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>
        </div>

        {/* Summary */}
        <div className="od-aside">
          <div className="card od-card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
            <hr className="divider" />
            <div className="summary-row summary-total">
              <strong>Total</strong>
              <strong>${order.totalPrice.toFixed(2)}</strong>
            </div>
            <hr className="divider" />
            <div className="summary-row">
              <span>Payment</span>
              <span className="od-payment">{order.paymentMethod}</span>
            </div>
            <div className="summary-row">
              <span>Payment status</span>
              <span className={order.isPaid ? 'text-success' : 'text-muted'}>
                {order.isPaid ? `Paid · ${new Date(order.paidAt).toLocaleDateString()}` : 'Pending'}
              </span>
            </div>
          </div>

          <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: 12 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
