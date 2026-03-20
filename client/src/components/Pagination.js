// ============================================================
//  Pagination.js
//  Path: client/src/components/Pagination.js
//  Replace your existing Pagination.js entirely
// ============================================================

import React from 'react';

const btnBase = {
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ebebea',
  borderRadius: 8,
  background: '#fff',
  fontSize: '.84rem',
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  color: '#6b6b69',
  cursor: 'pointer',
  transition: 'all .2s',
  flexShrink: 0,
};

const PageBtn = ({ onClick, disabled, active, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      ...btnBase,
      background: active ? '#171715' : '#fff',
      color: active ? '#fff' : disabled ? '#d9d9d7' : '#6b6b69',
      borderColor: active ? '#171715' : '#ebebea',
      fontWeight: active ? 500 : 400,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
    }}
    onMouseEnter={e => {
      if (disabled || active) return;
      e.currentTarget.style.borderColor = '#171715';
      e.currentTarget.style.color = '#171715';
      e.currentTarget.style.background = '#f7f7f5';
    }}
    onMouseLeave={e => {
      if (disabled || active) return;
      e.currentTarget.style.borderColor = '#ebebea';
      e.currentTarget.style.color = '#6b6b69';
      e.currentTarget.style.background = '#fff';
    }}
  >
    {children}
  </button>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const delta = 2;
  const pages = [];
  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(totalPages, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '.4rem',
      marginTop: '2.5rem',
      flexWrap: 'wrap',
    }}>

      {/* Previous */}
      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </PageBtn>

      {/* First page + ellipsis */}
      {pages[0] > 1 && (
        <>
          <PageBtn onClick={() => onPageChange(1)}>1</PageBtn>
          {pages[0] > 2 && (
            <span style={{ fontSize: '.84rem', color: '#a0a09e', padding: '0 .25rem' }}>…</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map(p => (
        <PageBtn
          key={p}
          onClick={() => onPageChange(p)}
          active={p === currentPage}
        >
          {p}
        </PageBtn>
      ))}

      {/* Last page + ellipsis */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span style={{ fontSize: '.84rem', color: '#a0a09e', padding: '0 .25rem' }}>…</span>
          )}
          <PageBtn onClick={() => onPageChange(totalPages)}>{totalPages}</PageBtn>
        </>
      )}

      {/* Next */}
      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </PageBtn>

    </div>
  );
};

export default Pagination;