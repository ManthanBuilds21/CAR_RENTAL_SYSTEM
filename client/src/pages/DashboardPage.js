import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const fmt = n => Number(n||0).toLocaleString('en-IN');
const sc = s => ({pending:{bg:'#fef9c3',color:'#854d0e',dot:'#ca8a04'},confirmed:{bg:'#dbeafe',color:'#1e40af',dot:'#3b82f6'},active:{bg:'#dcfce7',color:'#166534',dot:'#16a34a'},completed:{bg:'#f1f5f9',color:'#475569',dot:'#94a3b8'},cancelled:{bg:'#fee2e2',color:'#991b1b',dot:'#dc2626'}}[s]||{bg:'#f1f5f9',color:'#475569',dot:'#94a3b8'});

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    bookingService.getUserBookings().then(setBookings).catch(console.error).finally(()=>setLoading(false));
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return; setCancelling(true);
    try { await bookingService.cancelBooking(cancelId); setBookings(p=>p.map(b=>b._id===cancelId?{...b,status:'cancelled'}:b)); }
    catch(e){ console.error(e); } finally { setCancelling(false); setCancelId(null); }
  };

  const filtered = activeTab==='all' ? bookings : bookings.filter(b=>b.status===activeTab);
  const spent = bookings.filter(b=>b.status!=='cancelled').reduce((s,b)=>s+b.totalPrice,0);
  const upcoming = bookings.filter(b=>['pending','confirmed'].includes(b.status)).length;
  const trips = bookings.filter(b=>b.status==='completed').length;
  const tabs = [['all','All'],['pending','Pending'],['confirmed','Confirmed'],['active','Active'],['completed','Completed'],['cancelled','Cancelled']];

  return (
    <div style={{ minHeight:'100vh', background:'#f7f7f5', paddingTop:72 }}>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .bcard{transition:box-shadow .25s,transform .25s} .bcard:hover{box-shadow:0 6px 24px rgba(0,0,0,.08);transform:translateY(-2px)}
        .stat-c{transition:box-shadow .25s,transform .25s} .stat-c:hover{box-shadow:0 6px 20px rgba(0,0,0,.08);transform:translateY(-2px)}
        @media(max-width:700px){.user-stats{grid-template-columns:1fr 1fr!important}.bcard-inner{grid-template-columns:60px 1fr!important}}
        @media(max-width:420px){.user-stats{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebea' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'1.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontSize:'.7rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.2rem' }}>My Account</p>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.5rem', fontWeight:500, letterSpacing:'-.02em', display:'flex', alignItems:'center', gap:'.5rem' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
          </div>
          <Link to="/cars" style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'#171715', color:'#fff', fontSize:'.82rem', fontWeight:500, padding:'.72rem 1.5rem', borderRadius:8, textDecoration:'none', transition:'background .25s, transform .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#3a3a38';e.currentTarget.style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='#171715';e.currentTarget.style.transform='none'}}
          ><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>Browse Cars</Link>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem' }}>

        {/* Profile card */}
        <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:14, padding:'1.5rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', animation:'slideIn .35s ease' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'#171715', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:"'Outfit',sans-serif", fontSize:'1.2rem', fontWeight:500, flexShrink:0, boxShadow:'0 4px 12px rgba(23,23,21,.25)' }}>
              {(user?.name||'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:500, color:'#171715', fontSize:'1rem' }}>{user?.name}</div>
              <div style={{ fontSize:'.8rem', color:'#a0a09e' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'.65rem', flexWrap:'wrap' }}>
            <span style={{ fontSize:'.76rem', background:'#f7f7f5', color:'#6b6b69', padding:'.4rem .9rem', borderRadius:20, border:'1px solid #ebebea' }}>
              {bookings.length} total booking{bookings.length!==1?'s':''}
            </span>
            <span style={{ fontSize:'.76rem', background:'#dcfce7', color:'#166534', padding:'.4rem .9rem', borderRadius:20 }}>
              Member ✓
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem', animation:'slideIn .4s ease' }} className="user-stats">
          {[{label:'Completed Trips',value:trips,sub:'Rentals finished',icon:'🏁',color:'#dcfce7'},{label:'Upcoming',value:upcoming,sub:'Pending & confirmed',icon:'📅',color:'#dbeafe'},{label:'Total Spent',value:`₹${fmt(spent)}`,sub:'Across all bookings',icon:'💳',color:'#f3e8ff'}].map(({label,value,sub,icon,color})=>(
            <div key={label} className="stat-c" style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.5rem' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', marginBottom:'.9rem' }}>{icon}</div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.8rem', fontWeight:600, letterSpacing:'-.02em', color:'#171715', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:'.84rem', fontWeight:500, color:'#171715', marginTop:'.4rem' }}>{label}</div>
              <div style={{ fontSize:'.76rem', color:'#a0a09e', marginTop:'.15rem' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Bookings panel */}
        <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, overflow:'hidden', animation:'slideIn .45s ease' }}>
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #ebebea', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500 }}>My Bookings</h2>
            <div style={{ display:'flex', gap:'.2rem', flexWrap:'wrap' }}>
              {tabs.map(([key,label])=>(
                <button key={key} onClick={()=>setActiveTab(key)} style={{ padding:'.38rem .9rem', borderRadius:6, border:'none', cursor:'pointer', fontSize:'.76rem', fontWeight:500, fontFamily:"'DM Sans',sans-serif", background:activeTab===key?'#171715':'transparent', color:activeTab===key?'#fff':'#6b6b69', transition:'all .2s' }}>{label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'4rem', gap:'1rem', color:'#a0a09e' }}>
              <div style={{ width:24, height:24, border:'2px solid #ebebea', borderTopColor:'#171715', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
              Loading your bookings…
            </div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🚗</div>
              <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, marginBottom:'.4rem' }}>No bookings here</p>
              <p style={{ fontSize:'.84rem', color:'#a0a09e', marginBottom:'1.5rem' }}>You haven't made any {activeTab!=='all'?activeTab:''} bookings yet.</p>
              <Link to="/cars" style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'#171715', color:'#fff', fontSize:'.82rem', fontWeight:500, padding:'.7rem 1.4rem', borderRadius:8, textDecoration:'none' }}>Browse Cars →</Link>
            </div>
          ) : (
            <div style={{ padding:'1rem', display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {filtered.map(b=>{
                const s=sc(b.status);
                const canCancel=['pending','confirmed'].includes(b.status);
                return (
                  <div key={b._id} className="bcard" style={{ border:'1px solid #ebebea', borderRadius:10, overflow:'hidden' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:'1rem', padding:'1.25rem' }} className="bcard-inner">
                      <div style={{ width:80, height:56, borderRadius:8, overflow:'hidden', background:'#f4f4f2', flexShrink:0 }}>
                        <img src={b.car?.image} alt={b.car?.model} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
                      </div>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.35rem', flexWrap:'wrap' }}>
                          <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:'.95rem', color:'#171715' }}>{b.car?.brand} {b.car?.model}</span>
                          <span style={{ fontSize:'.68rem', color:'#a0a09e', background:'#f7f7f5', padding:'.15rem .6rem', borderRadius:20 }}>{b.car?.type}</span>
                          <span style={{ fontSize:'.72rem', fontWeight:500, padding:'.25rem .7rem', borderRadius:20, background:s.bg, color:s.color, textTransform:'capitalize', display:'inline-flex', alignItems:'center', gap:'.3rem' }}>
                            <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot, display:'inline-block' }} />{b.status}
                          </span>
                        </div>
                        <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', fontSize:'.8rem', color:'#6b6b69' }}>
                          <span>📅 {new Date(b.pickupDate).toLocaleDateString('en-IN')} → {new Date(b.returnDate).toLocaleDateString('en-IN')}</span>
                          <span>📍 {b.pickupLocation}</span>
                          <span>🗓 {b.totalDays} days</span>
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between', minWidth:120 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.1rem', fontWeight:600, color:'#171715' }}>₹{fmt(b.totalPrice)}</div>
                        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', justifyContent:'flex-end' }}>
                          <Link to={`/cars/${b.car?._id}`} style={{ fontSize:'.74rem', fontWeight:500, color:'#171715', padding:'.3rem .8rem', border:'1px solid #ebebea', borderRadius:6, textDecoration:'none', transition:'border-color .2s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#171715'} onMouseLeave={e=>e.currentTarget.style.borderColor='#ebebea'}>View Car</Link>
                          {canCancel&&<button onClick={()=>setCancelId(b._id)} style={{ fontSize:'.74rem', fontWeight:500, color:'#991b1b', padding:'.3rem .8rem', border:'1px solid #fecaca', borderRadius:6, background:'transparent', cursor:'pointer', transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#fee2e2'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Cancel</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'2rem', maxWidth:360, width:'100%', boxShadow:'0 24px 60px rgba(0,0,0,.18)', animation:'scaleIn .2s ease' }}>
            <div style={{ width:48, height:48, background:'#fef9c3', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', fontSize:'1.4rem' }}>⚠️</div>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.1rem', fontWeight:500, marginBottom:'.6rem', textAlign:'center' }}>Cancel booking?</h3>
            <p style={{ fontSize:'.85rem', color:'#6b6b69', lineHeight:1.7, marginBottom:'1.75rem', textAlign:'center' }}>Are you sure? This cannot be undone and any prepayment may not be refunded.</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
              <button onClick={()=>setCancelId(null)} disabled={cancelling} style={{ padding:'.85rem', border:'1px solid #ebebea', borderRadius:8, background:'transparent', fontSize:'.85rem', fontWeight:500, cursor:'pointer', transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#f7f7f5'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Keep It</button>
              <button onClick={handleCancel} disabled={cancelling} style={{ padding:'.85rem', border:'none', borderRadius:8, background:'#dc2626', color:'#fff', fontSize:'.85rem', fontWeight:500, cursor:'pointer', transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#b91c1c'} onMouseLeave={e=>e.currentTarget.style.background='#dc2626'}>{cancelling?'Cancelling…':'Yes, Cancel'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
