import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const linkStyle = { fontSize: '.84rem', color: '#6b6b69', transition: 'color .2s', cursor: 'pointer', display: 'block' };
  const hov = e => e.target.style.color = '#171715';
  const unHov = e => e.target.style.color = '#6b6b69';

  return (
    <footer style={{ background: '#f7f7f5', borderTop: '1px solid #ebebea' }}>
      {/* Top CTA Bar */}
      <div style={{ background: '#171715', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.15rem', fontWeight: 500, color: '#fff', letterSpacing: '-.015em', marginBottom: '.3rem' }}>Ready for your next drive?</p>
            <p style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.45)' }}>Browse our fleet and book in minutes.</p>
          </div>
          <Link to="/cars" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: '#fff', color: '#171715', fontSize: '.82rem', fontWeight: 500, padding: '.75rem 1.75rem', borderRadius: 8, transition: 'background .2s, transform .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f2'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
          >
            Browse Fleet
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3.5rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }} className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.3rem', fontWeight: 600, color: '#171715', letterSpacing: '-.02em', display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#6b6b69' }}>
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
              </svg>
              Drive<span style={{ fontWeight: 300 }}>Way</span>
            </Link>
            <p style={{ fontSize: '.85rem', color: '#6b6b69', lineHeight: 1.8, maxWidth: 240, marginBottom: '1.5rem' }}>
              Simple, transparent car rental for modern India. No hidden fees, ever.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '.65rem' }}>
              {['twitter', 'instagram', 'linkedin'].map(s => (
                <a key={s} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: '#ebebea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6b69', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#171715'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#ebebea'; e.currentTarget.style.color = '#6b6b69'; }}
                >
                  {s === 'twitter' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                  {s === 'instagram' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>}
                  {s === 'linkedin' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>}
                </a>
              ))}
            </div>
          </div>

          {/* Fleet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a0a09e', marginBottom: '.25rem' }}>Fleet</div>
            {['Sedans', 'SUVs', 'Sports Cars', 'Electric', 'Luxury'].map(item => (
              <Link key={item} to="/cars" style={linkStyle} onMouseEnter={hov} onMouseLeave={unHov}>{item}</Link>
            ))}
          </div>

          {/* Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a0a09e', marginBottom: '.25rem' }}>Company</div>
            {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map(item => (
              <a key={item} href="#" style={linkStyle} onMouseEnter={hov} onMouseLeave={unHov}>{item}</a>
            ))}
          </div>

          {/* Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a0a09e', marginBottom: '.25rem' }}>Support</div>
            {['Help Center', 'Cancellation Policy', 'Insurance Info', 'Terms & Privacy', 'FAQ'].map(item => (
              <a key={item} href="#" style={linkStyle} onMouseEnter={hov} onMouseLeave={unHov}>{item}</a>
            ))}
          </div>
        </div>

        {/* Contact info strip */}
        <div style={{ background: '#fff', border: '1px solid #ebebea', borderRadius: 10, padding: '1rem 1.5rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { icon: '📧', label: 'Email', val: 'hello@driveway.in' },
            { icon: '📞', label: 'Phone', val: '+91 98765 43210' },
            { icon: '🕐', label: 'Hours', val: '24/7 Support Available' },
          ].map(({ icon, label, val }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '.68rem', color: '#a0a09e', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
                <div style={{ fontSize: '.82rem', color: '#171715', fontWeight: 500 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #ebebea', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '.78rem', color: '#a0a09e' }}>© 2025 DriveWay. All rights reserved. Made with ♥ in India.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map(item => (
              <a key={item} href="#" style={{ fontSize: '.78rem', color: '#a0a09e', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = '#171715'}
                onMouseLeave={e => e.target.style.color = '#a0a09e'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){ .footer-grid{grid-template-columns:1fr 1fr!important;gap:2rem!important;} }
        @media(max-width:480px){ .footer-grid{grid-template-columns:1fr!important;} }
      `}</style>
    </footer>
  );
};
export default Footer;
