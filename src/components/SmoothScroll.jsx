import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useLocation } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
    };
  }, [isAdminPath, isMobile]);

  return <div>{children}</div>;
};

export default SmoothScroll;

