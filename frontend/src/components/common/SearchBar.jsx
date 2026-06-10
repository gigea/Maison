import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './SearchBar.css';

export default function SearchBar({ onClose }) {
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const navigate  = useNavigate();
  const inputRef  = useRef();
  const timerRef  = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?keyword=${encodeURIComponent(query)}&limit=6`);
        setResults(data.products || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const go = (path) => { navigate(path); onClose(); };

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && query.trim())
      go(`/products?keyword=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={e => e.stopPropagation()}>
        <div className="search-input-row">
          <svg className="search-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search for products, brands…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          {query && <button className="search-clear" onClick={() => setQuery('')}>✕</button>}
          <button className="search-close-btn" onClick={onClose}>Cancel</button>
        </div>

        {query.trim() && (
          <div className="search-results">
            {loading ? (
              <div className="search-loading"><div className="spinner" style={{width:24,height:24,borderWidth:2}}/></div>
            ) : results.length === 0 ? (
              <p className="search-none">No results for "<strong>{query}</strong>"</p>
            ) : (
              <>
                {results.map(p => (
                  <button key={p._id} className="search-result-item" onClick={() => go(`/products/${p._id}`)}>
                    <img src={p.images[0]} alt={p.name} className="search-result-img"
                      onError={e => e.target.src='https://via.placeholder.com/48x60?text=?'} />
                    <div className="search-result-info">
                      <p className="search-result-name">{p.name}</p>
                      <p className="search-result-cat">{p.category} · {p.gender}</p>
                    </div>
                    <span className="search-result-price">
                      {p.salePrice ? <><s>${p.price}</s> ${p.salePrice}</> : `$${p.price}`}
                    </span>
                  </button>
                ))}
                <button className="search-see-all" onClick={() => go(`/products?keyword=${encodeURIComponent(query)}`)}>
                  See all results for "{query}" →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
