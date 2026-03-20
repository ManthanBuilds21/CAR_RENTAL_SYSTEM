// ============================================================
//  Modal.js
//  Path: client/src/components/Modal.js
//  Replace your existing Modal.js entirely
// ============================================================

import React, { useEffect } from 'react';

const sizes = {
  sm: 440,
  md: 640,
  lg: 900,
  xl: 1100,
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: sizes[size] || sizes.md,
        background: '#fff',
        border: '1px solid #ebebea',
        borderRadius: 16,
        boxShadow: '0 24px 80px rgba(0,0,0,.14)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '92vh',
        animation: 'modalFadeUp .28s cubic-bezier(.4,0,.2,1) forwards',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.4rem 1.75rem',
          borderBottom: '1px solid #ebebea',
          flexShrink: 0,
          background: '#fff',
        }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 500,
            letterSpacing: '-.02em',
            color: '#171715',
            margin: 0,
          }}>
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              border: '1px solid #ebebea',
              background: 'transparent',
              color: '#a0a09e',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background .2s, color .2s, border-color .2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f7f7f5';
              e.currentTarget.style.color = '#171715';
              e.currentTarget.style.borderColor = '#d9d9d7';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#a0a09e';
              e.currentTarget.style.borderColor = '#ebebea';
            }}
            aria-label="Close modal"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.75rem',
          background: '#fff',
        }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>
    </div>
  );
};

export default Modal;