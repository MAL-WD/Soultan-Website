import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export const ImageLightbox = ({ images, currentIndex, onClose, onNavigate, isArabic }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    setScale(1);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNavigate]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setScale(1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {scale > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full w-10 h-10"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            <RefreshCcw className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full w-10 h-10"
          onClick={handleZoomOut}
          disabled={scale <= 1}
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full w-10 h-10"
          onClick={handleZoomIn}
          disabled={scale >= 3}
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-white/20 mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full w-10 h-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous Button */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className={`absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('prev');
          }}
        >
          <ChevronLeft className={`w-8 h-8 ${isArabic ? 'rotate-180' : ''}`} />
        </Button>
      )}

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          src={currentImage?.url}
          alt={isArabic ? currentImage?.alt_ar : currentImage?.alt_en || 'Product image'}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
          drag={scale > 1}
          dragConstraints={containerRef}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('next');
          }}
        >
          <ChevronRight className={`w-8 h-8 ${isArabic ? 'rotate-180' : ''}`} />
        </Button>
      )}
    </div>
  );
};
