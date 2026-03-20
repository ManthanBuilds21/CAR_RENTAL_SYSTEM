// ============================================================
//  BookingCard.js
//  Path: client/src/components/BookingCard.js
//  Replace your existing BookingCard.js entirely
// ============================================================

import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const statusStyle = s => ({
  pending:   { bg:'#fef9c3', color:'#854d0e', dot:'#ca8a04' },
  confirmed: { bg:'#dbeafe', color:'#1e40af', dot:'#3b82f6' },
  active:    { bg:'#dcfce7', color:'#166534', dot:'#16a34a' },
  completed: { bg:'#f1f5f9', color:'#475569', dot:'#94a3b8' },
  cancelled: { bg:'#fee2e2', color:'#991b1b', dot:'#dc2626' },
}[s] || { bg:'#f1f5f9', color:'#475569', dot:'#94a3b8' });

const BookingCard = ({ booking, onCancel, isAdmin = false, onStatusChange }) => {
  const [loading, setLoading]   = useState(false);
  const [confirm, setConfirm]   = useState(false);
  const car = booking.car;
  const sc  = statusStyle(booking.status);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await bookingService.cancelBooking(booking._id);
      toast.success('Booking cancelled');
      onCancel?.(booking._id);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  const handleStatusChange = async newStatus => {
    setLoading(true);
    try {
      await bookingService.updateBookingStatus(booking._id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onStatusChange?.(booking._id, newStatus);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{
        background: '#fff',
        border: '1px solid #ebebea',
        borderRadius: 12,
        padding: '1.25rem',
        transition: 'box-shadow .25s',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.06)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>

          {/* Car Image */}
          <div style={{
            width: 96, height: 68, borderRadius: 8,
            overflow: 'hidden', background: '#f4f4f2', flexShrink: 0,
          }}>
            <img
              src={car?.image}
              alt={`${car?.brand} ${car?.model}`}
              style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&auto=format&fit=crop&q=60'; }}
            />
          </div>

          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* Top row */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'.75rem', marginBottom:'.5rem', flexWrap:'wrap' }}>
              <div>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, color:'#171715', marginBottom:'.15rem' }}>
                  {car?.brand} {car?.model}
                </h3>
                <p style={{ fontSize:'.74rem', color:'#a0a09e' }}>
                  {car?.type}{car?.fuelType ? ` · ${car?.fuelType}` : ''}
                </p>
              </div>

              {/* Status badge */}
              <span style={{
                display:'inline-flex', alignItems:'center', gap:'.35rem',
                padding:'.3rem .8rem', borderRadius:20, flexShrink:0,
                fontSize:'.72rem', fontWeight:500,
                background: sc.bg, color: sc.color,
              }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:sc.dot, display:'inline-block' }} />
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            {/* Dates */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem', marginBottom:'.9rem' }}>
              {[['Pick-up', booking.pickupDate], ['Return', booking.returnDate]].map(([label, date]) => (
                <div key={label} style={{ background:'#f7f7f5', border:'1px solid #ebebea', borderRadius:8, padding:'.6rem .85rem' }}>
                  <p style={{ fontSize:'.68rem', color:'#a0a09e', fontWeight:500, marginBottom:'.15rem', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</p>
                  <p style={{ fontSize:'.82rem', fontWeight:500, color:'#3a3a38' }}>{formatDate(date)}</p>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.75rem' }}>

              {/* Price + Days */}
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.05rem', fontWeight:600, color:'#171715' }}>
                  {formatCurrency(booking.totalPrice)}
                </span>
                <span style={{ fontSize:'.76rem', color:'#a0a09e', background:'#f7f7f5', padding:'.2rem .6rem', borderRadius:20 }}>
                  {booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>

                {/* Admin: status dropdown */}
                {isAdmin && !['completed','cancelled'].includes(booking.status) && (
                  <select
                    value={booking.status}
                    onChange={e => handleStatusChange(e.target.value)}
                    disabled={loading}
                    style={{
                      height:32, padding:'0 1.8rem 0 .75rem',
                      border:'1px solid #ebebea', borderRadius:6,
                      fontSize:'.76rem', color:'#171715',
                      background:'#f7f7f5',
                      fontFamily:"'DM Sans',sans-serif",
                      outline:'none', cursor:'pointer', appearance:'none',
                      WebkitAppearance:'none',
                      backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a0a09e' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
                      backgroundRepeat:'no-repeat', backgroundPosition:'right .5rem center',
                      opacity: loading ? .5 : 1,
                    }}
                  >
                    {['pending','confirmed','active','completed','cancelled'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                )}

                {/* User: cancel button */}
                {!isAdmin && ['pending','confirmed'].includes(booking.status) && (
                  <button
                    onClick={() => setConfirm(true)}
                    disabled={loading}
                    style={{
                      height:32, padding:'0 .9rem',
                      border:'1px solid #fecaca', borderRadius:6,
                      background:'transparent', color:'#dc2626',
                      fontSize:'.76rem', fontWeight:500,
                      fontFamily:"'DM Sans',sans-serif", cursor:'pointer',
                      opacity: loading ? .5 : 1,
                      transition:'background .2s, border-color .2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
                  >
                    {loading ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>

            {/* Admin: customer info */}
            {isAdmin && booking.user && (
              <div style={{ marginTop:'.85rem', paddingTop:'.85rem', borderTop:'1px solid #f4f4f2' }}>
                <p style={{ fontSize:'.76rem', color:'#a0a09e' }}>
                  Customer:{' '}
                  <span style={{ color:'#3a3a38', fontWeight:500 }}>{booking.user.name}</span>
                  <span style={{ margin:'0 .4rem', color:'#d9d9d7' }}>·</span>
                  <span style={{ color:'#6b6b69' }}>{booking.user.email}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cancel Confirm Modal ── */}
      {confirm && (
        <div style={{
          position:'fixed', inset:0, zIndex:999,
          background:'rgba(0,0,0,.35)', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
        }}>
          <div style={{
            background:'#fff', borderRadius:16, padding:'2rem',
            maxWidth:360, width:'100%',
            boxShadow:'0 20px 60px rgba(0,0,0,.12)',
            animation:'fadeUp .25s ease',
          }}>
            <div style={{ width:44, height:44, background:'#fee2e2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.1rem', fontWeight:500, textAlign:'center', marginBottom:'.5rem' }}>
              Cancel this booking?
            </h3>
            <p style={{ fontSize:'.84rem', color:'#6b6b69', textAlign:'center', lineHeight:1.7, marginBottom:'1.75rem' }}>
              This action cannot be undone. Your booking for the {car?.brand} {car?.model} will be cancelled.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
              <button
                onClick={() => setConfirm(false)}
                style={{ padding:'.8rem', border:'1px solid #ebebea', borderRadius:8, background:'transparent', fontSize:'.85rem', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background .2s' }}
                onMouseEnter={e => e.target.style.background='#f7f7f5'}
                onMouseLeave={e => e.target.style.background='transparent'}
              >
                Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{ padding:'.8rem', border:'none', borderRadius:8, background:'#dc2626', color:'#fff', fontSize:'.85rem', fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background .2s', opacity: loading ? .7 : 1 }}
                onMouseEnter={e => !loading && (e.target.style.background='#b91c1c')}
                onMouseLeave={e => !loading && (e.target.style.background='#dc2626')}
              >
                {loading ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </>
  );
};

export default BookingCard;