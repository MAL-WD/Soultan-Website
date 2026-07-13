import React, { useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CursorGlow = ({ mouseX, mouseY }) => {
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        background: 'transparent',
      }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(242,193,97,0.15) 0%, rgba(242,193,97,0) 70%)',
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </motion.div>
  );
};

export default CursorGlow;
