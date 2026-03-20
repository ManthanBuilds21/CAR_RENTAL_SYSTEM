// ============================================================
//  RegisterPage.js
//  Path: client/src/pages/RegisterPage.js
//  Replace your existing RegisterPage.js entirely
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/helpers';

const inp = {
  width: '100%',
  background: '#f7f7f5',
  border: '1px solid #ebebea',
  borderRadius: 8,
  padding: '.85rem 1rem',
  fontSize: '.88rem',
  color: '#171715',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color .25s, background .25s',
};
const onFocus = e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; };
const onBlur  = e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; };

const passwordStrength = pwd => {
  if (!pwd)          return { label: '',          color: '#ebebea',  pct: 0   };
  if (pwd.length < 6)return { label: 'Too short', color: '#ef4444',  pct: 15  };
  if (pwd.length < 8)return { label: 'Weak',      color: '#f97316',  pct: 35  };
  if (!/[0-9]/.test(pwd) || !/[a-z]/.test(pwd))
                     return { label: 'Fair',      color: '#eab308',  pct: 60  };
  if (!/[A-Z]/.test(pwd))
                     return { label: 'Good',      color: '#3b82f6',  pct: 80  };
  return               { label: 'Strong',    color: '#16a34a',  pct: 100 };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm]     = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed]   = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = passwordStrength(form.password);
  const pwdMatch = !form.confirmPassword || form.password === form.confirmPassword;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all required fields'); return; }
    if (form.password.length < 6)                    { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword)       { toast.error('Passwords do not match'); return; }
    if (!agreed)                                      { toast.error('Please agree to the Terms of Service'); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to DriveWay.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f7f7f5', display:'flex', paddingTop:72 }}>

      {/* ── Left Panel (desktop only) ── */}
      <div style={{
        flex:1, position:'relative', overflow:'hidden',
        backgroundImage:"url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1000&auto=format&fit=crop&q=80')",
        backgroundSize:'cover', backgroundPosition:'center',
        display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'3rem',
      }} className="register-left">
        <div style={{ position:'absolute', inset:0, background:'rgba(23,23,21,.65)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          {/* Promo badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'.5rem',
            background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)',
            backdropFilter:'blur(8px)',
            borderRadius:20, padding:'.45rem 1rem',
            marginBottom:'1.5rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            <span style={{ fontSize:'.78rem', color:'#fff', fontWeight:500 }}>₹500 off your first booking</span>
          </div>
          <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.5rem', fontWeight:400, color:'#fff', lineHeight:1.35, letterSpacing:'-.01em', marginBottom:'.75rem' }}>
            "I booked a car in under 2 minutes.<br/>Absolute game changer."
          </p>
          <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.4)' }}>— Priya N., Pune</p>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div style={{
        width:'100%', maxWidth:480,
        background:'#fff',
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'2.5rem 2.5rem',
        overflowY:'auto',
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.25rem', fontWeight:600, color:'#171715', letterSpacing:'-.02em', textDecoration:'none', display:'block', marginBottom:'2rem' }}>
          Drive<span style={{ fontWeight:300 }}>Way</span>
        </Link>

        <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.6rem', fontWeight:500, letterSpacing:'-.02em', color:'#171715', marginBottom:'.3rem' }}>
          Create account
        </h1>
        <p style={{ fontSize:'.86rem', color:'#a0a09e', marginBottom:'2rem' }}>
          Join thousands of DriveWay customers today
        </p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>

          {/* Full Name */}
          <Field label="Full Name *">
            <input name="name" type="text" autoComplete="name"
              value={form.name} onChange={handleChange}
              placeholder="Your full name" required
              style={inp} onFocus={onFocus} onBlur={onBlur}
            />
          </Field>

          {/* Email */}
          <Field label="Email Address *">
            <input name="email" type="email" autoComplete="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com" required
              style={inp} onFocus={onFocus} onBlur={onBlur}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number">
            <input name="phone" type="tel"
              value={form.phone} onChange={handleChange}
              placeholder="+91 98765 43210"
              style={inp} onFocus={onFocus} onBlur={onBlur}
            />
          </Field>

          {/* Password */}
          <Field label="Password *">
            <div style={{ position:'relative' }}>
              <input name="password" type={showPwd ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" required
                style={{ ...inp, paddingRight:'2.8rem' }}
                onFocus={onFocus} onBlur={onBlur}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position:'absolute', right:'.85rem', top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:'#a0a09e',
                display:'flex', alignItems:'center', padding:0,
                transition:'color .2s',
              }}
                onMouseEnter={e=>e.currentTarget.style.color='#171715'}
                onMouseLeave={e=>e.currentTarget.style.color='#a0a09e'}
              >
                {showPwd
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div style={{ marginTop:'.5rem' }}>
                <div style={{ height:3, background:'#ebebea', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${strength.pct}%`, background:strength.color, borderRadius:2, transition:'width .35s, background .35s' }} />
                </div>
                <p style={{ fontSize:'.72rem', color:strength.color, marginTop:'.3rem', fontWeight:500 }}>{strength.label}</p>
              </div>
            )}
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password *">
            <input name="confirmPassword" type={showPwd ? 'text' : 'password'}
              value={form.confirmPassword} onChange={handleChange}
              placeholder="Repeat your password" required
              style={{ ...inp, borderColor: form.confirmPassword && !pwdMatch ? '#ef4444' : '#ebebea' }}
              onFocus={e => { e.target.style.borderColor = !pwdMatch ? '#ef4444' : '#171715'; e.target.style.background='#fff'; }}
              onBlur={e  => { e.target.style.borderColor = !pwdMatch ? '#ef4444' : '#ebebea'; e.target.style.background='#f7f7f5'; }}
            />
            {form.confirmPassword && !pwdMatch && (
              <p style={{ fontSize:'.74rem', color:'#ef4444', marginTop:'.3rem' }}>Passwords do not match</p>
            )}
          </Field>

          {/* Terms */}
          <label style={{ display:'flex', alignItems:'flex-start', gap:'.75rem', cursor:'pointer' }}>
            <div style={{ position:'relative', flexShrink:0, marginTop:2 }}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
                style={{ width:16, height:16, accentColor:'#171715', cursor:'pointer' }}
              />
            </div>
            <span style={{ fontSize:'.78rem', color:'#6b6b69', lineHeight:1.7 }}>
              I agree to the{' '}
              <a href="#!" style={{ color:'#171715', fontWeight:500, textDecoration:'underline' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#!" style={{ color:'#171715', fontWeight:500, textDecoration:'underline' }}>Privacy Policy</a>
            </span>
          </label>

          {/* Submit */}
          <button type="submit"
            disabled={loading || (!!form.confirmPassword && !pwdMatch)}
            style={{
              width:'100%', padding:'1rem',
              background: loading || (!!form.confirmPassword && !pwdMatch) ? '#d9d9d7' : '#171715',
              color:'#fff', border:'none', borderRadius:8,
              fontFamily:"'DM Sans',sans-serif", fontSize:'.9rem', fontWeight:500,
              cursor: loading || (!!form.confirmPassword && !pwdMatch) ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'.6rem',
              transition:'background .25s, transform .2s',
              marginTop:'.25rem',
            }}
            onMouseEnter={e => { if (!loading && pwdMatch) e.currentTarget.style.background='#3a3a38'; }}
            onMouseLeave={e => { if (!loading && pwdMatch) e.currentTarget.style.background='#171715'; }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation:'spin .7s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Creating account…
              </>
            ) : (
              <>
                Create Free Account
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:'.82rem', color:'#a0a09e', marginTop:'1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#171715', fontWeight:500, textDecoration:'none', borderBottom:'1px solid #171715' }}>
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:768px) { .register-left { display: none !important; } }
      `}</style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
    <label style={{ fontSize:'.74rem', fontWeight:500, color:'#6b6b69', letterSpacing:'.06em' }}>{label}</label>
    {children}
  </div>
);

export default RegisterPage;