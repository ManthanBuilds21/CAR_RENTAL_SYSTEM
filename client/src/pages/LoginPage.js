// ============================================================
//  LoginPage.js
//  Path: client/src/pages/LoginPage.js
//  Replace your existing LoginPage.js entirely
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%',
  background: '#f7f7f5',
  border: '1px solid #ebebea',
  borderRadius: 8,
  padding: '.9rem 1rem',
  fontSize: '.9rem',
  color: '#171715',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color .25s, background .25s',
};

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DriveWay account"
      footer={<>Don't have an account? <Link to="/register" style={{ color: '#171715', fontWeight: 500 }}>Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '.75rem 1rem', fontSize: '.84rem', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <FormGroup label="Email Address">
          <input
            type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; }}
          />
        </FormGroup>

        <FormGroup label="Password">
          <input
            type="password" required value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; }}
          />
        </FormGroup>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '.95rem',
            background: loading ? '#d9d9d7' : '#171715',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: '.88rem', fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background .25s, transform .2s',
            marginTop: '.5rem',
          }}
          onMouseEnter={e => !loading && (e.target.style.background = '#3a3a38')}
          onMouseLeave={e => !loading && (e.target.style.background = '#171715')}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        {/* Demo Credentials */}
        <div style={{ background: '#f7f7f5', border: '1px solid #ebebea', borderRadius: 8, padding: '1rem', fontSize: '.8rem', color: '#6b6b69' }}>
          <strong style={{ color: '#3a3a38', display: 'block', marginBottom: '.4rem' }}>Demo accounts</strong>
          Admin: admin@carrental.com / admin123<br/>
          User: john@example.com / user1234
        </div>
      </form>
    </AuthLayout>
  );
};

// ============================================================
//  RegisterPage.js
//  Path: client/src/pages/RegisterPage.js  (same file or separate)
// ============================================================

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your DriveWay journey today"
      footer={<>Already have an account? <Link to="/login" style={{ color: '#171715', fontWeight: 500 }}>Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '.75rem 1rem', fontSize: '.84rem', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <FormGroup label="Full Name">
          <input type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your full name" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; }}
          />
        </FormGroup>

        <FormGroup label="Email Address">
          <input type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; }}
          />
        </FormGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormGroup label="Password">
            <input type="password" required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; }}
            />
          </FormGroup>
          <FormGroup label="Confirm">
            <input type="password" required value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              placeholder="••••••••" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; }}
            />
          </FormGroup>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '.95rem',
            background: loading ? '#d9d9d7' : '#171715',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: '.88rem', fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background .25s',
            marginTop: '.25rem',
          }}
          onMouseEnter={e => !loading && (e.target.style.background = '#3a3a38')}
          onMouseLeave={e => !loading && (e.target.style.background = '#171715')}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

/* ── Shared Auth Layout ── */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    background: '#f7f7f5',
    paddingTop: 80,
  }}>
    {/* Left panel - desktop only */}
    <div style={{
      flex: 1,
      background: '#171715',
      backgroundImage: "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&auto=format&fit=crop&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '3rem',
      position: 'relative',
    }} className="auth-left">
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,23,21,.7)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 500, color: '#fff', lineHeight: 1.3, letterSpacing: '-.02em' }}>
          "The most seamless car rental experience I've ever had."
        </p>
        <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginTop: '.75rem' }}>— Arjun S., Mumbai</p>
      </div>
    </div>

    {/* Right panel - form */}
    <div style={{
      width: '100%',
      maxWidth: 480,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '3rem 2.5rem',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#171715', letterSpacing: '-.02em', display: 'block', marginBottom: '2.5rem' }}>
          Drive<span style={{ fontWeight: 300 }}>Way</span>
        </Link>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 500, letterSpacing: '-.02em', marginBottom: '.4rem' }}>{title}</h1>
        <p style={{ fontSize: '.88rem', color: '#6b6b69' }}>{subtitle}</p>
      </div>
      {children}
      <p style={{ textAlign: 'center', fontSize: '.82rem', color: '#a0a09e', marginTop: '1.5rem' }}>{footer}</p>
    </div>

    <style>{`
      @media(max-width:768px){ .auth-left{ display:none !important; } }
    `}</style>
  </div>
);

const FormGroup = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
    <label style={{ fontSize: '.75rem', fontWeight: 500, color: '#6b6b69', letterSpacing: '.06em' }}>{label}</label>
    {children}
  </div>
);

export default LoginPage;