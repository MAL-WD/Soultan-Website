import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Detect mobile — parallax is disabled on touch devices for performance
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export const ParallaxWrapper = ({ children, speed = 0.5, className = '', direction = 'vertical' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const transformValue = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? [speed * 100, speed * -100] : [0, 0]
  );
  
  const horizontalTransform = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? [speed * 100, speed * -100] : [0, 0]
  );

  const physics = { stiffness: 100, damping: 30, mass: 1 };
  const smoothY = useSpring(transformValue, physics);
  const smoothX = useSpring(horizontalTransform, physics);

  // On mobile: skip parallax entirely — just render children flat
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY, x: smoothX }}>
        {children}
      </motion.div>
    </div>
  );
};

export const ParallaxElement = ({ children, speed = 0.3, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, mass: 1 });

  // On mobile: skip parallax
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
};
