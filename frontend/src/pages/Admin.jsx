import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

/* ─── Constants ──────────────────────────────────────────── */
const CATEGORIES = ['tops','bottoms','dresses','outerwear','accessories','shoes'];
const GENDERS    = ['men','women','unisex'];
const ALL_SIZES  = ['XS','S','M','L','XL','XXL'];
const EMPTY_FORM = {
  name:'', description:'', price:'', salePrice:'', category:'tops',
  gender:'women', sizes:[], colors:[], images:[''], stock:'',
  brand:'', tags:'', featured: false,
};

/* ─── Sub-components ─────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [form,    setForm]    = useState(() => {
    if (!initial) return EMPTY_FORM;
    return {
      ...initial,
      price:     initial.price?.toString()     || '',
      salePrice: initial.salePrice?.toString() || '',
      stock:     initial.stock?.toString()     || '',
      tags:      (initial.tags || []).join(', '),
      images:    initial.images?.length ? [...initial.images] : [''],
    };
  });
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [newColor, setNewColor] = useState({ name:'', hex:'#000000' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSize = s => set('sizes', form.sizes.includes(s)
    ? form.sizes.filter(x => x !== s) : [...form.sizes, s]);

  const addColor = () => {
    if (!newColor.name.trim()) return;
    set('colors', [...form.colors, { ...newColor }]);
    setNewColor({ name:'', hex:'#000000' });
  };

  const setImg = (i, v) => { const a = [...form.images]; a[i] = v; set('images', a); };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        price:     Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock:     Number(form.stock),
        tags:      form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images:    form.images.filter(Boolean),
      };
      const { data } = isEdit
        ? await api.put(`/products/${initial._id}`, payload)
        : await api.post('/products', payload);
      onSaved(data, isEdit);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // live preview image
  const previewImg = form.images.find(Boolean) || null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <p className="alert alert-error">{error}</p>}

          <div className="modal-layout">
            {/* ── FORM ── */}
            <form id="product-form" onSubmit={handleSubmit} className="modal-form">

              {/* Basic */}
              <section className="mf-section">
                <h4>Basic Info</h4>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} required placeholder="e.g. Classic Linen Shirt"
                    onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" rows={3} value={form.description} required
                    onChange={e => set('description', e.target.value)} />
                </div>
                <div className="mf-row-2">
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input className="form-input" value={form.brand} placeholder="Essentials"
                      onChange={e => set('brand', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags</label>
                    <input className="form-input" value={form.tags} placeholder="shirt, casual"
                      onChange={e => set('tags', e.target.value)} />
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section className="mf-section">
                <h4>Pricing & Stock</h4>
                <div className="mf-row-3">
                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input className="form-input" type="number" min="0" step="0.01" required
                      value={form.price} onChange={e => set('price', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sale Price ($)</label>
                    <input className="form-input" type="number" min="0" step="0.01" placeholder="—"
                      value={form.salePrice} onChange={e => set('salePrice', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input className="form-input" type="number" min="0" required
                      value={form.stock} onChange={e => set('stock', e.target.value)} />
                  </div>
                </div>
              </section>

              {/* Classification */}
              <section className="mf-section">
                <h4>Classification</h4>
                <div className="mf-row-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                      {GENDERS.map(g => <option key={g} value={g}>{g[0].toUpperCase()+g.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Sizes</label>
                  <div className="size-btns">
                    {ALL_SIZES.map(s => (
                      <button type="button" key={s}
                        className={`size-chip ${form.sizes.includes(s) ? 'active' : ''}`}
                        onClick={() => toggleSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <label className="featured-toggle">
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                  <span>Mark as Featured</span>
                </label>
              </section>

              {/* Images */}
              <section className="mf-section">
                <h4>Images</h4>
                {form.images.map((img, i) => (
                  <div key={i} className="image-row">
                    <input className="form-input" value={img} placeholder="https://..."
                      onChange={e => setImg(i, e.target.value)} />
                    {img && <img src={img} alt="prev" className="img-preview" onError={e=>e.target.style.display='none'} />}
                    {form.images.length > 1 &&
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => set('images', form.images.filter((_,j)=>j!==i))}>×</button>}
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => set('images', [...form.images,''])}>+ Add URL</button>
              </section>

              {/* Colors */}
              <section className="mf-section">
                <h4>Colors</h4>
                {form.colors.length > 0 && (
                  <div className="color-list">
                    {form.colors.map((c, i) => (
                      <div key={i} className="color-tag">
                        <span className="color-dot" style={{background: c.hex}} />
                        <span>{c.name}</span>
                        <button type="button" onClick={() => set('colors', form.colors.filter((_,j)=>j!==i))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="color-adder">
                  <input className="form-input" placeholder="Color name" value={newColor.name}
                    onChange={e => setNewColor(c=>({...c, name:e.target.value}))}
                    onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addColor())} />
                  <input type="color" value={newColor.hex} className="color-picker"
                    onChange={e => setNewColor(c=>({...c, hex:e.target.value}))} />
                  <button type="button" className="btn btn-outline btn-sm" onClick={addColor}>Add</button>
                </div>
              </section>
            </form>

            {/* ── LIVE PREVIEW ── */}
            <div className="modal-preview">
              <h4>Live Preview</h4>
              <div className="preview-card">
                <div className="preview-img">
                  {previewImg
                    ? <img src={previewImg} alt="preview" onError={e=>e.target.style.display='none'} />
                    : <span className="preview-placeholder">No image</span>}
                  {form.salePrice && <span className="badge badge-sale preview-badge">Sale</span>}
                </div>
                <div className="preview-info">
                  <p className="preview-cat">{form.gender} · {form.category}</p>
                  <p className="preview-name">{form.name || 'Product name'}</p>
                  <div className="preview-price">
                    {form.salePrice
                      ? <><span className="price-sale">${form.salePrice}</span><span className="price-original">${form.price}</span></>
                      : <span>${form.price || '0'}</span>}
                  </div>
                  {form.colors.length > 0 && (
                    <div className="preview-colors">
                      {form.colors.map((c,i) => <span key={i} className="color-dot" style={{background:c.hex}} title={c.name} />)}
                    </div>
                  )}
                  {form.sizes.length > 0 && (
                    <div className="preview-sizes">{form.sizes.join(' · ')}</div>
                  )}
                  <p className="preview-stock">
                    {form.stock
                      ? Number(form.stock) < 5
                        ? <span style={{color:'var(--c-danger)'}}>Only {form.stock} left</span>
                        : `${form.stock} in stock`
                      : 'Stock: —'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="product-form" type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Inline stock editor ─────────────────────────────────── */
function StockCell({ productId, initial, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [val,     setVal]     = useState(initial);
  const [saving,  setSaving]  = useState(false);
  const ref = useRef();

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const save = async () => {
    if (Number(val) === initial) { setEditing(false); return; }
    setSaving(true);
    try {
      await api.put(`/products/${productId}`, { stock: Number(val) });
      onUpdate(Number(val));
    } catch { setVal(initial); }
    setSaving(false); setEditing(false);
  };

  if (editing) return (
    <div className="stock-edit">
      <input ref={ref} type="number" min="0" value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key==='Enter') save(); if (e.key==='Escape') { setVal(initial); setEditing(false); }}}
        className="stock-input" />
      <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving?'…':'✓'}</button>
    </div>
  );

  return (
    <button className={`stock-badge ${initial < 5 ? 'low' : initial < 20 ? 'med' : 'ok'}`}
      onClick={() => setEditing(true)} title="Click to edit stock">
      {initial} <span className="edit-hint">✎</span>
    </button>
  );
}

/* ─── Main Admin Page ────────────────────────────────────── */
export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();
  const [tab,      setTab]      = useState('products');
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);   // null | 'new' | product object
  const [confirm,  setConfirm]  = useState(null);  // null | product to delete
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState('');

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab==='products') { const {data} = await api.get('/products?limit=100&isActive=true'); setProducts(data.products); }
        if (tab==='orders')   { const {data} = await api.get('/orders');   setOrders(data.orders);   }
        if (tab==='users')    { const {data} = await api.get('/users');    setUsers(data);            }
      } catch(e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [tab]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  /* Product saved (create or update) */
  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setProducts(prev => prev.map(p => p._id === saved._id ? saved : p));
      showToast('✓ Product updated');
    } else {
      setProducts(prev => [saved, ...prev]);
      showToast('✓ Product created');
    }
    setModal(null);
  };

  /* Delete */
  const handleDeleteConfirm = async () => {
    const id = confirm._id;
    setConfirm(null);
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
    showToast('Product removed');
  };

  /* Duplicate */
  const handleDuplicate = async (product) => {
    const { _id, createdAt, updatedAt, __v, reviews, rating, numReviews, ...rest } = product;
    const payload = { ...rest, name: `${rest.name} (Copy)`, stock: 0, isActive: true };
    const { data } = await api.post('/products', payload);
    setProducts(prev => [data, ...prev]);
    showToast('Product duplicated');
  };

  /* Inline stock update */
  const handleStockUpdate = (id, newStock) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
  };

  /* Order status */
  const updateOrderStatus = async (id, status) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    setOrders(prev => prev.map(o => o._id === id ? data : o));
  };

  /* Filtered products */
  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  /* Stats */
  const totalStock    = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;
  const onSaleCount   = products.filter(p => p.salePrice).length;

  return (
    <div className="admin-page page-top container">
      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Modals */}
      {modal !== null && (
        <ProductModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {confirm && (
        <ConfirmDialog
          message={`Delete "${confirm.name}"? This can't be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your store in one place</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Stock</span>
          <span className="stat-value">{totalStock}</span>
        </div>
        <div className={`stat-card ${lowStockCount > 0 ? 'stat-warn' : ''}`}>
          <span className="stat-label">Low Stock (&lt;5)</span>
          <span className="stat-value">{lowStockCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">On Sale</span>
          <span className="stat-value">{onSaleCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Orders</span>
          <span className="stat-value">{orders.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['products','orders','users'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}
            {t==='products' && <span className="tab-count">{products.length}</span>}
            {t==='orders'   && <span className="tab-count">{orders.length}</span>}
          </button>
        ))}
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (<>

        {/* ── PRODUCTS TAB ── */}
        {tab==='products' && (
          <div>
            <div className="tab-toolbar">
              <input className="form-input toolbar-search" placeholder="Search products…"
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn btn-primary" onClick={() => setModal('new')}>
                + Add Product
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <p>No products found.</p>
                <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>Clear search</button>
              </div>
            ) : (
              <div className="admin-table card">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="product-cell">
                            <img src={p.images[0]} alt={p.name} className="admin-thumb" onError={e=>e.target.src='https://via.placeholder.com/44x54?text=?'} />
                            <div>
                              <p className="product-cell-name">{p.name}</p>
                              <p className="product-cell-brand">{p.brand || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-new">{p.category}</span>
                          <span className="gender-tag">{p.gender}</span>
                        </td>
                        <td>
                          {p.salePrice
                            ? <><span className="price-sale">${p.salePrice}</span> <span className="price-original">${p.price}</span></>
                            : <span>${p.price}</span>}
                        </td>
                        <td>
                          <StockCell productId={p._id} initial={p.stock}
                            onUpdate={v => handleStockUpdate(p._id, v)} />
                        </td>
                        <td>
                          {p.featured && <span className="badge badge-sale">Featured</span>}
                          {!p.featured && <span className="badge" style={{background:'var(--c-bg)',color:'var(--c-muted)'}}>Standard</span>}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn-outline btn-sm" onClick={() => setModal(p)} title="Edit">Edit</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => handleDuplicate(p)} title="Duplicate">⧉</button>
                            <button className="btn btn-ghost btn-sm danger" onClick={() => setConfirm(p)} title="Delete">✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab==='orders' && (
          <div>
            <div className="tab-toolbar">
              <span className="total-count">{orders.length} orders</span>
            </div>
            {orders.length === 0 ? <p className="empty-state">No orders yet.</p> : (
              <div className="admin-table card">
                <table>
                  <thead>
                    <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Update</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td><Link to={`/orders/${o._id}`} className="order-link">#{o._id.slice(-8).toUpperCase()}</Link></td>
                        <td>{o.user?.name || 'N/A'}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>${o.totalPrice.toFixed(2)}</td>
                        <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                        <td>
                          <select className="form-select status-select" value={o.status}
                            onChange={e => updateOrderStatus(o._id, e.target.value)}>
                            {['pending','processing','shipped','delivered','cancelled'].map(s =>
                              <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab==='users' && (
          <div>
            <div className="tab-toolbar"><span className="total-count">{users.length} users</span></div>
            <div className="admin-table card">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role==='admin'?'badge-sale':'badge-new'}`}>{u.role}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}
