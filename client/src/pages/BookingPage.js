import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carService from '../services/carService';
import bookingService from '../services/bookingService';

const inputStyle = {
  width: '100%', background: '#f7f7f5', border: '1px solid #ebebea',
  borderRadius: 8, padding: '.9rem 1rem', fontSize: '.9rem',
  color: '#171715', outline: 'none', fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color .25s, background .25s',
};
const onF = e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; };
const onB = e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; };

const UPI_APPS = [
  { id: 'gpay',    name: 'Google Pay',  color: '#4285F4', icon: 'G' },
  { id: 'phonepe', name: 'PhonePe',     color: '#5f259f', icon: 'P' },
  { id: 'paytm',   name: 'Paytm',       color: '#002970', icon: 'T' },
  { id: 'bhim',    name: 'BHIM UPI',    color: '#138808', icon: 'B' },
  { id: 'other',   name: 'Other UPI',   color: '#171715', icon: '↗' },
];

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');
  const [step, setStep]             = useState(1); // 1=booking details, 2=payment
  const [payMethod, setPayMethod]   = useState('upi');
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [upiId, setUpiId]           = useState('');
  const [upiIdError, setUpiIdError] = useState('');
  const [payProcessing, setPayProcessing] = useState(false);
  const [payDone, setPayDone]       = useState(false);

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    pickupDate: tomorrow, returnDate: '',
    pickupLocation: '', dropLocation: '', notes: '',
  });

  useEffect(() => {
    carService.getCarById(carId)
      .then(data => setCar(data))
      .catch(() => setError('Car not found'))
      .finally(() => setLoading(false));
  }, [carId]);

  const totalDays = (() => {
    if (!form.pickupDate || !form.returnDate) return 0;
    const d = (new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000;
    return d > 0 ? d : 0;
  })();
  const totalPrice = totalDays * (car ? car.pricePerDay : 0);

  const handleDetailsSubmit = e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (totalDays < 1) { setError('Return date must be after pickup date'); return; }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateUpiId = id => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(id);

  const handlePayment = async e => {
    e.preventDefault();
    if (payMethod === 'upi' && selectedUpi === 'other') {
      if (!validateUpiId(upiId)) { setUpiIdError('Enter a valid UPI ID (e.g. name@upi)'); return; }
    }
    setUpiIdError('');
    setPayProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2200));
    setPayProcessing(false);
    setPayDone(true);
    await new Promise(r => setTimeout(r, 800));
    // Now actually create the booking
    setSubmitting(true);
    try {
      await bookingService.createBooking({ carId, ...form });
      setSuccess(true);
    } catch (err) {
      setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Booking failed. Please try again.');
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f5', paddingTop: 80 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebea', padding: '3rem', maxWidth: 460, width: '90%', textAlign: 'center', animation: 'scaleIn .3s ease' }}>
        <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-.02em', marginBottom: '.5rem' }}>Booking Confirmed!</h2>
        <p style={{ fontSize: '.88rem', color: '#6b6b69', lineHeight: 1.7, marginBottom: '.75rem' }}>
          Payment successful. Your {car && car.brand} {car && car.model} is reserved.
        </p>
        <div style={{ background: '#f7f7f5', borderRadius: 10, padding: '1rem', marginBottom: '1.75rem', fontSize: '.84rem', color: '#3a3a38' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}><span style={{ color: '#a0a09e' }}>Amount Paid</span><span style={{ fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>₹{totalPrice.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}><span style={{ color: '#a0a09e' }}>Payment Method</span><span style={{ fontWeight: 500 }}>{payMethod === 'upi' ? 'UPI' : 'Pay at Pickup'}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#a0a09e' }}>Booking ID</span><span style={{ fontWeight: 500, fontFamily: 'monospace' }}>DW{Date.now().toString().slice(-6)}</span></div>
        </div>
        <p style={{ fontSize: '.8rem', color: '#a0a09e', marginBottom: '1.75rem' }}>We'll send confirmation details to {user && user.email}</p>
        <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '.95rem', background: '#171715', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 500, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer' }}>
          View My Bookings
        </button>
      </div>
      <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );

  return (
    <div style={{ background: '#f7f7f5', minHeight: '100vh', paddingTop: 80 }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes checkPop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
        @media(max-width:900px){.booking-layout{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Step indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '.7rem', fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: '#a0a09e', marginBottom: '.5rem' }}>Complete Booking</p>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.8rem', fontWeight: 500, letterSpacing: '-.02em', marginBottom: '1.25rem' }}>
            Reserve {car && car.brand} {car && car.model}
          </h1>
          {/* Steps bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', maxWidth: 360 }}>
            {[['1','Booking Details'], ['2','Payment']].map(([num, label], i) => (
              <React.Fragment key={num}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= Number(num) ? '#171715' : '#ebebea', color: step >= Number(num) ? '#fff' : '#a0a09e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 600, transition: 'all .3s', flexShrink: 0 }}>
                    {step > Number(num) ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg> : num}
                  </div>
                  <span style={{ fontSize: '.8rem', fontWeight: 500, color: step >= Number(num) ? '#171715' : '#a0a09e', whiteSpace: 'nowrap', transition: 'color .3s' }}>{label}</span>
                </div>
                {i === 0 && <div style={{ flex: 1, height: 2, background: step > 1 ? '#171715' : '#ebebea', margin: '0 .75rem', transition: 'background .3s', minWidth: 40 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="booking-layout">

          {/* LEFT */}
          <div>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '.85rem 1rem', fontSize: '.84rem', color: '#dc2626', marginBottom: '1rem' }}>{error}</div>
            )}

            {/* ── STEP 1: Booking Details ── */}
            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'slideIn .3s ease' }}>

                <FormSection title="Rental Dates" icon="📅">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FieldGroup label="Pick-up Date">
                      <input type="date" required min={today} value={form.pickupDate} onChange={e => setForm(f => ({ ...f, pickupDate: e.target.value }))} style={inputStyle} onFocus={onF} onBlur={onB} />
                    </FieldGroup>
                    <FieldGroup label="Return Date">
                      <input type="date" required min={form.pickupDate || today} value={form.returnDate} onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))} style={inputStyle} onFocus={onF} onBlur={onB} />
                    </FieldGroup>
                  </div>
                  {totalDays > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.75rem', padding: '.7rem .9rem', background: '#f0fdf4', borderRadius: 8, fontSize: '.82rem', color: '#166534' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                      {totalDays} day{totalDays > 1 ? 's' : ''} rental · ₹{totalPrice.toLocaleString()} total
                    </div>
                  )}
                </FormSection>

                <FormSection title="Locations" icon="📍">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FieldGroup label="Pick-up Location">
                      <input type="text" required value={form.pickupLocation} onChange={e => setForm(f => ({ ...f, pickupLocation: e.target.value }))} placeholder="City, airport, or address" style={inputStyle} onFocus={onF} onBlur={onB} />
                    </FieldGroup>
                    <FieldGroup label="Drop-off Location">
                      <input type="text" value={form.dropLocation} onChange={e => setForm(f => ({ ...f, dropLocation: e.target.value }))} placeholder="Same as pickup or different" style={inputStyle} onFocus={onF} onBlur={onB} />
                    </FieldGroup>
                  </div>
                </FormSection>

                <FormSection title="Additional Notes" icon="📝">
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any special requests or notes…" rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} onFocus={onF} onBlur={onB} />
                </FormSection>

                <button type="submit" disabled={totalDays < 1}
                  style={{ width: '100%', padding: '1rem', background: totalDays < 1 ? '#d9d9d7' : '#171715', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 500, fontFamily: "'DM Sans',sans-serif", cursor: totalDays < 1 ? 'not-allowed' : 'pointer', transition: 'background .25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}
                  onMouseEnter={e => totalDays > 0 && (e.currentTarget.style.background = '#3a3a38')}
                  onMouseLeave={e => totalDays > 0 && (e.currentTarget.style.background = '#171715')}
                >
                  {totalDays < 1 ? 'Select Dates to Continue' : 'Continue to Payment'}
                  {totalDays > 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              </form>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'slideIn .3s ease' }}>

                {/* Payment Method Selector */}
                <FormSection title="Payment Method" icon="💳">
                  <div style={{ display: 'flex', gap: '.75rem', marginBottom: '.25rem' }}>
                    {[['upi', '📱 UPI'], ['pickup', '🏢 Pay at Pickup']].map(([key, label]) => (
                      <button key={key} type="button" onClick={() => setPayMethod(key)}
                        style={{ flex: 1, padding: '.85rem', borderRadius: 10, border: `2px solid ${payMethod === key ? '#171715' : '#ebebea'}`, background: payMethod === key ? '#171715' : '#fff', color: payMethod === key ? '#fff' : '#6b6b69', fontSize: '.84rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s', fontFamily: "'DM Sans',sans-serif" }}
                      >{label}</button>
                    ))}
                  </div>
                </FormSection>

                {/* UPI Section */}
                {payMethod === 'upi' && (
                  <FormSection title="Pay via UPI" icon="📱">
                    <p style={{ fontSize: '.82rem', color: '#6b6b69', marginBottom: '1.25rem' }}>Choose your preferred UPI app to complete the payment of <strong style={{ color: '#171715' }}>₹{totalPrice.toLocaleString()}</strong></p>

                    {/* UPI App Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '.65rem', marginBottom: '1.25rem' }}>
                      {UPI_APPS.map(app => (
                        <button key={app.id} type="button" onClick={() => setSelectedUpi(app.id)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem', padding: '.85rem .5rem', borderRadius: 10, border: `2px solid ${selectedUpi === app.id ? app.color : '#ebebea'}`, background: selectedUpi === app.id ? app.color + '10' : '#fff', cursor: 'pointer', transition: 'all .2s', position: 'relative' }}
                        >
                          {selectedUpi === app.id && (
                            <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop .25s ease' }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                            </div>
                          )}
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.9rem' }}>{app.icon}</div>
                          <span style={{ fontSize: '.66rem', fontWeight: 500, color: selectedUpi === app.id ? app.color : '#6b6b69', textAlign: 'center', lineHeight: 1.3 }}>{app.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* UPI ID input for 'other' */}
                    {selectedUpi === 'other' && (
                      <div style={{ animation: 'slideIn .25s ease' }}>
                        <FieldGroup label="Your UPI ID">
                          <div style={{ position: 'relative' }}>
                            <input type="text" value={upiId} onChange={e => { setUpiId(e.target.value); setUpiIdError(''); }} placeholder="yourname@upi" style={{ ...inputStyle, borderColor: upiIdError ? '#dc2626' : '#ebebea' }} onFocus={onF} onBlur={onB} />
                            {upiId && validateUpiId(upiId) && (
                              <div style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                              </div>
                            )}
                          </div>
                          {upiIdError && <p style={{ fontSize: '.76rem', color: '#dc2626', marginTop: '.3rem' }}>{upiIdError}</p>}
                        </FieldGroup>
                      </div>
                    )}

                    {/* Simulated QR for non-other apps */}
                    {selectedUpi !== 'other' && (
                      <div style={{ background: '#f7f7f5', borderRadius: 10, padding: '1.25rem', textAlign: 'center', border: '1px solid #ebebea' }}>
                        {/* Fake QR */}
                        <div style={{ width: 100, height: 100, margin: '0 auto .75rem', background: '#171715', borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 1, padding: 6, overflow: 'hidden' }}>
                          {Array.from({ length: 100 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: 1, background: [0,1,2,10,11,12,20,21,22,7,8,9,17,18,19,27,28,29,49,50,51,55,56,57,63,64,65,77,78,79,87,88,89,97,98,99,35,36,45,46,33,43,53,23,24,25,73,74,75,30,40,41,42,44,48,58,68,69,60,70,80,81,82,83,84,85,86].includes(i) ? '#fff' : 'transparent' }} />
                          ))}
                        </div>
                        <p style={{ fontSize: '.78rem', color: '#6b6b69', marginBottom: '.3rem' }}>Scan with {UPI_APPS.find(a => a.id === selectedUpi) && UPI_APPS.find(a => a.id === selectedUpi).name}</p>
                        <p style={{ fontSize: '.72rem', color: '#a0a09e' }}>or the payment will auto-redirect on confirm</p>
                      </div>
                    )}

                    {/* Trust badges */}
                    <div style={{ display: 'flex', gap: '.65rem', marginTop: '.75rem', flexWrap: 'wrap' }}>
                      {['🔒 256-bit Secure', '✓ RBI Compliant', '⚡ Instant Confirm'].map(b => (
                        <span key={b} style={{ fontSize: '.72rem', color: '#6b6b69', background: '#f7f7f5', padding: '.3rem .75rem', borderRadius: 20, border: '1px solid #ebebea' }}>{b}</span>
                      ))}
                    </div>
                  </FormSection>
                )}

                {/* Pay at Pickup */}
                {payMethod === 'pickup' && (
                  <FormSection title="Pay at Pickup" icon="🏢">
                    <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '1rem', fontSize: '.84rem', color: '#854d0e', lineHeight: 1.8, marginBottom: '1rem' }}>
                      ⚠️ You will need to pay <strong>₹{totalPrice.toLocaleString()}</strong> in cash or card at the pickup point before receiving the keys.
                    </div>
                    <div style={{ fontSize: '.82rem', color: '#6b6b69', lineHeight: 1.8 }}>
                      ✓ Booking will be reserved but not confirmed until payment<br/>
                      ✓ Accepted: Cash, Debit/Credit Card, UPI at counter<br/>
                      ✓ Bring a valid photo ID for verification
                    </div>
                  </FormSection>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '.75rem' }}>
                  <button type="button" onClick={() => { setStep(1); setPayDone(false); }}
                    style={{ padding: '.95rem 1.5rem', background: 'transparent', color: '#6b6b69', border: '1px solid #ebebea', borderRadius: 8, fontSize: '.88rem', fontWeight: 500, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#171715'; e.currentTarget.style.color = '#171715'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#ebebea'; e.currentTarget.style.color = '#6b6b69'; }}
                  >← Back</button>

                  <button type="submit" disabled={submitting || payProcessing}
                    style={{ flex: 1, padding: '.95rem', background: payDone ? '#16a34a' : submitting || payProcessing ? '#3a3a38' : '#171715', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem', fontWeight: 500, fontFamily: "'DM Sans',sans-serif", cursor: submitting || payProcessing ? 'not-allowed' : 'pointer', transition: 'background .3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem' }}
                  >
                    {payProcessing && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />}
                    {payDone && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>}
                    {payProcessing ? 'Processing Payment…' : payDone ? 'Payment Successful!' : payMethod === 'upi' ? `Pay ₹${totalPrice.toLocaleString()} via UPI` : `Confirm Booking — Pay at Pickup`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT — Summary */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: '#fff', border: '1px solid #ebebea', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: '#f4f4f2' }}>
                <img src={car && car.image ? car.image : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'} alt={car && car.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '.72rem', color: '#a0a09e', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.25rem' }}>{car && car.brand}</p>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', fontWeight: 500, letterSpacing: '-.01em', marginBottom: '1rem' }}>{car && car.model}</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {[['⚙️', car && car.transmission], ['⛽', car && car.fuelType], ['👤', car && car.seats + ' seats']].map(([icon, val]) => (
                    <span key={val} style={{ fontSize: '.78rem', color: '#6b6b69' }}>{icon} {val}</span>
                  ))}
                </div>
                <div style={{ height: 1, background: '#f4f4f2', margin: '0 0 1.25rem' }} />

                {/* Booking summary */}
                {form.pickupDate && form.returnDate && (
                  <div style={{ background: '#f7f7f5', borderRadius: 8, padding: '.85rem', marginBottom: '1.25rem', fontSize: '.8rem', color: '#6b6b69', lineHeight: 1.8 }}>
                    <div>📅 {new Date(form.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → {new Date(form.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    {form.pickupLocation && <div>📍 {form.pickupLocation}</div>}
                  </div>
                )}

                {/* Price breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', fontSize: '.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b69' }}>
                    <span>₹{car && car.pricePerDay && car.pricePerDay.toLocaleString()} × {totalDays || 0} days</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b69' }}>
                    <span>Service fee</span><span style={{ color: '#16a34a' }}>Free</span>
                  </div>
                  <div style={{ height: 1, background: '#f4f4f2', margin: '.25rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: '1.05rem' }}>
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  {step === 2 && payMethod === 'upi' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', color: '#6b6b69' }}>
                      <span>Payment via</span>
                      <span style={{ fontWeight: 500, color: '#171715' }}>{UPI_APPS.find(a => a.id === selectedUpi) && UPI_APPS.find(a => a.id === selectedUpi).name}</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1.25rem', background: '#f7f7f5', borderRadius: 8, padding: '.85rem', fontSize: '.78rem', color: '#6b6b69', lineHeight: 1.8 }}>
                  ✓ Free cancellation up to 24h before pickup<br/>
                  ✓ No hidden charges<br/>
                  ✓ Instant confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ title, icon, children }) => (
  <div style={{ background: '#fff', border: '1px solid #ebebea', borderRadius: 12, padding: '1.5rem' }}>
    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', fontWeight: 500, letterSpacing: '-.01em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
      {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}{title}
    </h3>
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
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f5' }}>
    <div style={{ width: 36, height: 36, border: '2px solid #ebebea', borderTopColor: '#171715', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default BookingPage;