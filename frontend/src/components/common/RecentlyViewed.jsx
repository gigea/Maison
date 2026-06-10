import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import './RecentlyViewed.css';

export default function RecentlyViewed({ excludeId }) {
  const { items } = useRecentlyViewed();
  const filtered = items.filter(p => p._id !== excludeId).slice(0, 6);
  if (!filtered.length) return null;

  return (
    <section className="recently-viewed">
      <h2>Recently Viewed</h2>
      <div className="rv-grid">
        {filtered.map(p => (
          <Link key={p._id} to={`/products/${p._id}`} className="rv-card">
            <div className="rv-img">
              <img src={p.images?.[0]} alt={p.name}
                onError={e => e.target.src='https://via.placeholder.com/200x260?text=?'} />
            </div>
            <div className="rv-info">
              <p className="rv-name">{p.name}</p>
              <p className="rv-price">
                {p.salePrice
                  ? <><span className="price-sale">${p.salePrice}</span> <s>${p.price}</s></>
                  : `$${p.price}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
