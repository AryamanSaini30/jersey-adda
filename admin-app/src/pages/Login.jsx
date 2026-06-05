import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAdminPassword } from '../api/admin';

export default function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyAdminPassword(password);
      onLoginSuccess(password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Invalid admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page admin-page">
      <section className="hero hero--compact admin-hero">
        <p className="eyebrow">Admin</p>
        <h1>Admin Login</h1>
        <p className="lede">Please enter the admin password to access the dashboard.</p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem', maxWidth: '400px', display: 'grid', gap: '20px' }}>
          <label className="search-box">
            <span>Admin password</span>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password" 
                autoFocus
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--text-muted, #6b7280)'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.24 10.24 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.88 2.87-5.15 5.2-6.54" />
                    <path d="M1 1l22 22" />
                    <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24" />
                    <path d="M14.12 14.12A3 3 0 0 0 9.88 9.88" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.1 12s3.6-7 9.9-7 9.9 7 9.9 7-3.6 7-9.9 7-9.9-7-9.9-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {error && <p className="state state--error" style={{ marginTop: '1rem' }}>{error}</p>}

          <div className="admin-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="action-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
