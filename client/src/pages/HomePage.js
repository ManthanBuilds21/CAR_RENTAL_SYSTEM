import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import carService from '../services/carService';

const HOW_STEPS = [
  { num: '01', title: 'Choose Your Car', desc: 'Browse our fleet and pick the car that fits your journey, budget, and style.', emoji: '🚗' },
  { num: '02', title: 'Book Instantly', desc: 'Select your dates, enter your details, and confirm your booking in minutes.', emoji: '📅' },
  { num: '03', title: 'Drive Away', desc: 'Pick up your vehicle or get it delivered. Enjoy the road with zero stress.', emoji: '🛣️' },
];
const BRANDS = ['Porsche','Mercedes-Benz','BMW','Audi','Tesla','Range Rover','Ferrari','Lamborghini','Rolls-Royce','Bentley'];

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [countedStats, setCountedStats] = useState([0, 0, 0, 0]);
  const statsRef = useRef(null);
  const statsCounted = useRef(false);

  useEffect(() => {
    carService.getFeaturedCars().then(d => setFeaturedCars(d.slice(0,3))).catch(console.error);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);} }), { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [featuredCars]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !statsCounted.current) {
        statsCounted.current = true;
        [[48,0],[12000,1],[4.9,2],[24,3]].forEach(([target, idx]) => {
          let v = 0; const step = target/45;
          const t = setInterval(() => {
            v += step; if(v >= target){v=target;clearInterval(t);}
            setCountedStats(p => { const c=[...p]; c[idx]=idx===2?parseFloat(v.toFixed(1)):Math.floor(v); return c; });
          }, 28);
        });
      }
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const displayStats = [
    { value: countedStats[0]+'+', label: 'Premium Cars' },
    { value: countedStats[1]>=1000 ? Math.floor(countedStats[1]/1000)+'K+' : countedStats[1], label: 'Happy Customers' },
    { value: countedStats[2]+'★', label: 'Average Rating' },
    { value: countedStats[3]+'/7', label: 'Support' },
  ];

  return (
    <div style={{ background: '#fff' }}>
      <style>{`
        @keyframes heroZoom{from{transform:scale(1.07)}to{transform:scale(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce2{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        @keyframes floatP{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes marqueeA{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes shimA{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        .stat-val{display:inline-block;transition:transform .25s}
        .stat-card-h:hover .stat-val{transform:scale(1.08)}
        .how-c{transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s,border-color .3s}
        .how-c:hover{transform:translateY(-7px)!important;box-shadow:0 24px 60px rgba(0,0,0,.1)!important;border-color:#d9d9d7!important}
        .feat-c{transition:transform .3s,box-shadow .3s,border-color .3s}
        .feat-c:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.08);border-color:#d9d9d7!important}
        @media(max-width:640px){.stats-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:680px){.how-g{grid-template-columns:1fr!important}}
        @media(max-width:900px){.cta-i{flex-direction:column!important;text-align:center!important}}
        @media(max-width:700px){.feat-g{grid-template-columns:1fr!important}}
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ position:'relative', height:'100vh', minHeight:640, display:'flex', flexDirection:'column', justifyContent:'flex-end', overflow:'hidden', background:'#0f0f0e' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&auto=format&fit=crop&q=85')", backgroundSize:'cover', backgroundPosition:'center 55%', opacity:.52, animation:'heroZoom 1.9s cubic-bezier(.4,0,.2,1) forwards' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(15,15,14,.96) 0%, rgba(15,15,14,.4) 55%, rgba(15,15,14,.1) 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(100deg, rgba(15,15,14,.4) 0%, transparent 60%)' }} />
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:'absolute', width:2+i, height:2+i, borderRadius:'50%', background:'rgba(255,255,255,.1)', left:`${10+i*16}%`, top:`${18+i*11}%`, animation:`floatP ${3+i*.8}s ease-in-out infinite`, animationDelay:`${i*.35}s` }} />
        ))}

        <div style={{ position:'relative', zIndex:2, padding:'0 2rem 6rem', maxWidth:1200, margin:'0 auto', width:'100%' }}>
          <p style={{ fontSize:'.7rem', fontWeight:500, letterSpacing:'.24em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginBottom:'1.25rem', animation:'fadeUp .7s ease .2s both' }}>✦ Premium Car Rental · India</p>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(2.8rem,7vw,5.8rem)', fontWeight:500, lineHeight:1.04, letterSpacing:'-.03em', color:'#fff', maxWidth:660, marginBottom:'1.75rem', animation:'fadeUp .85s ease .35s both' }}>
            The car you<br />want. When you<br />want it.
          </h1>
          <p style={{ fontSize:'1rem', color:'rgba(255,255,255,.5)', lineHeight:1.85, maxWidth:380, marginBottom:'2.5rem', animation:'fadeUp .85s ease .5s both' }}>
            Simple booking, transparent pricing, and a fleet of cars you'll actually want to drive.
          </p>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', animation:'fadeUp .85s ease .65s both' }}>
            <Link to="/cars" style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', background:'#fff', color:'#171715', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', fontWeight:500, padding:'.9rem 2rem', borderRadius:8, textDecoration:'none', transition:'background .25s, transform .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#f4f4f2';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.transform='none'}}
            >Browse Fleet <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
            <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(255,255,255,.1)', backdropFilter:'blur(10px)', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', fontWeight:400, padding:'.9rem 2rem', borderRadius:8, border:'1px solid rgba(255,255,255,.2)', textDecoration:'none', transition:'background .25s, transform .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.18)';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.1)';e.currentTarget.style.transform='none'}}
            >Create Account</Link>
          </div>

        </div>
        <div style={{ position:'absolute', bottom:'2rem', left:'50%', zIndex:2, animation:'bounce2 2.2s ease infinite' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* ══ BRAND MARQUEE ══ */}
      <div style={{ background:'#f7f7f5', borderBottom:'1px solid #ebebea', padding:'1.1rem 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marqueeA 20s linear infinite', width:'max-content', gap:'0' }}>
          {[...BRANDS,...BRANDS].map((b,i) => (
            <span key={i} style={{ fontSize:'.7rem', fontWeight:500, letterSpacing:'.14em', textTransform:'uppercase', color:'#a0a09e', padding:'0 2rem', borderRight:'1px solid #d9d9d7', whiteSpace:'nowrap' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <section style={{ background:'#fff', borderBottom:'1px solid #ebebea' }} ref={statsRef}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }} className="stats-g">
          {displayStats.map(({value,label},i) => (
            <div key={label} className="stat-card-h reveal" style={{ padding:'2.5rem 2rem', textAlign:'center', borderRight:i<3?'1px solid #ebebea':'none', transitionDelay:`${i*.08}s` }}>
              <div className="stat-val" style={{ fontFamily:"'Outfit',sans-serif", fontSize:'2.2rem', fontWeight:600, color:'#171715', letterSpacing:'-.02em' }}>{value}</div>
              <div style={{ fontSize:'.78rem', color:'#a0a09e', marginTop:'.4rem', fontWeight:500, letterSpacing:'.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURED CARS ══ */}
      <section style={{ padding:'6rem 0', background:'#fff' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'3rem', flexWrap:'wrap', gap:'1rem' }}>
            <div className="reveal">
              <p style={{ fontSize:'.72rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.5rem' }}>Our Fleet</p>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:500, letterSpacing:'-.025em', color:'#171715', lineHeight:1.15 }}>Popular Picks</h2>
              <p style={{ fontSize:'.88rem', color:'#6b6b69', marginTop:'.5rem' }}>Handpicked cars for every journey and budget.</p>
            </div>
            <Link to="/cars" className="reveal reveal-d2" style={{ fontSize:'.82rem', fontWeight:500, color:'#171715', display:'inline-flex', alignItems:'center', gap:'.4rem', borderBottom:'1px solid #171715', paddingBottom:'2px', textDecoration:'none', transition:'opacity .2s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='.55'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}
            >View all cars <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
          </div>

          {/* Warm card background */}
          <div style={{ background:'#fdf8f0', borderRadius:20, padding:'2.5rem', border:'1px solid #f0e8d8' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.5rem' }} className="feat-g">
              {featuredCars.length > 0
                ? featuredCars.map((car,i) => (
                    <div key={car._id} className={`reveal reveal-d${i+1}`}><CarCard car={car} /></div>
                  ))
                : [1,2,3].map(i => (
                    <div key={i} style={{ height:340, background:'#f7f7f5', borderRadius:16, position:'relative', overflow:'hidden' }}>
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.6) 50%,transparent 100%)', animation:'shimA 1.4s infinite' }} />
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUICK BOOKING ══ */}
      <section style={{ background:'#f7f7f5', borderTop:'1px solid #ebebea', borderBottom:'1px solid #ebebea', padding:'3rem 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.5rem', flexWrap:'wrap' }}>
          <div className="reveal">
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.4rem', fontWeight:500, letterSpacing:'-.02em' }}>Ready to drive?</h3>
            <p style={{ fontSize:'.88rem', color:'#6b6b69', marginTop:'.3rem' }}>Find your perfect car in under 60 seconds.</p>
          </div>
          <QuickBookingForm />
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding:'6rem 0', background:'#fff' }} id="how">
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
          <div className="reveal" style={{ marginBottom:'4rem', textAlign:'center' }}>
            <p style={{ fontSize:'.72rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.5rem' }}>The Process</p>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:500, letterSpacing:'-.025em', color:'#171715' }}>Renting a car<br />shouldn't be hard.</h2>
            <p style={{ fontSize:'.9rem', color:'#6b6b69', marginTop:'.75rem' }}>Three simple steps and you're on the road.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }} className="how-g">
            {HOW_STEPS.map(({num,title,desc,emoji},i) => (
              <div key={num} className={`reveal reveal-d${i+1} how-c`} style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:16, padding:'2.5rem 2rem', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', bottom:'-1.2rem', right:'1rem', fontFamily:"'Outfit',sans-serif", fontSize:'6rem', fontWeight:700, color:'#f4f4f2', lineHeight:1, userSelect:'none', zIndex:0 }}>{num}</div>
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ fontSize:'2rem', marginBottom:'1.2rem' }}>{emoji}</div>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.1rem', fontWeight:500, marginBottom:'.6rem', letterSpacing:'-.01em' }}>{title}</h3>
                  <p style={{ fontSize:'.86rem', color:'#6b6b69', lineHeight:1.8 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <section style={{ background:'#f7f7f5', borderTop:'1px solid #ebebea', borderBottom:'1px solid #ebebea', padding:'5rem 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontSize:'.72rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.5rem' }}>Why DriveWay</p>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:500, letterSpacing:'-.025em', color:'#171715' }}>Everything you expect,<br />and a lot more.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
            {[{icon:'🔒',t:'No hidden fees',d:'Transparent pricing on every booking.'},{icon:'⚡',t:'Instant booking',d:'Confirmed in under 2 minutes.'},{icon:'🛡️',t:'Fully insured',d:'All cars, all trips, fully covered.'},{icon:'📍',t:'Doorstep delivery',d:'We bring the car to you.'},{icon:'🔧',t:'24/7 Roadside',d:'Help whenever you need it.'},{icon:'💳',t:'Easy payments',d:'All major cards and UPI accepted.'}].map(({icon,t,d},i) => (
              <div key={t} className={`reveal feat-c reveal-d${(i%4)+1}`} style={{ background:'#fff', borderRadius:12, padding:'1.75rem 1.5rem', border:'1px solid #ebebea', textAlign:'center' }}>
                <div style={{ fontSize:'1.75rem', marginBottom:'.9rem' }}>{icon}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500, marginBottom:'.4rem' }}>{t}</div>
                <div style={{ fontSize:'.8rem', color:'#6b6b69', lineHeight:1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIAL ══ */}
      <section style={{ padding:'6rem 0', background:'#fff' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontSize:'.72rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.5rem' }}>Happy Customers</p>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:500, letterSpacing:'-.025em', color:'#171715' }}>What our customers say</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem' }}>
            {[{q:'"The most seamless car rental experience I\'ve ever had. No paperwork, no stress."',name:'Arjun S.',loc:'Mumbai'},{q:'"Booked a Porsche for my wedding and the car arrived spotless. Highly recommend DriveWay!"',name:'Priya M.',loc:'Bangalore'},{q:'"Amazing fleet and super transparent pricing. Will always use DriveWay for my trips."',name:'Rahul K.',loc:'Delhi'}].map(({q,name,loc},i) => (
              <div key={name} className={`reveal reveal-d${i+1}`} style={{ background:'#f7f7f5', borderRadius:14, padding:'2rem', border:'1px solid #ebebea', position:'relative' }}>
                <div style={{ fontSize:'2rem', color:'#d9d9d7', fontFamily:'Georgia,serif', lineHeight:1, marginBottom:'.75rem' }}>"</div>
                <p style={{ fontSize:'.88rem', color:'#3a3a38', lineHeight:1.8, marginBottom:'1.25rem' }}>{q}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'.65rem' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#171715', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:"'Outfit',sans-serif", fontSize:'.85rem', fontWeight:500 }}>{name[0]}</div>
                  <div><div style={{ fontSize:'.85rem', fontWeight:500, color:'#171715' }}>{name}</div><div style={{ fontSize:'.74rem', color:'#a0a09e' }}>{loc}</div></div>
                  <div style={{ marginLeft:'auto', fontSize:'.8rem', color:'#f59e0b' }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background:'#171715', padding:'5rem 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&auto=format&fit=crop&q=50')", backgroundSize:'cover', backgroundPosition:'center', opacity:.07 }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
          <div className="reveal cta-i" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'2rem', flexWrap:'wrap' }}>
            <div>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:500, color:'#fff', letterSpacing:'-.025em', marginBottom:'.75rem' }}>Start your journey today.</h2>
              <p style={{ fontSize:'.95rem', color:'rgba(255,255,255,.4)' }}>Join thousands of happy customers. No hidden fees. Ever.</p>
            </div>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <Link to="/cars" style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', background:'#fff', color:'#171715', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', fontWeight:500, padding:'.9rem 2.2rem', borderRadius:8, textDecoration:'none', transition:'background .25s, transform .2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='#f4f4f2';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.transform='none'}}
              >Browse All Cars <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
              <Link to="/register" style={{ display:'inline-flex', alignItems:'center', background:'transparent', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'.85rem', fontWeight:400, padding:'.9rem 2rem', borderRadius:8, border:'1px solid rgba(255,255,255,.22)', textDecoration:'none', transition:'background .25s, transform .2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.1)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.transform='none'}}
              >Sign Up Free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const QuickBookingForm = () => {
  const [form, setForm] = React.useState({ type:'', pickup:'', dropoff:'' });
  const inp = { background:'#fff', border:'1px solid #ebebea', borderRadius:8, padding:'.7rem 1rem', fontSize:'.85rem', color:'#171715', outline:'none', fontFamily:"'DM Sans',sans-serif", transition:'border-color .25s', minWidth:140 };
  const foc = e => e.target.style.borderColor='#171715';
  const blr = e => e.target.style.borderColor='#ebebea';
  return (
    <div className="reveal reveal-d2" style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', alignItems:'center' }}>
      <select style={inp} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} onFocus={foc} onBlur={blr}>
        <option value="">Car Type</option><option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Luxury</option>
      </select>
      <input type="date" style={inp} value={form.pickup} onChange={e=>setForm(f=>({...f,pickup:e.target.value}))} onFocus={foc} onBlur={blr} />
      <input type="date" style={inp} value={form.dropoff} onChange={e=>setForm(f=>({...f,dropoff:e.target.value}))} onFocus={foc} onBlur={blr} />
      <Link to={`/cars${form.type?`?type=${form.type}`:''}`} style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'#171715', color:'#fff', fontSize:'.82rem', fontWeight:500, padding:'.75rem 1.5rem', borderRadius:8, textDecoration:'none', whiteSpace:'nowrap', transition:'background .25s, transform .2s' }}
        onMouseEnter={e=>{e.currentTarget.style.background='#3a3a38';e.currentTarget.style.transform='translateY(-1px)'}}
        onMouseLeave={e=>{e.currentTarget.style.background='#171715';e.currentTarget.style.transform='none'}}
      >Search <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
    </div>
  );
};
export default HomePage;