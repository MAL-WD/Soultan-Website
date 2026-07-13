import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for a more realistic feel
        return prev + (Math.random() * 10 + 5);
      });
    }, 150);

    // Wait for actual window load + min duration
    const handleLoad = () => {
      setProgress(100);
    };

    if (document.readyState === 'complete') {
      setTimeout(handleLoad, 1000); // ensure it stays on screen at least briefly if already loaded
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = ''; // Restore scrolling
      }, 600); // Wait a bit after 100% before fading out
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#02110c] flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Logo container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <img src="/logo.png" alt="Soltane" className="w-[120px] h-[120px] rounded-full object-cover" />
            
            {/* Loading text/status optional - we keep it clean just logo and bar */}
          </motion.div>

          {/* Loading bar container */}
          <motion.div 
            className="w-[200px] h-[3px] bg-[#ffffff1a] rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-[#f2c161]"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
