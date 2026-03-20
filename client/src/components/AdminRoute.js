// ============================================================
//  AdminRoute.js
//  Path: client/src/components/AdminRoute.js
//  Replace your existing AdminRoute.js entirely
// ============================================================

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loader';

const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f7f7f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        paddingTop: 80,
      }}>
        <div style={{ textAlign: 'center', animation: 'fadeUp .6s ease both' }}>

          {/* Icon */}
          <div style={{
            width: 72, height: 72,
            background: '#fff',
            border: '1px solid #ebebea',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,.06)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d9d9d7" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.5rem', fontWeight: 500,
            letterSpacing: '-.02em', color: '#171715',
            marginBottom: '.5rem',
          }}>
            Access Denied
          </h1>
          <p style={{
            fontSize: '.88rem', color: '#a0a09e',
            lineHeight: 1.8, maxWidth: 320,
            margin: '0 auto 2rem',
          }}>
            You don't have permission to view this page. This area is restricted to administrators only.
          </p>

          <a href="/" style={{
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
          </a>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;