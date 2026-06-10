import { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProductCard from './ProductCard';
import './RelatedProducts.css';

export default function RelatedProducts({ category, excludeId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;
    api.get(`/products?category=${category}&limit=4`)
      .then(r => setProducts((r.data.products || []).filter(p => p._id !== excludeId)))
      .catch(() => {});
  }, [category, excludeId]);

  if (!products.length) return null;

  return (
    <section className="related-products">
      <h2>You May Also Like</h2>
      <div className="related-grid">
        {products.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
