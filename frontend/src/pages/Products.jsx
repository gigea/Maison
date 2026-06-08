import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import ProductFilters from '../components/common/ProductFilters';
import './Products.css';

const SORT_OPTIONS = [
  { label: 'Newest',         value: 'createdAt-desc' },
  { label: 'Price: Low-High',value: 'price-asc' },
  { label: 'Price: High-Low',value: 'price-desc' },
  { label: 'Top Rated',      value: 'rating-desc' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getFilters = () => ({
    category: searchParams.get('category') || '',
    gender:   searchParams.get('gender')   || '',
    size:     searchParams.get('size')     || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    keyword:  searchParams.get('keyword')  || '',
    sortBy:   searchParams.get('sortBy')   || 'createdAt',
    order:    searchParams.get('order')    || 'desc',
    page:     searchParams.get('page')     || '1',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const f = getFilters();
      const params = Object.fromEntries(Object.entries(f).filter(([_, v]) => v));
      const { data } = await api.get('/products', { params });
      setProducts(data.products); setTotal(data.total); setPages(data.pages);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleFilterChange = (newFilters) => {
    const next = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) next.set(k, v); });
    setSearchParams(next);
  };

  const handleReset = () => setSearchParams({});

  const filters = getFilters();
  const [sortVal, setSortVal] = useState(`${filters.sortBy}-${filters.order}`);

  const handleSort = (val) => {
    setSortVal(val);
    const [sortBy, order] = val.split('-');
    const next = new URLSearchParams(searchParams);
    next.set('sortBy', sortBy); next.set('order', order); next.delete('page');
    setSearchParams(next);
  };

  const currentPage = Number(filters.page);

  return (
    <div className="products-page page-top container">
      {/* Top Bar */}
      <div className="products-topbar">
        <div className="products-search">
          <input className="form-input" placeholder="Search products…"
            defaultValue={filters.keyword}
            onKeyDown={e => e.key === 'Enter' && updateParam('keyword', e.target.value)} />
        </div>
        <div className="products-controls">
          <span className="total-count">{total} items</span>
          <select className="form-select" value={sortVal} onChange={e => handleSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-outline btn-sm hide-desktop" onClick={() => setShowFilters(v => !v)}>
            Filters {showFilters ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="products-layout">
        {/* Filters */}
        <div className={`filters-col ${showFilters ? 'show' : ''}`}>
          <ProductFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </div>

        {/* Grid */}
        <div className="products-main">
          {error && <p className="alert alert-error">{error}</p>}
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found.</p>
              <button className="btn btn-outline btn-sm" onClick={handleReset}>Clear filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p}
                      className={`page-btn ${p === currentPage ? 'active' : ''}`}
                      onClick={() => updateParam('page', p)}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
