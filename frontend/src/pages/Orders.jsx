import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Orders.css';

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center page-top"><div className="spinner" /></div>;

  return (
    <div className="orders-page page-top container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <Link to={`/orders/${order._id}`} key={order._id} className="order-row card">
              <div className="order-row-info">
                <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-row-items">
                {order.items.slice(0, 3).map(item => (
                  <img key={item._id} src={item.image} alt={item.name} className="order-thumb" />
                ))}
                {order.items.length > 3 && <span className="order-more">+{order.items.length - 3}</span>}
              </div>
              <span className={`badge badge-${order.status}`}>{order.status}</span>
              <span className="order-total">${order.totalPrice.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
