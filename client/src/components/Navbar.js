import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const transparent = !scrolled && isHome;
  const logoColor = transparent ? '#fff' : '#171715';
  const linkColor = transparent ? 'rgba(255,255,255,.8)' : '#6b6b69';
  const linkHover = transparent ? '#fff' : '#171715';

  const handleHowItWorks = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('how');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById('how');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 200,
      padding: scrolled ? '.9rem 0' : '1.4rem 0',
      background: transparent ? 'transparent' : 'rgba(255,255,255,.97)',
      backdropFilter: transparent ? 'none' : 'blur(20px)',
      WebkitBackdropFilter: transparent ? 'none' : 'blur(20px)',
      borderBottom: transparent ? 'none' : '1px solid rgba(235,235,234,.8)',
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.35rem', fontWeight: 600, color: logoColor, letterSpacing: '-.02em', transition: 'color .3s', flexShrink: 0, textDecoration: 'none' }}>
          Drive<span style={{ fontWeight: 300 }}>Way</span>
        </Link>

        {/* Desktop Links */}
        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center' }} className="nav-desktop">
          <li>
            <Link to="/cars"
              style={{ fontSize: '.85rem', fontWeight: 400, color: linkColor, transition: 'color .25s', letterSpacing: '.01em', position: 'relative', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = linkHover}
              onMouseLeave={e => e.target.style.color = linkColor}
            >Cars</Link>
          </li>
          <li>
            <a
              href="#how"
              onClick={handleHowItWorks}
              style={{ fontSize: '.85rem', fontWeight: 400, color: linkColor, transition: 'color .25s', letterSpacing: '.01em', position: 'relative', textDecoration: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = linkHover}
              onMouseLeave={e => e.target.style.color = linkColor}
            >How it Works</a>
          </li>
        </ul>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
                style={{ fontSize: '.82rem', fontWeight: 500, color: linkColor, transition: 'color .25s', display: 'flex', alignItems: 'center', gap: '.35rem', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = linkHover}
                onMouseLeave={e => e.currentTarget.style.color = linkColor}
              >
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: transparent ? 'rgba(255,255,255,.2)' : '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 600, color: transparent ? '#fff' : '#171715' }}>
                  {(user.name || 'U')[0].toUpperCase()}
                </span>
                {user.name?.split(' ')[0]}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ fontSize: '.78rem', fontWeight: 500, color: transparent ? 'rgba(255,255,255,.7)' : '#6b6b69', background: transparent ? 'rgba(255,255,255,.1)' : '#f4f4f2', padding: '.4rem .9rem', borderRadius: 6, transition: 'all .2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = transparent ? 'rgba(255,255,255,.2)' : '#ebebea'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = transparent ? 'rgba(255,255,255,.1)' : '#f4f4f2'; }}
                >Admin</Link>
              )}
              <button onClick={handleLogout} style={{ fontSize: '.8rem', fontWeight: 500, background: transparent ? 'rgba(255,255,255,.12)' : '#171715', color: '#fff', padding: '.6rem 1.4rem', border: transparent ? '1px solid rgba(255,255,255,.25)' : 'none', borderRadius: 6, cursor: 'pointer', transition: 'all .25s', backdropFilter: 'blur(8px)' }}
                onMouseEnter={e => e.currentTarget.style.background = transparent ? 'rgba(255,255,255,.22)' : '#3a3a38'}
                onMouseLeave={e => e.currentTarget.style.background = transparent ? 'rgba(255,255,255,.12)' : '#171715'}
              >Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '.82rem', fontWeight: 400, color: linkColor, transition: 'color .25s', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = linkHover}
                onMouseLeave={e => e.target.style.color = linkColor}
              >Sign In</Link>
              <Link to="/register" style={{ fontSize: '.82rem', fontWeight: 500, background: transparent ? 'rgba(255,255,255,.12)' : '#171715', color: '#fff', padding: '.65rem 1.4rem', borderRadius: 6, border: transparent ? '1px solid rgba(255,255,255,.25)' : 'none', backdropFilter: 'blur(8px)', transition: 'all .25s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = transparent ? 'rgba(255,255,255,.22)' : '#3a3a38'}
                onMouseLeave={e => e.currentTarget.style.background = transparent ? 'rgba(255,255,255,.12)' : '#171715'}
              >Get Started</Link>
            </>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: logoColor }} className="hamburger" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #ebebea', padding: '1.25rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', animation: 'slideDown .2s ease' }}>
          <Link to="/cars" style={{ fontSize: '.9rem', color: '#3a3a38', fontWeight: 400, textDecoration: 'none' }}>Cars</Link>
          <a
            href="#how"
            onClick={handleHowItWorks}
            style={{ fontSize: '.9rem', color: '#3a3a38', fontWeight: 400, textDecoration: 'none', cursor: 'pointer' }}
          >How it Works</a>
          <hr style={{ border: 'none', borderTop: '1px solid #ebebea' }} />
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ fontSize: '.9rem', color: '#3a3a38', textDecoration: 'none' }}>
                {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
              </Link>
              <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '.9rem', color: '#dc2626', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '.9rem', color: '#3a3a38', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/register" style={{ fontSize: '.9rem', color: '#171715', fontWeight: 500, textDecoration: 'none' }}>Get Started →</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:768px){ .nav-desktop{display:none!important;} .hamburger{display:block!important;} }
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
      `}</style>
    </nav>
  );
};

export default Navbar;