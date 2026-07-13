import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export const FadeInUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const FadeInScale = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
      },
    }}
  >
    {children}
  </motion.div>
);

export const HoverScale = ({ children, scale = 1.05 }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, from = 'left', delay = 0 }) => {
  const variants = {
    left: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    top: { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    bottom: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  };

  return (
    <motion.div
      initial={variants[from].initial}
      animate={variants[from].animate}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Fade in animation
export const FadeIn = ({ children, delay = 0, duration = 0.4 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

// Slide up animation
export const SlideUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Slide down animation
export const SlideDown = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Bounce animation
export const BounceIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.3 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.5,
      delay,
      ease: [0.34, 1.56, 0.64, 1],
    }}
  >
    {children}
  </motion.div>
);
