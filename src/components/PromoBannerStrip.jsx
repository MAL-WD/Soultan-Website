import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGetActiveBannersQuery } from '../slices/bannersApiSlice';

export const PromoBannerStrip = ({ placement = 'products_top' }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { data, isLoading } = useGetActiveBannersQuery({ type: 'promo_image', placement });
  const banners = data?.data || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const altText = (isArabic ? currentBanner.alt_ar : currentBanner.alt_en) || 'Promotion';

  return (
    <div className="w-full relative group overflow-hidden bg-gray-100 mb-8 rounded-2xl shadow-sm border border-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-[4/1] md:aspect-[5/1] lg:aspect-[6/1]"
        >
          {currentBanner.link_target_url ? (
            <Link to={currentBanner.link_target_url} className="block w-full h-full">
              <img
                src={currentBanner.image_url}
                alt={altText}
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <img
              src={currentBanner.image_url}
              alt={altText}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots (only show if multiple banners) */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? 'w-4 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
