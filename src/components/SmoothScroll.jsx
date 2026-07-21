import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useLocation, useNavigationType } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();
  const navigationType = useNavigationType();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Scroll to top on every route change except when going back (POP)
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [location.pathname, location.search, navigationType]);

  useEffect(() => {
    // Skip smooth scroll for admin panel and mobile devices (causes lag)
    if (isAdminPath || isMobile) return;

    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdminPath, isMobile]);

  return <div>{children}</div>;
};

export default SmoothScroll;

