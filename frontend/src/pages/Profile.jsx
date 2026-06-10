import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', avatar: '', password: '',
    street: '', city: '', state: '', zip: '', country: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile');
      return;
    }
    const [address = {}] = user.addresses || [];
    setForm({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
      password: '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || '',
    });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const updates = {
        name: form.name,
        email: form.email,
        avatar: form.avatar,
      };

      if (form.password) updates.password = form.password;
      if (form.street || form.city || form.state || form.zip || form.country) {
        updates.addresses = [{
          label: 'Home',
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          isDefault: true,
        }];
      }

      const { data } = await api.put('/auth/profile', updates);
      updateAuth(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      setMessage('Your profile has been updated.');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page page-top container">
      <div className="profile-card card">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Update your account information and shipping address.</p>
        </div>

        {message && <p className="alert alert-success">{message}</p>}
        {error && <p className="alert alert-error">{error}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input className="form-input" type="text" value={form.avatar}
                onChange={e => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Leave blank to keep current password" minLength={6} />
            </div>
          </div>

          <div className="profile-section">
            <h2>Shipping Address</h2>
            <div className="profile-grid">
              <div className="form-group">
                <label className="form-label">Street</label>
                <input className="form-input" type="text" value={form.street}
                  onChange={e => setForm({ ...form, street: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" type="text" value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" type="text" value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input className="form-input" type="text" value={form.zip}
                  onChange={e => setForm({ ...form, zip: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" type="text" value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
