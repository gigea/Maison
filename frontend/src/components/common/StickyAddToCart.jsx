import { useEffect, useState } from 'react';
import './StickyAddToCart.css';

export default function StickyAddToCart({ product, selectedSize, onAdd, triggerRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!triggerRef?.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [triggerRef]);

  if (!visible || !product) return null;

  return (
    <div className="sticky-atc">
      <div className="sticky-atc-inner container">
        <div className="sticky-atc-info">
          <img src={product.images?.[0]} alt={product.name} className="sticky-atc-img" />
          <div>
            <p className="sticky-atc-name">{product.name}</p>
            <p className="sticky-atc-price">
              {product.salePrice
                ? <><span className="price-sale">${product.salePrice}</span> <s>${product.price}</s></>
                : `$${product.price}`}
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onAdd} disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of Stock' : selectedSize ? 'Add to Cart' : 'Select Size'}
        </button>
      </div>
    </div>
  );
}
