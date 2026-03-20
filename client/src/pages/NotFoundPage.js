// ============================================================
//  NotFoundPage.js
//  Path: client/src/pages/NotFoundPage.js
//  Replace your existing NotFoundPage.js entirely
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{
    minHeight: '100vh',
    background: '#f7f7f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    paddingTop: 80,
  }}>
    <div style={{ textAlign: 'center', animation: 'fadeUp .7s ease both' }}>

      {/* Big 404 */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(120px, 22vw, 200px)',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-.04em',
          color: '#ebebea',
          userSelect: 'none',
        }}>
          404
        </div>
        {/* Car icon overlaid */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 72, height: 72,
            background: '#fff',
            border: '1px solid #ebebea',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,.07)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#171715" strokeWidth="1.5">
              <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      <h1 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: 500,
        letterSpacing: '-.02em',
        color: '#171715',
        marginBottom: '.75rem',
      }}>
        Road Not Found
      </h1>
      <p style={{
        fontSize: '.95rem',
        color: '#a0a09e',
        lineHeight: 1.8,
        maxWidth: 360,
        margin: '0 auto 2.5rem',
      }}>
        Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '.6rem',
          background: '#171715', color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.85rem', fontWeight: 500,
          padding: '.85rem 1.75rem',
          borderRadius: 8, textDecoration: 'none',
          transition: 'background .25s, transform .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3a3a38'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#171715'; e.currentTarget.style.transform = 'none'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          Back to Home
        </Link>

        <Link to="/cars" style={{
          display: 'inline-flex', alignItems: 'center', gap: '.6rem',
          background: '#fff', color: '#171715',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '.85rem', fontWeight: 500,
          padding: '.85rem 1.75rem',
          borderRadius: 8, textDecoration: 'none',
          border: '1px solid #ebebea',
          transition: 'border-color .25s, transform .2s, background .25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#171715'; e.currentTarget.style.background = '#f7f7f5'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebea'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
          </svg>
          Browse Cars
        </Link>
      </div>
    </div>

    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: none; }
      }
    `}</style>
  </div>
);

export default NotFoundPage;