import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[4px] sm:h-[5px] z-[99999] pointer-events-none overflow-hidden bg-transparent">
      <div 
        className={`h-full w-full bg-gradient-to-r from-green-500 via-[#d4af37] to-yellow-400 shadow-[0_0_15px_rgba(212,175,55,0.8)] transition-transform duration-150 ease-out ${isRTL ? 'origin-right' : 'origin-left'}`}
        style={{
          transform: `scaleX(${scrollProgress})`
        }}
      />
    </div>
  );
};

export default ScrollProgress;
