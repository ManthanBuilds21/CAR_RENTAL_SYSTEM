import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/carService';
import bookingService from '../services/bookingService';

const fmt = n => Number(n||0).toLocaleString('en-IN');
const ago = d => { const s=Math.floor((Date.now()-new Date(d))/1000); if(s<60)return 'just now'; if(s<3600)return `${Math.floor(s/60)}m ago`; if(s<86400)return `${Math.floor(s/3600)}h ago`; return `${Math.floor(s/86400)}d ago`; };
const sc = s => ({pending:{bg:'#fef9c3',color:'#854d0e'},confirmed:{bg:'#dbeafe',color:'#1e40af'},active:{bg:'#dcfce7',color:'#166534'},completed:{bg:'#f1f5f9',color:'#475569'},cancelled:{bg:'#fee2e2',color:'#991b1b'}}[s]||{bg:'#f1f5f9',color:'#475569'});

const AdminDashboardPage = () => {
  const [tab, setTab] = useState('overview');
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  useEffect(() => {
    Promise.all([carService.getCars({ limit:100 }), bookingService.getAllBookings({ limit:100 })])
      .then(([cd, bd]) => { setCars(cd.data||[]); setBookings(bd.data||[]); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await carService.deleteCar(deleteId); setCars(p=>p.filter(c=>c._id!==deleteId)); }
    catch(e){ console.error(e); } finally { setDeleting(false); setDeleteId(null); }
  };
  const toggleAvail = async (id, cur) => {
    try { await carService.updateCar(id,{available:!cur}); setCars(p=>p.map(c=>c._id===id?{...c,available:!c.available}:c)); } catch(e){ console.error(e); }
  };
  const handleStatus = async (id, status) => {
    try { await bookingService.updateBookingStatus(id,status); setBookings(p=>p.map(b=>b._id===id?{...b,status}:b)); } catch(e){ console.error(e); }
  };

  const filteredCars = cars.filter(c=>`${c.brand} ${c.model} ${c.type}`.toLowerCase().includes(search.toLowerCase()));
  const filteredBookings = bookings.filter(b=>`${b.user?.name||''} ${b.user?.email||''} ${b.car?.brand||''} ${b.car?.model||''}`.toLowerCase().includes(bookingSearch.toLowerCase()));

  const revenue = bookings.filter(b=>b.status!=='cancelled').reduce((s,b)=>s+(b.totalPrice||0),0);
  const stats = [
    { label:'Total Cars', value:cars.length, sub:`${cars.filter(c=>c.available).length} available`, icon:<CarIcon/>, color:'#dbeafe', icolor:'#1e40af' },
    { label:'Total Bookings', value:bookings.length, sub:`${bookings.filter(b=>b.status==='pending').length} pending`, icon:<BookIcon/>, color:'#fef9c3', icolor:'#854d0e' },
    { label:'Active Rentals', value:bookings.filter(b=>b.status==='active').length, sub:'On road right now', icon:<KeyIcon/>, color:'#dcfce7', icolor:'#166534' },
    { label:'Total Revenue', value:`₹${fmt(revenue)}`, sub:'Excluding cancelled', icon:<MoneyIcon/>, color:'#f3e8ff', icolor:'#7c3aed' },
  ];

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7f5', paddingTop:72, flexDirection:'column', gap:'1rem' }}>
      <div style={{ width:36, height:36, border:'2px solid #ebebea', borderTopColor:'#171715', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      <p style={{ color:'#a0a09e', fontSize:'.85rem' }}>Loading dashboard…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f7f7f5', paddingTop:72 }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        .admin-row{transition:background .15s} .admin-row:hover{background:#fafaf9!important}
        .stat-c{transition:box-shadow .25s,transform .25s} .stat-c:hover{box-shadow:0 8px 28px rgba(0,0,0,.09);transform:translateY(-2px)}
        .action-btn{transition:all .2s} .action-btn:hover{transform:translateY(-1px)}
        @media(max-width:900px){.stats-row{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.stats-row{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebea' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'1.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontSize:'.7rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.2rem' }}>Admin Panel</p>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.5rem', fontWeight:500, letterSpacing:'-.02em', color:'#171715', display:'flex', alignItems:'center', gap:'.6rem' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#16a34a', display:'inline-block', boxShadow:'0 0 0 3px rgba(22,163,74,.2)' }} />
              Dashboard
            </h1>
          </div>
          <Link to="/admin/cars/new" style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'#171715', color:'#fff', fontSize:'.82rem', fontWeight:500, padding:'.72rem 1.5rem', borderRadius:8, textDecoration:'none', transition:'background .25s, transform .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#3a3a38';e.currentTarget.style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='#171715';e.currentTarget.style.transform='none'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Car
          </Link>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'2rem' }}>

        {/* ── Stats ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem', animation:'slideIn .4s ease' }} className="stats-row">
          {stats.map(({label,value,sub,icon,color,icolor}) => (
            <div key={label} className="stat-c" style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'.9rem' }}>
                <div style={{ width:40, height:40, background:color, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:icolor }}>{icon}</div>
                <span style={{ fontSize:'.7rem', color:'#a0a09e', background:'#f7f7f5', padding:'.2rem .65rem', borderRadius:20, whiteSpace:'nowrap' }}>{sub}</span>
              </div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.7rem', fontWeight:600, letterSpacing:'-.02em', color:'#171715', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:'.78rem', color:'#a0a09e', marginTop:'.35rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display:'flex', gap:'.25rem', background:'#f7f7f5', border:'1px solid #ebebea', borderRadius:10, padding:'.25rem', width:'fit-content', marginBottom:'1.5rem' }}>
          {[['overview','📊  Overview'],['cars','🚗  Cars'],['bookings','📋  Bookings']].map(([key,label]) => (
            <button key={key} onClick={()=>setTab(key)} style={{ padding:'.55rem 1.4rem', borderRadius:8, border:'none', cursor:'pointer', fontSize:'.82rem', fontWeight:500, fontFamily:"'DM Sans',sans-serif", background:tab===key?'#fff':'transparent', color:tab===key?'#171715':'#a0a09e', boxShadow:tab===key?'0 1px 4px rgba(0,0,0,.08)':'none', transition:'all .2s' }}>{label}</button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', animation:'slideIn .35s ease' }} className="overview-grid">
            {/* Recent Bookings */}
            <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, overflow:'hidden', gridColumn:'1/-1' }}>
              <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #ebebea', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500 }}>Recent Bookings</h2>
                <button onClick={()=>setTab('bookings')} style={{ fontSize:'.78rem', color:'#171715', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>View all →</button>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.84rem' }}>
                  <thead><tr style={{ background:'#f7f7f5' }}>
                    {['Customer','Car','Total','Status','When'].map(h=>(
                      <th key={h} style={{ padding:'.7rem 1.25rem', textAlign:'left', fontSize:'.68rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#a0a09e', borderBottom:'1px solid #ebebea', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {bookings.slice(0,6).map((b,i)=>{
                      const s=sc(b.status);
                      return (
                        <tr key={b._id} className="admin-row" style={{ borderBottom:i<5?'1px solid #f7f7f5':'none' }}>
                          <td style={{ padding:'.9rem 1.25rem' }}><div style={{ fontWeight:500, color:'#171715', fontSize:'.84rem' }}>{b.user?.name}</div><div style={{ fontSize:'.72rem', color:'#a0a09e' }}>{b.user?.email}</div></td>
                          <td style={{ padding:'.9rem 1.25rem', color:'#6b6b69' }}>{b.car?.brand} {b.car?.model}</td>
                          <td style={{ padding:'.9rem 1.25rem', fontWeight:500, fontFamily:"'Outfit',sans-serif", color:'#171715' }}>₹{fmt(b.totalPrice)}</td>
                          <td style={{ padding:'.9rem 1.25rem' }}><span style={{ padding:'.28rem .75rem', borderRadius:20, fontSize:'.72rem', fontWeight:500, background:s.bg, color:s.color, textTransform:'capitalize' }}>{b.status}</span></td>
                          <td style={{ padding:'.9rem 1.25rem', color:'#a0a09e', fontSize:'.78rem' }}>{ago(b.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Car availability breakdown */}
            <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem' }}>Fleet Status</h3>
              {[['Available',cars.filter(c=>c.available).length,'#16a34a','#dcfce7'],['Unavailable',cars.filter(c=>!c.available).length,'#991b1b','#fee2e2']].map(([label,count,color,bg])=>(
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.75rem 0', borderBottom:'1px solid #f7f7f5' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}><span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }} /><span style={{ fontSize:'.85rem', color:'#3a3a38' }}>{label}</span></div>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, color:'#171715', background:bg, padding:'.2rem .75rem', borderRadius:20, fontSize:'.82rem' }}>{count}</span>
                </div>
              ))}
              <div style={{ marginTop:'1rem' }}>
                <div style={{ height:8, borderRadius:4, background:'#f4f4f2', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#16a34a', borderRadius:4, width:`${cars.length?Math.round(cars.filter(c=>c.available).length/cars.length*100):0}%`, transition:'width .8s ease' }} />
                </div>
                <p style={{ fontSize:'.74rem', color:'#a0a09e', marginTop:'.5rem' }}>{cars.length?Math.round(cars.filter(c=>c.available).length/cars.length*100):0}% of fleet available</p>
              </div>
            </div>

            {/* Booking status breakdown */}
            <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, padding:'1.5rem' }}>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, marginBottom:'1.25rem' }}>Booking Breakdown</h3>
              {[['Pending','pending','#854d0e','#fef9c3'],['Confirmed','confirmed','#1e40af','#dbeafe'],['Active','active','#166534','#dcfce7'],['Completed','completed','#475569','#f1f5f9'],['Cancelled','cancelled','#991b1b','#fee2e2']].map(([label,key,color,bg])=>{
                const cnt=bookings.filter(b=>b.status===key).length;
                return (
                  <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.65rem 0', borderBottom:'1px solid #f7f7f5' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}><span style={{ width:8, height:8, borderRadius:'50%', background:color }} /><span style={{ fontSize:'.84rem', color:'#3a3a38' }}>{label}</span></div>
                    <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, color, background:bg, padding:'.2rem .75rem', borderRadius:20, fontSize:'.8rem' }}>{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CARS TAB ── */}
        {tab === 'cars' && (
          <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, overflow:'hidden', animation:'slideIn .35s ease' }}>
            <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #ebebea', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500 }}>All Cars <span style={{ fontSize:'.82rem', color:'#a0a09e', fontWeight:400 }}>({filteredCars.length})</span></h2>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#a0a09e' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cars…" style={{ paddingLeft:32, paddingRight:12, height:36, border:'1px solid #ebebea', borderRadius:8, fontSize:'.84rem', outline:'none', fontFamily:"'DM Sans',sans-serif", color:'#171715', width:220, transition:'border-color .25s' }} onFocus={e=>e.target.style.borderColor='#171715'} onBlur={e=>e.target.style.borderColor='#ebebea'} />
              </div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.85rem' }}>
                <thead><tr style={{ background:'#f7f7f5' }}>
                  {['Car','Type','Price/Day','Fuel','Seats','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'.75rem 1.25rem', textAlign:'left', fontSize:'.68rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#a0a09e', whiteSpace:'nowrap', borderBottom:'1px solid #ebebea' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredCars.map((car,i)=>(
                    <tr key={car._id} className="admin-row" style={{ borderBottom:i<filteredCars.length-1?'1px solid #f7f7f5':'none' }}>
                      <td style={{ padding:'1rem 1.25rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'.85rem' }}>
                          <div style={{ width:58, height:42, borderRadius:8, overflow:'hidden', background:'#f4f4f2', flexShrink:0 }}>
                            <img src={car.image} alt={car.model} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
                          </div>
                          <div><div style={{ fontWeight:500, color:'#171715', fontSize:'.88rem' }}>{car.brand} {car.model}</div><div style={{ fontSize:'.72rem', color:'#a0a09e' }}>{car.year} · {car.type}</div></div>
                        </div>
                      </td>
                      <td style={{ padding:'1rem 1.25rem', color:'#6b6b69', fontSize:'.84rem' }}>{car.type}</td>
                      <td style={{ padding:'1rem 1.25rem', fontWeight:600, color:'#171715', fontFamily:"'Outfit',sans-serif", fontSize:'.9rem' }}>₹{fmt(car.pricePerDay)}</td>
                      <td style={{ padding:'1rem 1.25rem', color:'#6b6b69', fontSize:'.84rem' }}>{car.fuelType}</td>
                      <td style={{ padding:'1rem 1.25rem', color:'#6b6b69', fontSize:'.84rem' }}>{car.seats}</td>
                      <td style={{ padding:'1rem 1.25rem' }}>
                        <button onClick={()=>toggleAvail(car._id,car.available)} style={{ padding:'.28rem .85rem', borderRadius:20, border:'none', cursor:'pointer', fontSize:'.72rem', fontWeight:500, background:car.available?'#dcfce7':'#fee2e2', color:car.available?'#166534':'#991b1b', transition:'all .2s', display:'flex', alignItems:'center', gap:'.3rem' }}>
                          <span style={{ width:6, height:6, borderRadius:'50%', background:car.available?'#16a34a':'#dc2626', display:'inline-block' }} />
                          {car.available?'Available':'Unavailable'}
                        </button>
                      </td>
                      <td style={{ padding:'1rem 1.25rem' }}>
                        <div style={{ display:'flex', gap:'.5rem' }}>
                          <Link to={`/admin/cars/${car._id}/edit`} className="action-btn" style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', fontSize:'.76rem', fontWeight:500, color:'#171715', padding:'.35rem .85rem', border:'1px solid #ebebea', borderRadius:6, textDecoration:'none', transition:'all .2s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#171715'} onMouseLeave={e=>e.currentTarget.style.borderColor='#ebebea'}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit
                          </Link>
                          <button onClick={()=>setDeleteId(car._id)} className="action-btn" style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', fontSize:'.76rem', fontWeight:500, color:'#991b1b', padding:'.35rem .85rem', border:'1px solid #fecaca', borderRadius:6, background:'transparent', cursor:'pointer', transition:'all .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#fee2e2'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCars.length===0&&<div style={{ textAlign:'center', padding:'3rem', color:'#a0a09e', fontSize:'.88rem' }}>{search?`No cars found matching "${search}"`:'No cars in the fleet yet.'}</div>}
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, overflow:'hidden', animation:'slideIn .35s ease' }}>
            <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #ebebea', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500 }}>All Bookings <span style={{ fontSize:'.82rem', color:'#a0a09e', fontWeight:400 }}>({filteredBookings.length})</span></h2>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#a0a09e' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input value={bookingSearch} onChange={e=>setBookingSearch(e.target.value)} placeholder="Search bookings…" style={{ paddingLeft:32, paddingRight:12, height:36, border:'1px solid #ebebea', borderRadius:8, fontSize:'.84rem', outline:'none', fontFamily:"'DM Sans',sans-serif", color:'#171715', width:220, transition:'border-color .25s' }} onFocus={e=>e.target.style.borderColor='#171715'} onBlur={e=>e.target.style.borderColor='#ebebea'} />
              </div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.85rem' }}>
                <thead><tr style={{ background:'#f7f7f5' }}>
                  {['Customer','Car','Dates','Total','Status','Booked','Actions'].map(h=>(
                    <th key={h} style={{ padding:'.75rem 1.25rem', textAlign:'left', fontSize:'.68rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#a0a09e', whiteSpace:'nowrap', borderBottom:'1px solid #ebebea' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredBookings.map((b,i)=>{
                    const s=sc(b.status);
                    return (
                      <tr key={b._id} className="admin-row" style={{ borderBottom:i<filteredBookings.length-1?'1px solid #f7f7f5':'none' }}>
                        <td style={{ padding:'1rem 1.25rem' }}><div style={{ fontWeight:500, color:'#171715', fontSize:'.88rem' }}>{b.user?.name}</div><div style={{ fontSize:'.72rem', color:'#a0a09e' }}>{b.user?.email}</div></td>
                        <td style={{ padding:'1rem 1.25rem' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
                            <div style={{ width:40, height:28, borderRadius:4, overflow:'hidden', background:'#f4f4f2', flexShrink:0 }}>
                              <img src={b.car?.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
                            </div>
                            <span style={{ color:'#6b6b69', fontSize:'.84rem' }}>{b.car?.brand} {b.car?.model}</span>
                          </div>
                        </td>
                        <td style={{ padding:'1rem 1.25rem', color:'#6b6b69', fontSize:'.8rem', whiteSpace:'nowrap' }}>{new Date(b.pickupDate).toLocaleDateString('en-IN')} → {new Date(b.returnDate).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding:'1rem 1.25rem', fontWeight:600, color:'#171715', fontFamily:"'Outfit',sans-serif" }}>₹{fmt(b.totalPrice)}</td>
                        <td style={{ padding:'1rem 1.25rem' }}><span style={{ padding:'.28rem .8rem', borderRadius:20, fontSize:'.72rem', fontWeight:500, background:s.bg, color:s.color, textTransform:'capitalize', display:'inline-flex', alignItems:'center', gap:'.3rem' }}><span style={{ width:5, height:5, borderRadius:'50%', background:s.color, display:'inline-block' }} />{b.status}</span></td>
                        <td style={{ padding:'1rem 1.25rem', color:'#a0a09e', fontSize:'.8rem' }}>{ago(b.createdAt)}</td>
                        <td style={{ padding:'1rem 1.25rem' }}>
                          <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
                            {b.status==='pending'&&<button onClick={()=>handleStatus(b._id,'confirmed')} style={{ fontSize:'.72rem', fontWeight:500, color:'#166534', padding:'.28rem .7rem', border:'1px solid #bbf7d0', borderRadius:6, background:'transparent', cursor:'pointer', transition:'all .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#dcfce7'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Confirm</button>}
                            {['pending','confirmed'].includes(b.status)&&<button onClick={()=>handleStatus(b._id,'cancelled')} style={{ fontSize:'.72rem', fontWeight:500, color:'#991b1b', padding:'.28rem .7rem', border:'1px solid #fecaca', borderRadius:6, background:'transparent', cursor:'pointer', transition:'all .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#fee2e2'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Cancel</button>}
                            {b.status==='active'&&<button onClick={()=>handleStatus(b._id,'completed')} style={{ fontSize:'.72rem', fontWeight:500, color:'#1e40af', padding:'.28rem .7rem', border:'1px solid #bfdbfe', borderRadius:6, background:'transparent', cursor:'pointer', transition:'all .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#dbeafe'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Complete</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredBookings.length===0&&<div style={{ textAlign:'center', padding:'3rem', color:'#a0a09e', fontSize:'.88rem' }}>No bookings found.</div>}
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {deleteId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'2rem', maxWidth:380, width:'100%', boxShadow:'0 24px 60px rgba(0,0,0,.18)', animation:'scaleIn .2s ease' }}>
            <div style={{ width:48, height:48, background:'#fee2e2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.1rem', fontWeight:500, textAlign:'center', marginBottom:'.6rem' }}>Delete this car?</h3>
            <p style={{ fontSize:'.85rem', color:'#6b6b69', textAlign:'center', lineHeight:1.7, marginBottom:'1.75rem' }}>This action cannot be undone. The car will be permanently removed from your fleet.</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
              <button onClick={()=>setDeleteId(null)} disabled={deleting} style={{ padding:'.85rem', border:'1px solid #ebebea', borderRadius:8, background:'transparent', fontSize:'.85rem', fontWeight:500, cursor:'pointer', transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#f7f7f5'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ padding:'.85rem', border:'none', borderRadius:8, background:'#dc2626', color:'#fff', fontSize:'.85rem', fontWeight:500, cursor:'pointer', transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='#b91c1c'} onMouseLeave={e=>e.currentTarget.style.background='#dc2626'}>
                {deleting?'Deleting…':'Delete Car'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@media(max-width:900px){.overview-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

const CarIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const BookIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const KeyIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const MoneyIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
export default AdminDashboardPage;
