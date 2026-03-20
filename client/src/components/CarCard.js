import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  const [hovered, setHovered] = useState(false);
  const { _id, brand='Brand', model='Model', type='Sedan', pricePerDay=0, seats=5, transmission='Automatic', fuelType='Petrol', image, available=true, year } = car || {};

  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:'#fff', border:'1px solid', borderColor:hovered?'#d9d9d7':'#ebebea', borderRadius:16, overflow:'hidden', transition:'border-color .3s,box-shadow .35s,transform .35s cubic-bezier(.4,0,.2,1)', transform:hovered?'translateY(-5px)':'none', boxShadow:hovered?'0 16px 48px rgba(0,0,0,.1)':'0 1px 4px rgba(0,0,0,.05)', display:'flex', flexDirection:'column' }}
    >
      {/* Image */}
      <div style={{ position:'relative', overflow:'hidden', aspectRatio:'16/10', background:'#f4f4f2' }}>
        <img src={image||'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'} alt={`${brand} ${model}`}
          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .6s cubic-bezier(.4,0,.2,1)', transform:hovered?'scale(1.06)':'scale(1)' }}
          onError={e=>{e.target.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80';}}
        />
        {/* Gradient overlay on hover */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.15) 0%, transparent 50%)', opacity:hovered?1:0, transition:'opacity .35s' }} />
        <span style={{ position:'absolute', top:'1rem', left:'1rem', background:'rgba(255,255,255,.92)', backdropFilter:'blur(8px)', fontSize:'.66rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#3a3a38', padding:'.3rem .75rem', borderRadius:20 }}>{type}</span>
        {!available&&<span style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(0,0,0,.72)', color:'#fff', fontSize:'.66rem', fontWeight:500, padding:'.3rem .75rem', borderRadius:20 }}>Unavailable</span>}
      </div>

      {/* Body */}
      <div style={{ padding:'1.4rem 1.5rem 1.6rem', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ marginBottom:'.25rem', fontSize:'.7rem', fontWeight:500, color:'#a0a09e', letterSpacing:'.08em', textTransform:'uppercase' }}>{brand}{year&&` · ${year}`}</div>
        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.2rem', fontWeight:500, color:'#171715', marginBottom:'1rem', letterSpacing:'-.01em', transition:'color .2s' }}>{model}</div>

        {/* Specs */}
        <div style={{ display:'flex', gap:'1.1rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          {[{icon:'👤',val:`${seats} Seats`},{icon:'⚙️',val:transmission},{icon:'⛽',val:fuelType}].map(({icon,val})=>(
            <div key={val} style={{ display:'flex', alignItems:'center', gap:'.3rem', fontSize:'.76rem', color:'#6b6b69' }}>
              <span style={{ fontSize:'.78rem' }}>{icon}</span>{val}
            </div>
          ))}
        </div>

        <div style={{ height:1, background:'#f4f4f2', margin:'0 0 1.25rem' }} />

        {/* Price + CTA */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
          <div>
            <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.3rem', fontWeight:600, color:'#171715' }}>₹{pricePerDay.toLocaleString()}</span>
            <span style={{ fontSize:'.76rem', color:'#a0a09e', marginLeft:'.3rem' }}>/day</span>
          </div>
          <Link to={available?`/cars/${_id}`:'#'} style={{ fontSize:'.78rem', fontWeight:500, background:available?'#171715':'#d9d9d7', color:'#fff', padding:'.62rem 1.3rem', borderRadius:8, pointerEvents:available?'auto':'none', transition:'background .25s, transform .2s', display:'inline-block' }}
            onMouseEnter={e=>available&&(e.currentTarget.style.background='#3a3a38')}
            onMouseLeave={e=>available&&(e.currentTarget.style.background='#171715')}
          >{available?'View Details':'Booked'}</Link>
        </div>
      </div>
    </div>
  );
};
export default CarCard;
