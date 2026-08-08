import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { useGetActiveCollectionsQuery } from '../slices/collectionsApiSlice';
import Loader from '../components/Loader';

const CollectionsListScreen = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
  const isArabic = lang.startsWith('ar');
  const isFrench = lang.startsWith('fr');

  const { data, isLoading, error } = useGetActiveCollectionsQuery();
  const collections = data?.data || [];

  const getName = (item) => isArabic ? item.name_ar : isFrench ? (item.name_fr || item.name_en) : item.name_en;
  const getDesc = (item) => isArabic ? item.description_ar : isFrench ? (item.description_fr || item.description_en) : item.description_en;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader /></div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-red-500 text-sm">{error?.data?.message || 'Failed to load collections'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-[#023c12] py-16 md:py-24 mb-8"
      >
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#D4AF37]/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              {isArabic ? 'مجموعات مميزة' : isFrench ? 'Collections organisées' : 'Curated Collections'}
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('collections')}
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {isArabic
              ? 'مجموعات منسقة بعناية لتسهيل تجربة التسوق — كل ما يحتاجه طفلك في حزمة واحدة.'
              : isFrench
              ? 'Des collections soigneusement organisées pour simplifier vos achats — tout ce dont votre enfant a besoin en un seul clic.'
              : 'Carefully curated collections to simplify your shopping — everything your child needs in one bundle.'}
          </p>
        </div>
      </motion.div>

      {/* Collections Grid */}
      <div className="max-w-[1440px] mx-auto px-4 pb-20">
        {collections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">{t('noCollections')}</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {collections.map((collection) => {
              const productImages = (collection.versions?.[0]?.products || [])
                .map((p) => p.product?.images?.[0]?.url)
                .filter(Boolean)
                .slice(0, 4);
              const productCount = collection.versions?.[0]?.products?.length || 0;

              return (
                <motion.div key={collection._id} variants={itemVariants}>
                  <Link
                    to={`/collections/${collection._id}`}
                    className="block group relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* Cover Image */}
                    <div className="relative h-56 md:h-64 overflow-hidden">
                      <img
                        src={collection.image}
                        alt={getName(collection)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Product count badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                        <Package className="w-3.5 h-3.5 text-[#023c12]" />
                        <span className="text-xs font-bold text-[#023c12]">
                          {productCount} {t('itemsInCollection')}
                        </span>
                      </div>

                      {/* Stacked product thumbnails */}
                      {productImages.length > 0 && (
                        <div className="absolute bottom-4 left-4 flex items-end">
                          {productImages.map((img, i) => (
                            <div
                              key={i}
                              className="relative border-2 border-white rounded-xl overflow-hidden shadow-lg"
                              style={{
                                width: 48,
                                height: 48,
                                marginLeft: i === 0 ? 0 : -14,
                                zIndex: productImages.length - i,
                                transform: `rotate(${(i - 1) * 4}deg)`,
                              }}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {productCount > productImages.length && (
                            <div
                              className="relative border-2 border-white rounded-xl overflow-hidden shadow-lg bg-[#023c12] flex items-center justify-center"
                              style={{
                                width: 48,
                                height: 48,
                                marginLeft: -14,
                                zIndex: 0,
                              }}
                            >
                              <span className="text-white text-xs font-bold">+{productCount - productImages.length}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Title overlay */}
                      <div className="absolute bottom-4 right-4 text-right max-w-[60%]">
                        <h3 className="text-white text-xl font-bold leading-tight drop-shadow-lg">
                          {getName(collection)}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="px-5 py-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500 line-clamp-1 flex-1 mr-4">
                        {getDesc(collection) || (isArabic ? 'اكتشف المجموعة' : isFrench ? 'Découvrez la collection' : 'Discover the collection')}
                      </p>
                      <div className="flex items-center gap-1.5 text-[#023c12] text-sm font-semibold group-hover:gap-2.5 transition-all shrink-0">
                        <span>{t('viewCollection')}</span>
                        <ArrowRight className="w-4 h-4" />
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
