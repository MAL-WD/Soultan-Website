import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  Sparkles,
} from 'lucide-react';
import { useGetCollectionByIdQuery } from '../slices/collectionsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';

const CollectionDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
  const isArabic = lang.startsWith('ar');
  const isFrench = lang.startsWith('fr');

  const { data, isLoading, error } = useGetCollectionByIdQuery(id);
  const collection = data?.data;

  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [removedIds, setRemovedIds] = useState(new Set());

  const getName = (item) => isArabic ? (item.name_ar || item.name_en) : isFrench ? (item.name_fr || item.name_en) : item.name_en;
  const getDesc = (item) => isArabic ? (item.description_ar || item.description_en) : isFrench ? (item.description_fr || item.description_en) : item.description_en;

  const handleVersionChange = (index) => {
    setSelectedVersionIndex(index);
    setRemovedIds(new Set());
    setQuantities({});
  };

  const visibleProducts = useMemo(() => {
    if (!collection?.versions || collection.versions.length === 0) return [];
    const activeVersion = collection.versions[selectedVersionIndex];
    if (!activeVersion?.products) return [];
    return activeVersion.products.filter((p) => p.product && !removedIds.has(p.product._id));
  }, [collection, selectedVersionIndex, removedIds]);

  const getQuantity = (productId, defaultQty) => {
    return quantities[productId] ?? defaultQty;
  };

  const updateQuantity = (productId, delta, defaultQty, maxStock) => {
    const current = getQuantity(productId, defaultQty);
    const newQty = Math.max(1, Math.min(maxStock || 999, current + delta));
    setQuantities((prev) => ({ ...prev, [productId]: newQty }));
  };

  const handleAddToCart = (product, defaultQty) => {
    const qty = getQuantity(product._id, defaultQty);
    dispatch(
      addToCart({
        _id: product._id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        name_fr: product.name_fr,
        price: product.price,
        images: product.images,
        stock: product.stock,
        quantity: qty,
      })
    );
    toast.success(
      isArabic ? `تمت إضافة ${getName(product)} إلى العربة` : `${getName(product)} added to cart`,
      { autoClose: 2000 }
    );
  };

  const handleRemove = (productId) => {
    setRemovedIds((prev) => new Set(prev).add(productId));
  };

  const handleAddAllToCart = () => {
    visibleProducts.forEach((item) => {
      const product = item.product;
      const qty = getQuantity(product._id, item.defaultQuantity);
      dispatch(
        addToCart({
          _id: product._id,
          name_en: product.name_en,
          name_ar: product.name_ar,
          name_fr: product.name_fr,
          price: product.price,
          images: product.images,
          stock: product.stock,
          quantity: qty,
        })
      );
    });
    toast.success(
      isArabic ? 'تمت إضافة جميع المنتجات إلى العربة!' : isFrench ? 'Tous les articles ont été ajoutés au panier !' : 'All items added to cart!',
      { autoClose: 2500 }
    );
  };

  const totalPrice = useMemo(() => {
    return visibleProducts.reduce((sum, item) => {
      const qty = getQuantity(item.product._id, item.defaultQuantity);
      return sum + item.product.price * qty;
    }, 0);
  }, [visibleProducts, quantities]);

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader /></div>;
  if (error || !collection) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-red-500 text-sm">{error?.data?.message || 'Collection not found'}</p>
      <Link to="/collections" className="mt-4 text-[#023c12] font-semibold hover:underline">{t('collections')}</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={collection.image}
          alt={getName(collection)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-6 left-6">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('collections')}
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-3 py-1 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              {collection.versions?.[selectedVersionIndex]?.products?.length || 0} {t('itemsInCollection')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {getName(collection)}
          </h1>
          {getDesc(collection) && (
            <p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed">
              {getDesc(collection)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-8 pb-32">
        {/* Version Selector */}
        {collection.versions && collection.versions.length > 1 && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl shadow-inner overflow-x-auto max-w-full hide-scrollbar">
              {collection.versions.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVersionChange(idx)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    selectedVersionIndex === idx 
                      ? 'bg-white text-[#023c12] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                  }`}
                >
                  {getName(v) || `Version ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t('collectionEmpty')}</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            key={selectedVersionIndex} // Animate when switching versions
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {visibleProducts.map((item) => {
                const product = item.product;
                const mainImage = product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
                const qty = getQuantity(product._id, item.defaultQuantity);

                return (
                  <motion.div
                    key={product._id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                    layout
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Product Image */}
                    <Link to={`/product/${product._id}`} className="block relative h-44 overflow-hidden bg-gray-50">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={getName(product)}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                      {/* Remove button */}
                      <button
                        onClick={(e) => { e.preventDefault(); handleRemove(product._id); }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 hover:text-[#023c12] transition-colors">
                          {getName(product)}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-[#023c12] mb-3">
                        {product.price?.toLocaleString()} <span className="text-xs font-medium text-gray-400">DA</span>
                      </p>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400 font-medium">{t('quantity')}</span>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-1 py-1">
                          <button
                            onClick={() => updateQuantity(product._id, -1, item.defaultQuantity, product.stock)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#023c12] hover:text-[#023c12] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">{qty}</span>
                          <button
                            onClick={() => updateQuantity(product._id, 1, item.defaultQuantity, product.stock)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#023c12] hover:text-[#023c12] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(product, item.defaultQuantity)}
                        className="w-full py-2.5 rounded-xl bg-[#023c12] text-white text-sm font-semibold hover:bg-[#023c12]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('addToCart')}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Add All Bar */}
      {visibleProducts.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                {visibleProducts.length} {t('itemsInCollection')}
              </p>
              <p className="text-xl font-bold text-[#023c12]">
                {totalPrice.toLocaleString()} <span className="text-sm font-medium text-gray-400">DA</span>
              </p>
            </div>
            <button
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#023c12] text-white font-bold text-sm hover:bg-[#023c12]/90 active:scale-[0.97] transition-all shadow-lg shadow-[#023c12]/20"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              {t('addAllToCart')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CollectionDetailScreen;
