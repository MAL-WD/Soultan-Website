import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-20 bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-brand-color-accent/10 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-brand-color-main/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Animated 404 Container */}
        <div className="relative flex items-center justify-center mb-8">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[120px] md:text-[200px] lg:text-[250px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-brand-color-main to-brand-color-main/30 drop-shadow-sm select-none"
          >
            4
          </motion.h1>

          <motion.div 
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative mx-2 md:mx-6 w-24 h-24 md:w-40 md:h-40 flex items-center justify-center bg-white rounded-full shadow-2xl border-4 border-brand-color-main/20"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search className="w-10 h-10 md:w-16 md:h-16 text-brand-color-main" />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-[120px] md:text-[200px] lg:text-[250px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-t from-brand-color-main to-brand-color-main/30 drop-shadow-sm select-none"
          >
            4
          </motion.h1>
        </div>

        {/* Text Content */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-font-font-color-head mb-6 tracking-tight"
        >
          {t('notFoundTitle')}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t('notFoundDesc')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center justify-center gap-3 bg-brand-color-main text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg shadow-xl shadow-brand-color-main/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Home className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t('backToHome')}</span>
            </motion.button>
          </Link>

          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-font-font-color-head hover:text-brand-color-main font-bold text-lg py-4 px-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            <span>{t('goBack')}</span>
          </motion.button>
        </motion.div>

        {/* Decorative Brand Accent */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1, ease: "circOut" }}
          className="mt-20 w-32 h-1.5 bg-gradient-to-r from-transparent via-brand-color-main to-transparent opacity-50"
        />
      </div>
    </div>
  );
};

export default NotFoundScreen;
