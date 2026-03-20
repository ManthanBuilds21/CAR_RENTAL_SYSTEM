// ============================================================
//  Loader.js
//  Path: client/src/components/Loader.js
//  Replace your existing Loader.js entirely
// ============================================================

import React from 'react';

const shimmer = {
  position: 'relative',
  overflow: 'hidden',
  background: '#f4f4f2',
};

const ShimmerBar = () => (
  <div style={{
    position: 'absolute', inset: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.7) 50%, transparent 100%)',
    animation: 'shimmer 1.4s ease infinite',
  }} />
);

/* ── Inline Loader (small spinner inside cards/buttons) ── */
export const Loader = ({ size = 'md', text = '' }) => {
  const px = { sm: 18, md: 28, lg: 44 }[size] || 28;
  const bw = { sm: 2,  md: 2,  lg: 3  }[size] || 2;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'.75rem', padding:'2rem 0' }}>
      <div style={{
        width: px, height: px,
        border: `${bw}px solid #ebebea`,
        borderTopColor: '#171715',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
        flexShrink: 0,
      }} />
      {text && <p style={{ fontSize:'.82rem', color:'#a0a09e' }}>{text}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

/* ── Full Page Loader ── */
export const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    background: '#f7f7f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '1rem',
  }}>
    <div style={{
      width: 44, height: 44,
      border: '2.5px solid #ebebea',
      borderTopColor: '#171715',
      borderRadius: '50%',
      animation: 'spin .7s linear infinite',
    }} />
    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', color:'#a0a09e', fontWeight:400 }}>
      Loading DriveWay…
    </p>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

/* ── Car Card Skeleton ── */
export const CarCardSkeleton = () => (
  <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:16, overflow:'hidden' }}>
    {/* Image area */}
    <div style={{ ...shimmer, aspectRatio:'16/10' }}>
      <ShimmerBar />
    </div>
    {/* Body */}
    <div style={{ padding:'1.4rem 1.5rem' }}>
      <div style={{ ...shimmer, height:'.7rem', width:'45%', borderRadius:4, marginBottom:'.7rem' }}><ShimmerBar /></div>
      <div style={{ ...shimmer, height:'1rem', width:'70%', borderRadius:4, marginBottom:'1rem' }}><ShimmerBar /></div>
      {/* Specs row */}
      <div style={{ display:'flex', gap:'.75rem', marginBottom:'1.1rem' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ ...shimmer, flex:1, height:'.75rem', borderRadius:4 }}><ShimmerBar /></div>
        ))}
      </div>
      {/* Divider */}
      <div style={{ height:1, background:'#f4f4f2', margin:'.25rem 0 1rem' }} />
      {/* Price + btn */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ ...shimmer, height:'1.2rem', width:90, borderRadius:4 }}><ShimmerBar /></div>
        <div style={{ ...shimmer, height:32, width:100, borderRadius:8 }}><ShimmerBar /></div>
      </div>
    </div>
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

/* ── Booking Card Skeleton ── */
export const BookingCardSkeleton = () => (
  <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.25rem' }}>
    <div style={{ display:'flex', gap:'1rem' }}>
      {/* Thumbnail */}
      <div style={{ ...shimmer, width:96, height:68, borderRadius:8, flexShrink:0 }}><ShimmerBar /></div>
      {/* Content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.65rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ ...shimmer, height:'.95rem', width:'45%', borderRadius:4 }}><ShimmerBar /></div>
          <div style={{ ...shimmer, height:22, width:72, borderRadius:20 }}><ShimmerBar /></div>
        </div>
        <div style={{ ...shimmer, height:'.75rem', width:'30%', borderRadius:4 }}><ShimmerBar /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem' }}>
          {[1,2].map(i => (
            <div key={i} style={{ ...shimmer, height:48, borderRadius:8 }}><ShimmerBar /></div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ ...shimmer, height:'.9rem', width:80, borderRadius:4 }}><ShimmerBar /></div>
          <div style={{ ...shimmer, height:28, width:70, borderRadius:6 }}><ShimmerBar /></div>
        </div>
      </div>
    </div>
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

/* ── Table Skeleton (Admin) ── */
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
    {/* Header row */}
    <div style={{ display:'grid', gap:'1rem', gridTemplateColumns:`repeat(${cols},1fr)` }}>
      {Array.from({ length: cols }).map((_, j) => (
        <div key={j} style={{ ...shimmer, height:'.7rem', borderRadius:4 }}><ShimmerBar /></div>
      ))}
    </div>
    <div style={{ height:1, background:'#ebebea', margin:'.25rem 0' }} />
    {/* Data rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display:'grid', gap:'1rem', gridTemplateColumns:`repeat(${cols},1fr)`, padding:'.5rem 0', borderBottom:'1px solid #f7f7f5' }}>
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} style={{ ...shimmer, height:'.85rem', borderRadius:4, width: j===0 ? '80%' : `${55+Math.random()*30}%` }}><ShimmerBar /></div>
        ))}
      </div>
    ))}
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

export default Loader;