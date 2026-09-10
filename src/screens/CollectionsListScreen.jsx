import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Sparkles, Layers, ChevronLeft, ChevronRight, FolderCheck } from 'lucide-react';
import { useGetActiveCollectionsQuery } from '../slices/collectionsApiSlice';
import Loader from '../components/Loader';
import BackToSchoolModal from '../components/BackToSchoolModal';

const CollectionsListScreen = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
  const isArabic = lang.startsWith('ar');
  const isFrench = lang.startsWith('fr');

  const { data, isLoading, error } = useGetActiveCollectionsQuery();
  const collections = data?.data || [];

  const getName = (item) => isArabic ? (item.name_ar || item.name_en) : isFrench ? (item.name_fr || item.name_en) : item.name_en;
  const getDesc = (item) => isArabic ? (item.description_ar || item.description_en) : isFrench ? (item.description_fr || item.description_en) : item.description_en;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] pt-32 pb-20 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafbfc] pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <FolderCheck className="w-8 h-8" />
        </div>
        <p className="text-gray-800 font-bold text-lg">{error?.data?.message || 'Failed to load collections'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <BackToSchoolModal />
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#012b0d] via-[#023c12] to-[#01240b] text-white pt-28 md:pt-36 pb-20 md:pb-28 mb-12 shadow-2xl">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D4AF37]/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#023c12] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-2xl" />
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 backdrop-blur-md rounded-full px-5 py-2 mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">
              {isArabic ? 'مجموعات حصرية منسقة' : isFrench ? 'Collections Exclusives' : 'Curated Luxury Bundles'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-white drop-shadow-md"
          >
            {t('collections') || (isArabic ? 'المجموعات' : 'Collections')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium"
          >
            {isArabic
              ? 'حقائب ومجموعات أدوات مدرسية ومكتبية مجهزة خصيصاً بأسعار توفيرية بنقرة واحدة.'
              : isFrench
              ? 'Découvrez nos packs scolaires et fournitures préparés sur mesure pour simplifier vos achats.'
              : 'Discover ready-to-order stationery bundles and school kits tailored for every grade.'}
          </motion.p>
        </div>

        {/* Decorative Bottom Wave / Border */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#fafbfc] rounded-t-[3rem]" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {collections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#023c12]/5 text-[#023c12] flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-[#023c12]/50" />
            </div>
            <p className="text-gray-800 font-extrabold text-xl mb-1">{t('noCollections') || (isArabic ? 'لا توجد مجموعات متاحة حالياً' : 'No Collections Available')}</p>
            <p className="text-gray-400 text-sm">{isArabic ? 'عد قريباً لمتابعة أحدث الحقائب والعروض المميزة' : 'Check back soon for new school & office bundles'}</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
          >
            {collections.map((collection) => {
              const versions = collection.versions || [];
              const firstVersion = versions[0] || {};
              const products = firstVersion.products || [];
              
              const productImages = products
                .map((p) => p.product?.images?.[0]?.url || p.product?.images?.[0])
                .filter(Boolean)
                .slice(0, 4);

              const productCount = products.length;
              const versionsCount = versions.length;

              // Calculate starting price if available
              const startingPrice = products.reduce((sum, item) => {
                return sum + ((item.product?.price || 0) * (item.defaultQuantity || 1));
              }, 0);

              return (
                <motion.div key={collection._id} variants={itemVariants} className="flex">
                  <Link
                    to={`/collections/${collection._id}`}
                    className="group w-full flex flex-col rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 border border-gray-100/80 relative"
                  >
                    {/* Image Header Container */}
                    <div className="relative h-64 md:h-72 overflow-hidden bg-gray-900 shrink-0">
                      <img
                        src={collection.image}
                        alt={getName(collection)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Gradient Protection Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                      {/* Top Badges Row */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10">
                        {/* Item Count Badge */}
                        <div className="bg-white/90 backdrop-blur-md text-[#023c12] border border-white/40 rounded-full px-3.5 py-1 flex items-center gap-1.5 shadow-md">
                          <Package className="w-3.5 h-3.5 text-[#023c12]" />
                          <span className="text-xs font-extrabold">
                            {productCount} {isArabic ? 'عنصر' : 'items'}
                          </span>
                        </div>

                        {/* Versions Count Badge */}
                        {versionsCount > 1 && (
                          <div className="bg-[#D4AF37] text-[#023c12] font-black rounded-full px-3 py-1 text-[11px] shadow-md flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{versionsCount} {isArabic ? 'خيارات' : 'versions'}</span>
                          </div>
                        )}
                      </div>

                      {/* Stacked Product Thumbnails Over Watermark */}
                      {productImages.length > 0 && (
                        <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 flex items-center z-10">
                          {productImages.map((img, i) => (
                            <div
                              key={i}
                              className="relative w-11 h-11 rounded-xl border-2 border-white overflow-hidden shadow-xl bg-white"
                              style={{
                                marginLeft: isArabic ? (i === 0 ? 0 : -12) : (i === 0 ? 0 : -12),
                                marginRight: isArabic ? (i === 0 ? 0 : 0) : 0,
                                zIndex: productImages.length - i,
                              }}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {productCount > productImages.length && (
                            <div
                              className="relative w-11 h-11 rounded-xl border-2 border-white overflow-hidden shadow-xl bg-[#023c12] text-[#D4AF37] flex items-center justify-center font-extrabold text-xs"
                              style={{ marginLeft: -12, zIndex: 0 }}
                            >
                              +{productCount - productImages.length}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-white relative">
                      <div>
                        {/* Title */}
                        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-[#023c12] transition-colors mb-2 line-clamp-1">
                          {getName(collection)}
                        </h3>

                        {/* Description */}
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                          {getDesc(collection) || (isArabic ? 'تصفح مكونات هذه المجموعة واستمتع بالطلب المباشر' : 'Explore the full set of stationery items included in this bundle')}
                        </p>
                      </div>

                      {/* Footer Row: Starting Price & CTA */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
                        <div>
                          {startingPrice > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                                {isArabic ? 'يبدأ من' : 'Starts from'}
                              </span>
                              <span className="text-base font-black text-[#023c12]">
                                {startingPrice.toLocaleString()} <span className="text-xs font-semibold text-gray-400">DZD</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="inline-flex items-center gap-2 bg-[#023c12]/5 group-hover:bg-[#023c12] text-[#023c12] group-hover:text-white px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs">
                          <span>{t('viewCollection') || (isArabic ? 'عرض المجموعة' : 'View Pack')}</span>
                          {isArabic ? (
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          ) : (
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollectionsListScreen;
