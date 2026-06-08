import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AdminProductForm.css';

const EMPTY = {
  name: '', description: '', price: '', salePrice: '',
  category: 'tops', gender: 'women',
  sizes: [], colors: [], images: [''], stock: '', brand: '', tags: '', featured: false,
};

const CATEGORIES = ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes'];
const GENDERS    = ['men', 'women', 'unisex'];
const ALL_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AdminProductForm() {
  const { id }      = useParams();
  const isEdit      = id && id !== 'new';
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();
  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });

  useEffect(() => {
    if (!isAdmin) navigate('/');
    if (!isEdit) return;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => {
        const p = r.data;
        setForm({
          ...p,
          price:    p.price?.toString()    || '',
          salePrice: p.salePrice?.toString() || '',
          stock:    p.stock?.toString()    || '',
          tags:     (p.tags || []).join(', '),
          images:   p.images?.length ? p.images : [''],
        });
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id, isEdit, isAdmin, navigate]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleSize = (s) => set('sizes', form.sizes.includes(s)
    ? form.sizes.filter(x => x !== s)
    : [...form.sizes, s]);

  const addColor = () => {
    if (!newColor.name) return;
    set('colors', [...form.colors, { ...newColor }]);
    setNewColor({ name: '', hex: '#000000' });
  };
  const removeColor = (i) => set('colors', form.colors.filter((_, idx) => idx !== i));

  const setImage = (i, val) => {
    const imgs = [...form.images]; imgs[i] = val; set('images', imgs);
  };
  const addImage    = () => set('images', [...form.images, '']);
  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = {
        ...form,
        price:     Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock:     Number(form.stock),
        tags:      form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images:    form.images.filter(Boolean),
      };
      if (isEdit) await api.put(`/products/${id}`, payload);
      else        await api.post('/products', payload);
      setSuccess(isEdit ? 'Product updated!' : 'Product created!');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-center page-top"><div className="spinner" /></div>;

  return (
    <div className="apf-page page-top container">
      <div className="apf-header">
        <Link to="/admin" className="od-back">← Admin Dashboard</Link>
        <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      {error   && <p className="alert alert-error">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}

      <form onSubmit={handleSubmit} className="apf-form">
        <div className="apf-grid">
          {/* LEFT COLUMN */}
          <div className="apf-col">
            <div className="card apf-card">
              <h3>Basic Info</h3>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name}
                  onChange={e => set('name', e.target.value)} required placeholder="e.g. Classic Linen Shirt" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" rows={4} value={form.description}
                  onChange={e => set('description', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" value={form.brand}
                  onChange={e => set('brand', e.target.value)} placeholder="e.g. Essentials" />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={form.tags}
                  onChange={e => set('tags', e.target.value)} placeholder="shirt, casual, summer" />
              </div>
            </div>

            <div className="card apf-card">
              <h3>Pricing & Stock</h3>
              <div className="apf-row-3">
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input className="form-input" type="number" min="0" step="0.01"
                    value={form.price} onChange={e => set('price', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sale Price ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01"
                    value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="optional" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" min="0"
                    value={form.stock} onChange={e => set('stock', e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="card apf-card">
              <h3>Classification</h3>
              <div className="apf-row-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                    {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Sizes</label>
                <div className="size-btns">
                  {ALL_SIZES.map(s => (
                    <button type="button" key={s}
                      className={`size-chip ${form.sizes.includes(s) ? 'active' : ''}`}
                      onClick={() => toggleSize(s)}>{s}
                    </button>
                  ))}
                </div>
              </div>
              <label className="featured-toggle">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                <span>Mark as Featured</span>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="apf-col">
            <div className="card apf-card">
              <h3>Product Images</h3>
              <p className="apf-hint">Enter image URLs. First image is the primary display.</p>
              {form.images.map((img, i) => (
                <div key={i} className="image-row">
                  <input className="form-input" value={img} placeholder="https://..."
                    onChange={e => setImage(i, e.target.value)} />
                  {img && <img src={img} alt="preview" className="img-preview" onError={e => e.target.style.display='none'} />}
                  {form.images.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeImage(i)}>×</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addImage}>+ Add Image URL</button>
            </div>

            <div className="card apf-card">
              <h3>Colors</h3>
              {form.colors.length > 0 && (
                <div className="color-list">
                  {form.colors.map((c, i) => (
                    <div key={i} className="color-tag">
                      <span className="color-dot" style={{ background: c.hex }} />
                      <span>{c.name}</span>
                      <button type="button" onClick={() => removeColor(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="color-adder">
                <input className="form-input" placeholder="Color name" value={newColor.name}
                  onChange={e => setNewColor(c => ({ ...c, name: e.target.value }))} />
                <input type="color" value={newColor.hex}
                  onChange={e => setNewColor(c => ({ ...c, hex: e.target.value }))}
                  className="color-picker" title="Pick color" />
                <button type="button" className="btn btn-outline btn-sm" onClick={addColor}>Add</button>
              </div>
            </div>

            <div className="apf-actions">
              <Link to="/admin" className="btn btn-outline">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
