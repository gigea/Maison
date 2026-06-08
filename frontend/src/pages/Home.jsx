import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured').then(r => setFeatured(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('recentViews') || '[]');
    if (!ids.length) {
      setRecentLoading(false);
      return;
    }
    api.get('/products/recent', { params: { ids: ids.join(',') } })
      .then(r => setRecent(r.data))
      .catch(console.error)
      .finally(() => setRecentLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">New Collection — 2025</p>
          <h1>Dress With <em>Intention</em></h1>
          <p className="hero-sub">Curated pieces that move with you through every season of life.</p>
          <div className="hero-ctas">
            <Link to="/products?gender=women" className="btn btn-primary">Shop Women</Link>
            <Link to="/products?gender=men"   className="btn btn-outline">Shop Men</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80" alt="Fashion collection" />
        </div>
      </section>

      {/* Categories */}
      <section className="categories container">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {[
            { label: 'Dresses',    query: 'category=dresses',    img: 'photo-1595777457583-95e059d581b8' },
            { label: 'Tops',       query: 'category=tops',       img: 'photo-1602810318383-e386cc2a3ccf' },
            { label: 'Outerwear',  query: 'category=outerwear',  img: 'photo-1591369822096-ffd140ec948f' },
            { label: 'Accessories',query: 'category=accessories', img: 'photo-1553062407-98eeb64c6a62' },
          ].map(c => (
            <Link to={`/products?${c.query}`} key={c.label} className="cat-card">
              <img src={`https://images.unsplash.com/${c.img}?w=600&q=80`} alt={c.label} />
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured container">
        <div className="section-header">
          <h2>Featured Pieces</h2>
          <Link to="/products?featured=true" className="btn btn-ghost">View all →</Link>
        </div>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section className="recent container">
          <div className="section-header">
            <h2>Recently Viewed</h2>
            <Link to="/products" className="btn btn-ghost">Browse more</Link>
          </div>
          {recentLoading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {recent.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>
      )}

      {/* Banner */}
      <section className="banner">
        <div className="banner-content container">
          <p>Free shipping on orders over $100 · Easy 30-day returns</p>
        </div>
      </section>
    </div>
  );
}
