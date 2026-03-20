// ============================================================
//  BookingPage.js
//  Path: client/src/pages/BookingPage.js
//  Replace your existing BookingPage.js entirely
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carService from '../services/carService';
import bookingService from '../services/bookingService';

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

const focusStyle = e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; };
const blurStyle  = e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; };

const BookingPage = () => {
  const { carId } = useParams(); // ✅ fixed: was { id }
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    pickupDate: tomorrow,
    returnDate: '',
    pickupLocation: '',
    dropLocation: '',
    notes: '',
  });

  useEffect(() => {
    carService.getCarById(carId) // ✅ fixed: was id
      .then(data => setCar(data))
      .catch(() => setError('Car not found'))
      .finally(() => setLoading(false));
  }, [carId]);

  const totalDays = (() => {
    if (!form.pickupDate || !form.returnDate) return 0;
    const d = (new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000;
    return d > 0 ? d : 0;
  })();

  const totalPrice = totalDays * (car?.pricePerDay || 0);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (totalDays < 1) { setError('Return date must be after pickup date'); return; }
    setError('');
    setSubmitting(true);
    try {
      await bookingService.createBooking({ carId, ...form }); // ✅ fixed: was carId: id
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f5', paddingTop: 80 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebea', padding: '3rem', maxWidth: 440, width: '90%', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-.02em', marginBottom: '.6rem' }}>Booking Confirmed</h2>
        <p style={{ fontSize: '.88rem', color: '#6b6b69', lineHeight: 1.7, marginBottom: '2rem' }}>
          Your {car?.brand} {car?.model} is reserved. We'll send details to your email shortly.
        </p>
        <button onClick={() => navigate('/dashboard')} style={{
          width: '100%', padding: '.9rem',
          background: '#171715', color: '#fff', border: 'none',
          borderRadius: 8, fontSize: '.88rem', fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
        }}>
          View My Bookings
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f7f7f5', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Page Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a0a09e', marginBottom: '.4rem' }}>Complete Booking</p>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 500, letterSpacing: '-.02em' }}>
            Reserve {car?.brand} {car?.model}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="booking-layout">

          {/* LEFT — Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '.85rem 1rem', fontSize: '.84rem', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <FormSection title="Rental Dates">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FieldGroup label="Pick-up Date">
                  <input type="date" required min={today} value={form.pickupDate}
                    onChange={e => setForm(f => ({ ...f, pickupDate: e.target.value }))}
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                  />
                </FieldGroup>
                <FieldGroup label="Return Date">
                  <input type="date" required min={form.pickupDate || today} value={form.returnDate}
                    onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))}
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                  />
                </FieldGroup>
              </div>
            </FormSection>

            <FormSection title="Locations">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FieldGroup label="Pick-up Location">
                  <input type="text" required value={form.pickupLocation}
                    onChange={e => setForm(f => ({ ...f, pickupLocation: e.target.value }))}
                    placeholder="City, airport, or address"
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                  />
                </FieldGroup>
                <FieldGroup label="Drop-off Location">
                  <input type="text" value={form.dropLocation}
                    onChange={e => setForm(f => ({ ...f, dropLocation: e.target.value }))}
                    placeholder="Same as pickup or different"
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                  />
                </FieldGroup>
              </div>
            </FormSection>

            <FormSection title="Additional Notes">
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any special requests or notes…"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </FormSection>

            <button
              type="submit"
              disabled={submitting || totalDays < 1}
              style={{
                width: '100%', padding: '1rem',
                background: submitting || totalDays < 1 ? '#d9d9d7' : '#171715',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: '.9rem', fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: submitting || totalDays < 1 ? 'not-allowed' : 'pointer',
                transition: 'background .25s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem',
              }}
              onMouseEnter={e => (submitting || totalDays < 1) || (e.currentTarget.style.background = '#3a3a38')}
              onMouseLeave={e => (submitting || totalDays < 1) || (e.currentTarget.style.background = '#171715')}
            >
              {submitting ? 'Confirming…' : totalDays < 1 ? 'Select Return Date' : `Confirm Booking — ₹${totalPrice.toLocaleString()}`}
              {!submitting && totalDays > 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </button>
          </form>

          {/* RIGHT — Summary */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: '#fff', border: '1px solid #ebebea', borderRadius: 16, overflow: 'hidden' }}>
              {/* Car Image */}
              <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: '#f4f4f2' }}>
                <img
                  src={car?.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'}
                  alt={`${car?.brand} ${car?.model}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '.72rem', color: '#a0a09e', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.25rem' }}>{car?.brand}</p>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 500, letterSpacing: '-.01em', marginBottom: '1rem' }}>{car?.model}</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {[['⚙️', car?.transmission], ['⛽', car?.fuelType], ['👤', `${car?.seats} seats`]].map(([icon, val]) => (
                    <span key={val} style={{ fontSize: '.78rem', color: '#6b6b69' }}>{icon} {val}</span>
                  ))}
                </div>
                <div style={{ height: 1, background: '#f4f4f2', margin: '0 0 1.25rem' }} />

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', fontSize: '.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b69' }}>
                    <span>₹{car?.pricePerDay?.toLocaleString()} × {totalDays || 0} days</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b69' }}>
                    <span>Service fee</span>
                    <span>₹0</span>
                  </div>
                  <div style={{ height: 1, background: '#f4f4f2', margin: '.25rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontFamily: "'Outfit', sans-serif", fontSize: '1rem' }}>
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Policy */}
                <div style={{ marginTop: '1.25rem', background: '#f7f7f5', borderRadius: 8, padding: '.85rem', fontSize: '.78rem', color: '#6b6b69', lineHeight: 1.7 }}>
                  ✓ Free cancellation up to 24h before pickup<br/>
                  ✓ No hidden charges<br/>
                  ✓ Instant confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .booking-layout{ grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <div style={{ background: '#fff', border: '1px solid #ebebea', borderRadius: 12, padding: '1.5rem' }}>
    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 500, letterSpacing: '-.01em', marginBottom: '1.25rem' }}>{title}</h3>
    {children}
  </div>
);

const FieldGroup = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
    <label style={{ fontSize: '.75rem', fontWeight: 500, color: '#6b6b69', letterSpacing: '.06em' }}>{label}</label>
    {children}
  </div>
);

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 36, height: 36, border: '2px solid #ebebea', borderTopColor: '#171715', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default BookingPage;