import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ImageZoom        from '../components/common/ImageZoom';
import StickyAddToCart  from '../components/common/StickyAddToCart';
import SizeGuideModal   from '../components/common/SizeGuideModal';
import RelatedProducts  from '../components/common/RelatedProducts';
import RecentlyViewed   from '../components/common/RecentlyViewed';
import WishlistButton   from '../components/common/WishlistButton';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const { toggle, has } = useWishlist();
  const { add: addRecent } = useRecentlyViewed();

  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [selectedImg,   setSelectedImg]   = useState(0);
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty,           setQty]           = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [review,        setReview]        = useState({ rating: 5, comment: '' });
  const [revMsg,        setRevMsg]        = useState('');
  const [activeTab,     setActiveTab]     = useState('description');

  const addToCartRef = useRef(); // for sticky bar observer

  useEffect(() => {
    setLoading(true); setSelectedImg(0); setSelectedSize(''); setQty(1);
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data);
        if (r.data.colors?.length) setSelectedColor(r.data.colors[0].name);
        addRecent(r.data);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!selectedSize && product.sizes?.length) {
      toast.show('Please select a size', 'error'); return;
    }
    addItem(product, selectedSize, selectedColor, qty);
    toast.show(`${product.name} added to cart ✓`, 'success');
  };

  const handleReview = async (e) => {
    e.preventDefault(); setRevMsg('');
    try {
      await api.post(`/products/${id}/reviews`, review);
      setRevMsg('success');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      setRevMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="loading-center page-top"><div className="spinner" /></div>;
  if (error)   return <div className="page-top container"><p className="alert alert-error">{error}</p></div>;
  if (!product) return null;

  const { name, description, price, salePrice, images, category, gender, sizes, colors, brand, rating: avgRating, reviews, stock } = product;

  return (
    <div className="product-detail page-top">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> /
          <Link to="/products">Shop</Link> /
          <Link to={`/products?category=${category}`}>{category}</Link> /
          <span>{name}</span>
        </nav>

        <div className="detail-layout">
          {/* ── Gallery ── */}
          <div className="detail-gallery">
            <div className="gallery-main">
              <ImageZoom src={images[selectedImg] || 'https://via.placeholder.com/600x750'} alt={name} />
              {salePrice && <span className="badge badge-sale gallery-badge">Sale</span>}
              <WishlistButton product={product} className="gallery-wishlist" />
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`thumb ${selectedImg === i ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                    <img src={img} alt={`View ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="detail-info">
            <p className="detail-category">{gender} · {category}</p>
            <h1 className="detail-name">{name}</h1>
            {brand && <p className="detail-brand">by {brand}</p>}

            {/* Rating summary */}
            {reviews.length > 0 && (
              <a href="#reviews" className="detail-rating-link">
                <span className="stars-row">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}</span>
                <span>{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
              </a>
            )}

            <div className="detail-price">
              {salePrice
                ? <><span className="price-sale large">${salePrice}</span><span className="price-original">${price}</span><span className="badge badge-sale">Save ${price - salePrice}</span></>
                : <span className="large">${price}</span>}
            </div>

            {/* Color */}
            {colors?.length > 0 && (
              <div className="detail-option">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="color-swatches">
                  {colors.map(c => (
                    <button key={c.name} title={c.name}
                      className={`color-swatch ${selectedColor === c.name ? 'active' : ''}`}
                      style={{ background: c.hex }} onClick={() => setSelectedColor(c.name)} />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes?.length > 0 && (
              <div className="detail-option">
                <div className="size-label-row">
                  <label>Size {!selectedSize && <span className="req">*</span>}</label>
                  <button className="size-guide-link" onClick={() => setSizeGuideOpen(true)}>Size Guide ↗</button>
                </div>
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

            {/* Qty + Add — this is the ref the sticky bar watches */}
            <div className="detail-add" ref={addToCartRef}>
              <div className="qty-control">
                <button onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(v => Math.min(stock, v + 1))}>+</button>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAdd} disabled={stock === 0}>
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {stock < 10 && stock > 0 && (
              <p className="stock-warn">🔥 Only {stock} left in stock!</p>
            )}

            {/* Trust badges */}
            <div className="trust-badges">
              <span>🚚 Free shipping over $100</span>
              <span>↩️ 30-day returns</span>
              <span>🔒 Secure checkout</span>
            </div>

            {/* Tabs: Description / Shipping / Returns */}
            <div className="detail-tabs">
              {['description','shipping','returns'].map(tab => (
                <button key={tab} className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase()+tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="detail-tab-content">
              {activeTab === 'description' && <p>{description}</p>}
              {activeTab === 'shipping' && (
                <ul className="tab-list">
                  <li>Standard shipping: 5–7 business days (free over $100)</li>
                  <li>Express shipping: 2–3 business days ($14.99)</li>
                  <li>Overnight shipping: next business day ($29.99)</li>
                </ul>
              )}
              {activeTab === 'returns' && (
                <ul className="tab-list">
                  <li>Free returns within 30 days of delivery</li>
                  <li>Items must be unworn and in original packaging</li>
                  <li>Start your return from the Orders page</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="reviews-section" id="reviews">
          <h2>Customer Reviews
            {reviews.length > 0 && (
              <span className="reviews-summary">
                <span className="stars-row small">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}</span>
                {avgRating.toFixed(1)} out of 5 · {reviews.length} reviews
              </span>
            )}
          </h2>

          {reviews.length === 0
            ? <p className="no-reviews">No reviews yet — be the first!</p>
            : (
              <div className="reviews-list">
                {reviews.map(r => (
                  <div key={r._id} className="review-card card">
                    <div className="review-header">
                      <div className="review-avatar">{r.name[0].toUpperCase()}</div>
                      <div>
                        <strong>{r.name}</strong>
                        <p className="review-date">{new Date(r.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
                      </div>
                      <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                    </div>
                    <p className="review-body">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

          {user ? (
            <form className="review-form card" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              {revMsg === 'success'
                ? <p className="alert alert-success">Thanks for your review!</p>
                : revMsg && <p className="alert alert-error">{revMsg}</p>}
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-picker">
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n}
                      className={`star-pick ${n <= review.rating ? 'on' : ''}`}
                      onClick={() => setReview(r => ({...r, rating: n}))}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-textarea" rows={3} value={review.comment}
                  onChange={e => setReview(r => ({...r, comment: e.target.value}))} required />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          ) : (
            <p className="review-login">
              <Link to={`/login?redirect=/products/${id}`}>Login</Link> to write a review
            </p>
          )}
        </section>

        <RelatedProducts category={category} excludeId={id} />
        <RecentlyViewed excludeId={id} />
      </div>

      {/* Sticky bar */}
      <StickyAddToCart product={product} selectedSize={selectedSize} onAdd={handleAdd} triggerRef={addToCartRef} />

      {/* Size guide modal */}
      {sizeGuideOpen && <SizeGuideModal category={category} onClose={() => setSizeGuideOpen(false)} />}
    </div>
  );
}
