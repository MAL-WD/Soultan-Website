import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, X, ZoomIn, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const GovernmentDocBadge = ({ images = [], isArabic = true, isFrench = false, schoolYear = '2026/2027' }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const prev = () => setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-4 md:mx-0 mt-6 mb-2 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-amber-900">
              {isArabic ? 'وثيقة رسمية — وزارة التربية الوطنية' : 'Official Document — Ministry of National Education'}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {isArabic ? `مدوّنة الأدوات المدرسية للسنة الدراسية ${schoolYear}` : `Official school supplies list ${schoolYear}`}
            </p>
          </div>
          <div className="bg-amber-200 text-amber-800 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide flex-shrink-0">
            <FileText className="w-3 h-3 inline mr-1" />
            {isArabic ? 'موثّق' : 'Verified'}
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {images.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openLightbox(idx)}
                className="flex-shrink-0 relative group"
              >
                <div className="w-28 h-36 rounded-2xl overflow-hidden border-2 border-amber-200 bg-white shadow-md hover:shadow-lg hover:border-amber-400 transition-all">
                  <img src={img} alt={`وثيقة رسمية ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {idx + 1}/{images.length}
                </span>
              </motion.button>
            ))}
          </div>
          <p className="text-[11px] text-amber-600 mt-2 text-center">
            {isArabic ? '← اضغط على الوثيقة للتكبير والتحقق' : 'Tap document to enlarge'}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
              <div className="relative pointer-events-auto max-w-2xl w-full">
                <button onClick={() => setLightboxOpen(false)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
                  <img src={images[lightboxIndex]} alt={`وثيقة رسمية ${lightboxIndex + 1}`} className="w-full object-contain max-h-[80vh]" />
                </div>
                {images.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button onClick={prev} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-white/70 text-sm font-bold">{lightboxIndex + 1} / {images.length}</span>
                    <button onClick={next} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default GovernmentDocBadge;