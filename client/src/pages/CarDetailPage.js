// ============================================================
//  CarDetailPage.js
//  Path: client/src/pages/CarDetailPage.js
//  Replace your existing CarDetailPage.js entirely
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import carService from '../services/carService';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Loader';

const fmt = n => Number(n || 0).toLocaleString('en-IN');

const CarDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { isAuthenticated } = useAuth();

  const [car, setCar]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    carService.getCarById(id)
      .then(setCar)
      .catch(err => setError(err?.response?.data?.message || 'Car not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  if (error || !car) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7f5', paddingTop:80 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🚫</div>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.4rem', fontWeight:500, marginBottom:'.5rem' }}>{error || 'Car not found'}</h2>
        <Link to="/cars" style={{ display:'inline-block', marginTop:'1rem', background:'#171715', color:'#fff', padding:'.75rem 1.75rem', borderRadius:8, textDecoration:'none', fontSize:'.85rem', fontWeight:500 }}>
          ← Back to Cars
        </Link>
      </div>
    </div>
  );

  const specs = [
    { label:'Year',         value: car.year || '2023',       icon: <CalIcon /> },
    { label:'Fuel Type',    value: car.fuelType,             icon: <FuelIcon /> },
    { label:'Seats',        value: `${car.seats} Seats`,     icon: <SeatIcon /> },
    { label:'Transmission', value: car.transmission,         icon: <GearIcon /> },
    { label:'Type',         value: car.type,                 icon: <CarTypeIcon /> },
    { label:'Mileage',      value: car.mileage || 'N/A',     icon: <MileIcon /> },
  ];

  return (
    <div style={{ background:'#f7f7f5', minHeight:'100vh', paddingTop:72 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebea' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'.9rem 2rem', display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.8rem', color:'#a0a09e' }}>
          <Link to="/" style={{ color:'#a0a09e', textDecoration:'none', transition:'color .2s' }}
            onMouseEnter={e=>e.target.style.color='#171715'} onMouseLeave={e=>e.target.style.color='#a0a09e'}>Home</Link>
          <span>/</span>
          <Link to="/cars" style={{ color:'#a0a09e', textDecoration:'none', transition:'color .2s' }}
            onMouseEnter={e=>e.target.style.color='#171715'} onMouseLeave={e=>e.target.style.color='#a0a09e'}>Cars</Link>
          <span>/</span>
          <span style={{ color:'#171715', fontWeight:500 }}>{car.brand} {car.model}</span>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'2rem', alignItems:'start' }} className="detail-layout">

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

            {/* Main Image */}
            <div style={{ position:'relative', borderRadius:16, overflow:'hidden', aspectRatio:'16/9', background:'#ebebea' }}>
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                onLoad={() => setImgLoaded(true)}
                onError={e => { e.target.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80'; }}
                style={{
                  width:'100%', height:'100%', objectFit:'cover',
                  opacity: imgLoaded ? 1 : 0,
                  transition:'opacity .5s ease, transform .6s ease',
                  transform: imgLoaded ? 'scale(1)' : 'scale(1.03)',
                }}
              />
              {/* Availability badge */}
              <div style={{ position:'absolute', top:'1.2rem', left:'1.2rem', display:'flex', gap:'.5rem' }}>
                <span style={{
                  fontSize:'.72rem', fontWeight:500, letterSpacing:'.06em',
                  padding:'.35rem .9rem', borderRadius:20,
                  background: car.available ? 'rgba(220,252,231,.95)' : 'rgba(254,226,226,.95)',
                  color:       car.available ? '#166534' : '#991b1b',
                  backdropFilter:'blur(8px)',
                }}>
                  {car.available ? '● Available' : '● Unavailable'}
                </span>
              </div>
              {/* Type badge */}
              <div style={{ position:'absolute', top:'1.2rem', right:'1.2rem' }}>
                <span style={{
                  fontSize:'.72rem', fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase',
                  padding:'.35rem .9rem', borderRadius:20,
                  background:'rgba(255,255,255,.88)', color:'#3a3a38',
                  backdropFilter:'blur(8px)',
                }}>
                  {car.type}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:'.25rem', background:'#fff', border:'1px solid #ebebea', borderRadius:10, padding:'.3rem', width:'fit-content' }}>
              {['overview', 'features'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding:'.55rem 1.6rem', borderRadius:7, border:'none', cursor:'pointer',
                  fontSize:'.82rem', fontWeight:500, textTransform:'capitalize',
                  background: activeTab===tab ? '#171715' : 'transparent',
                  color:       activeTab===tab ? '#fff' : '#6b6b69',
                  transition:'all .2s',
                }}>{tab}</button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.75rem', animation:'fadeIn .3s ease' }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem', color:'#171715' }}>Specifications</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'#ebebea', borderRadius:10, overflow:'hidden' }} className="specs-grid">
                  {specs.map(({ label, value, icon }) => (
                    <div key={label} style={{ background:'#fff', padding:'1.25rem 1rem', display:'flex', flexDirection:'column', gap:'.5rem' }}>
                      <div style={{ color:'#a0a09e' }}>{icon}</div>
                      <div style={{ fontSize:'.72rem', color:'#a0a09e', fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>{label}</div>
                      <div style={{ fontSize:'.9rem', fontWeight:500, color:'#171715' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {car.description && (
                  <div style={{ marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid #f4f4f2' }}>
                    <h4 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500, marginBottom:'.75rem', color:'#171715' }}>About this car</h4>
                    <p style={{ fontSize:'.87rem', color:'#6b6b69', lineHeight:1.85 }}>{car.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Features */}
            {activeTab === 'features' && (
              <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.75rem', animation:'fadeIn .3s ease' }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem', color:'#171715' }}>Features & Amenities</h3>
                {car.features && car.features.length > 0 ? (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem' }} className="features-grid">
                    {car.features.map(feature => (
                      <div key={feature} style={{
                        display:'flex', alignItems:'center', gap:'.75rem',
                        background:'#f7f7f5', borderRadius:8, padding:'.85rem 1rem',
                        border:'1px solid #ebebea',
                      }}>
                        <div style={{ width:22, height:22, borderRadius:'50%', background:'#171715', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize:'.84rem', color:'#3a3a38', fontWeight:400 }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize:'.86rem', color:'#a0a09e' }}>No features listed for this car.</p>
                )}
              </div>
            )}
          </div>

          {/* ══ RIGHT COLUMN — Booking Card ══ */}
          <div style={{ position:'sticky', top:88 }}>
            <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,.06)' }}>

              {/* Car Title */}
              <div style={{ padding:'1.5rem 1.5rem 0' }}>
                <p style={{ fontSize:'.72rem', fontWeight:500, letterSpacing:'.12em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.3rem' }}>{car.brand}</p>
                <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.6rem', fontWeight:500, letterSpacing:'-.02em', color:'#171715', lineHeight:1.1, marginBottom:'.6rem' }}>
                  {car.model}
                </h1>

                {/* Rating */}
                <div style={{ display:'flex', alignItems:'center', gap:'.4rem', marginBottom:'1.25rem' }}>
                  <div style={{ display:'flex', gap:2 }}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= Math.round(car.rating || 4.5) ? '#171715' : '#ebebea'} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize:'.8rem', fontWeight:500, color:'#171715' }}>{(car.rating || 4.5).toFixed(1)}</span>
                  <span style={{ fontSize:'.8rem', color:'#a0a09e' }}>({car.numReviews || 0} reviews)</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height:1, background:'#f4f4f2', margin:'0 1.5rem' }} />

              {/* Price */}
              <div style={{ padding:'1.25rem 1.5rem', display:'flex', alignItems:'baseline', gap:'.3rem' }}>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'2.2rem', fontWeight:600, letterSpacing:'-.02em', color:'#171715' }}>
                  ₹{fmt(car.pricePerDay)}
                </span>
                <span style={{ fontSize:'.84rem', color:'#a0a09e', fontWeight:400 }}>/day</span>
              </div>

              {/* Quick Specs */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'#f4f4f2', margin:'0 1.5rem', borderRadius:10, overflow:'hidden' }}>
                {[
                  { label: car.fuelType,      icon: <FuelIcon /> },
                  { label:`${car.seats} Seats`,icon: <SeatIcon /> },
                  { label: car.transmission,  icon: <GearIcon /> },
                ].map(({ label, icon }) => (
                  <div key={label} style={{ background:'#fff', padding:'.9rem .75rem', textAlign:'center' }}>
                    <div style={{ display:'flex', justifyContent:'center', color:'#6b6b69', marginBottom:'.3rem' }}>{icon}</div>
                    <div style={{ fontSize:'.72rem', color:'#6b6b69' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'.75rem' }}>
                {car.available ? (
                  <>
                    {isAuthenticated ? (
                      <button
                        onClick={() => navigate(`/booking/${car._id}`)}
                        style={{
                          width:'100%', padding:'1rem',
                          background:'#171715', color:'#fff',
                          border:'none', borderRadius:8,
                          fontFamily:"'DM Sans',sans-serif", fontSize:'.9rem', fontWeight:500,
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'.6rem',
                          transition:'background .25s, transform .2s',
                        }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='#3a3a38'; e.currentTarget.style.transform='translateY(-1px)'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='#171715'; e.currentTarget.style.transform='none'; }}
                      >
                        Book This Car
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    ) : (
                      <Link to={`/login?redirect=/booking/${car._id}`} style={{
                        display:'flex', alignItems:'center', justifyContent:'center', gap:'.6rem',
                        width:'100%', padding:'1rem',
                        background:'#171715', color:'#fff',
                        borderRadius:8, textDecoration:'none',
                        fontFamily:"'DM Sans',sans-serif", fontSize:'.9rem', fontWeight:500,
                        transition:'background .25s',
                      }}
                        onMouseEnter={e=>e.currentTarget.style.background='#3a3a38'}
                        onMouseLeave={e=>e.currentTarget.style.background='#171715'}
                      >
                        Sign In to Book
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    )}
                    <p style={{ textAlign:'center', fontSize:'.76rem', color:'#a0a09e' }}>Free cancellation · No hidden fees</p>
                  </>
                ) : (
                  <div style={{
                    width:'100%', padding:'1rem', borderRadius:8,
                    background:'#f7f7f5', border:'1px solid #ebebea',
                    textAlign:'center', fontSize:'.88rem', color:'#a0a09e', fontWeight:500,
                  }}>
                    Currently Unavailable
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height:1, background:'#f4f4f2', margin:'0 1.5rem' }} />

              {/* Trust Badges */}
              <div style={{ padding:'1.25rem 1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                {[
                  { icon:<ShieldIcon />, text:'Fully Insured' },
                  { icon:<SupportIcon />, text:'24/7 Support' },
                  { icon:<DeliveryIcon />, text:'Free Delivery' },
                  { icon:<CancelIcon />, text:'Free Cancellation' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <div style={{ color:'#6b6b69', flexShrink:0 }}>{icon}</div>
                    <span style={{ fontSize:'.76rem', color:'#6b6b69' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Link */}
            <Link to="/cars" style={{
              display:'inline-flex', alignItems:'center', gap:'.4rem',
              marginTop:'1rem', fontSize:'.8rem', color:'#a0a09e',
              textDecoration:'none', transition:'color .2s',
            }}
              onMouseEnter={e=>e.currentTarget.style.color='#171715'}
              onMouseLeave={e=>e.currentTarget.style.color='#a0a09e'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to all cars
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @media(max-width:960px){
          .detail-layout{ grid-template-columns:1fr !important; }
        }
        @media(max-width:600px){
          .specs-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .features-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ── SVG Icons ── */
const CalIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const FuelIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M3 11h12"/><path d="M15 7l4 4v8a1 1 0 0 1-1 1h-2"/></svg>;
const SeatIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const GearIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>;
const CarTypeIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const MileIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ShieldIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const SupportIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const DeliveryIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const CancelIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>;

export default CarDetailPage;