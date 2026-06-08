import './ProductFilters.css';

const CATEGORIES = ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes'];
const GENDERS    = ['men', 'women', 'unisex'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductFilters({ filters, onChange, onReset }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button className="btn btn-ghost btn-sm" onClick={onReset}>Clear all</button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        {CATEGORIES.map(c => (
          <label key={c} className="filter-option">
            <input type="radio" name="category" value={c}
              checked={filters.category === c} onChange={() => set('category', c)} />
            <span>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
          </label>
        ))}
        {filters.category && (
          <button className="btn btn-ghost btn-sm" onClick={() => set('category', '')}>× Clear</button>
        )}
      </div>

      <div className="filter-section">
        <h4>Gender</h4>
        {GENDERS.map(g => (
          <label key={g} className="filter-option">
            <input type="radio" name="gender" value={g}
              checked={filters.gender === g} onChange={() => set('gender', g)} />
            <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
          </label>
        ))}
        {filters.gender && (
          <button className="btn btn-ghost btn-sm" onClick={() => set('gender', '')}>× Clear</button>
        )}
      </div>

      <div className="filter-section">
        <h4>Size</h4>
        <div className="size-grid">
          {SIZES.map(s => (
            <button key={s}
              className={`size-chip ${filters.size === s ? 'active' : ''}`}
              onClick={() => set('size', filters.size === s ? '' : s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input className="form-input" type="number" placeholder="Min $"
            value={filters.minPrice || ''} onChange={e => set('minPrice', e.target.value)} />
          <span>—</span>
          <input className="form-input" type="number" placeholder="Max $"
            value={filters.maxPrice || ''} onChange={e => set('maxPrice', e.target.value)} />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-option">
          <input type="checkbox" checked={filters.featured === 'true'}
            onChange={e => set('featured', e.target.checked ? 'true' : '')} />
          <span>Featured only</span>
        </label>
      </div>
    </aside>
  );
}
