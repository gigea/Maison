import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [selectedImg,   setSelectedImg]   = useState(0);
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);
  const [review,  setReview]  = useState({ rating: 5, comment: '' });
  const [revMsg,  setRevMsg]  = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data);
      if (r.data.colors?.length) setSelectedColor(r.data.colors[0].name);
    }).catch(() => setError('Product not found.')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const recent = JSON.parse(localStorage.getItem('recentViews') || '[]');
    const next = [id, ...recent.filter(item => item !== id)].slice(0, 10);
    localStorage.setItem('recentViews', JSON.stringify(next));
  }, [id]);

  const handleAdd = () => {
    if (!selectedSize) return alert('Please select a size');
    addItem(product, selectedSize, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      setRevMsg('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setRevMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="loading-center page-top"><div className="spinner" /></div>;
  if (error)   return <div className="page-top container"><p className="alert alert-error">{error}</p></div>;
  if (!product) return null;

  const { name, description, price, salePrice, images, category, gender, sizes, colors, brand, rating, reviews, stock } = product;

  return (
    <div className="product-detail page-top container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Shop</Link> / <span>{name}</span>
      </nav>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="gallery-main">
            <img src={images[selectedImg] || 'https://via.placeholder.com/600x750'} alt={name} />
            {salePrice && <span className="badge badge-sale gallery-badge">Sale</span>}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <button key={i} className={`thumb ${selectedImg === i ? 'active' : ''}`}
                  onClick={() => setSelectedImg(i)}>
                  <img src={img} alt={`View ${i+1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="detail-category">{gender} · {category}</p>
          <h1 className="detail-name">{name}</h1>
          {brand && <p className="detail-brand">by {brand}</p>}

          <div className="detail-price">
            {salePrice ? (
              <>
                <span className="price-sale">${salePrice}</span>
                <span className="price-original">${price}</span>
              </>
            ) : <span>${price}</span>}
          </div>

          {rating > 0 && (
            <div className="detail-rating">
              {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
              <span>({reviews.length} reviews)</span>
            </div>
          )}

          <p className="detail-desc">{description}</p>

          {/* Color */}
          {colors?.length > 0 && (
            <div className="detail-option">
              <label>Color: <strong>{selectedColor}</strong></label>
              <div className="color-swatches">
                {colors.map(c => (
                  <button key={c.name} title={c.name}
                    className={`color-swatch ${selectedColor === c.name ? 'active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setSelectedColor(c.name)} />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {sizes?.length > 0 && (
            <div className="detail-option">
              <label>Size{!selectedSize && <span className="req"> *</span>}</label>
              <div className="size-btns">
                {sizes.map(s => (
                  <button key={s}
                    className={`size-chip ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}>{s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add */}
          <div className="detail-add">
            <div className="qty-control">
              <button onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(v => Math.min(stock, v + 1))}>+</button>
            </div>
            <button className={`btn btn-primary btn-full ${added ? 'btn-success' : ''}`}
              onClick={handleAdd} disabled={stock === 0}>
              {stock === 0 ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
          {stock < 10 && stock > 0 && <p className="stock-warn">Only {stock} left!</p>}
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(r => (
              <div key={r._id} className="review-card card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
        {user && (
          <form className="review-form card" onSubmit={handleReview}>
            <h3>Write a Review</h3>
            {revMsg && <p className={`alert ${revMsg.includes('Error') ? 'alert-error' : 'alert-success'}`}>{revMsg}</p>}
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select className="form-select" value={review.rating}
                onChange={e => setReview({ ...review, rating: Number(e.target.value) })}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea className="form-textarea" rows={3} value={review.comment}
                onChange={e => setReview({ ...review, comment: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}
      </section>
    </div>
  );
}
