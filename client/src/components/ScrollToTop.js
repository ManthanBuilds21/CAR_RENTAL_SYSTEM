// ============================================================
//  ScrollToTop.js
//  Path: client/src/components/ScrollToTop.js
//  No changes needed — pure behavior component, no UI to restyle.
// ============================================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;