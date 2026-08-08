import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ShoppingBasket 
} from 'lucide-react';
import CouponInput from '../components/CouponInput';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
  const isArabic = lang.startsWith('ar');

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const updateQuantity = (item, qty) => {
    if (qty > 0 && qty <= item.stock) {
      dispatch(addToCart({ ...item, quantity: qty }));
    }
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const total = Math.max(0, subtotal - discount);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData.coupon);
    setDiscount(couponData.discount);
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const getName = (item) => {
    if (isArabic) return item.name_ar || item.name_en;
    if (lang.startsWith('fr')) return item.name_fr || item.name_en;
    return item.name_en;
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        
        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-4 border-b border-gray-100 pb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#023c12] text-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#023c12]/10 shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#023c12]">
                  {t('cart') || (isArabic ? 'عربة التسوق' : 'Shopping Cart')}
                </h1>
                {cartItems.length > 0 && (
                  <span className="bg-[#D4AF37]/20 text-[#023c12] border border-[#D4AF37]/30 text-xs font-black px-3 py-1 rounded-full">
                    {totalItemsCount} {isArabic ? 'عناصر' : 'items'}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs md:text-sm mt-0.5">
                {isArabic 
                  ? 'قم بزيادة الكمية أو مراجعة طلبيتك قبل إتمام الدفع' 
                  : 'Review your items and apply discount codes before checkout'}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[#023c12] hover:text-[#023c12]/80 bg-[#023c12]/5 hover:bg-[#023c12]/10 px-4 py-2.5 rounded-xl transition-all"
            >
              {isArabic ? 'متابعة التسوق' : 'Continue Shopping'}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          )}
        </motion.div>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-12"
          >
            <div className="w-24 h-24 rounded-3xl bg-[#023c12]/5 text-[#023c12] flex items-center justify-center mb-6 shadow-inner">
              <ShoppingBasket className="w-12 h-12 text-[#023c12]/60" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isArabic ? 'عربة التسوق فارغة' : 'Your cart is empty'}
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-sm">
              {isArabic 
                ? 'يبدو أنك لم تضف أي منتجات بعد. تصفح تشكيلتنا المميزة وابدأ التسوق الآن!' 
                : 'Explore our catalog of fine stationery and tools to fill up your cart.'}
            </p>
            <Link to="/products">
              <button className="px-8 py-3.5 rounded-2xl bg-[#023c12] hover:bg-[#023c12]/90 text-white font-bold text-sm shadow-xl shadow-[#023c12]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{isArabic ? 'استكشف المنتجات' : 'Start Shopping'}</span>
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Items Card Wrapper */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[#023c12] uppercase tracking-wider">
                    {isArabic ? 'قائمة المنتجات' : 'Item Details'}
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">
                    {cartItems.length} {isArabic ? 'منتج مختلف' : 'unique items'}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {cartItems.map((item) => {
                      const image = item.images?.[0]?.url || item.images?.[0] || '/placeholder.jpg';
                      const itemTotal = item.price * item.quantity;

                      return (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                          className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:bg-gray-50/40 transition-colors"
                        >
                          {/* Image */}
                          <Link 
                            to={`/product/${item._id}`}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 group relative p-2"
                          >
                            <img
                              src={image}
                              alt={getName(item)}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                          </Link>

                          {/* Info & Actions */}
                          <div className="flex-1 w-full flex flex-col justify-between self-stretch min-w-0 gap-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <Link 
                                  to={`/product/${item._id}`} 
                                  className="text-base font-bold text-gray-900 hover:text-[#023c12] transition-colors line-clamp-2"
                                >
                                  {getName(item)}
                                </Link>
                                <p className="text-xs text-gray-400 mt-1">
                                  {isArabic ? 'سعر الوحدة:' : 'Unit Price:'}{' '}
                                  <span className="font-semibold text-gray-700">{item.price?.toLocaleString()} DZD</span>
                                </p>
                              </div>

                              {/* Item Total Price */}
                              <div className="text-right rtl:text-left shrink-0">
                                <span className="text-base md:text-lg font-black text-[#023c12]">
                                  {itemTotal.toLocaleString()} <span className="text-xs font-semibold text-gray-400">DZD</span>
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex items-center justify-between pt-2">
                              
                              {/* Pill Quantity Selector */}
                              <div className="flex items-center gap-3 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700 hover:bg-[#023c12] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 transition-all active:scale-95"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>

                                <span className="w-7 text-center font-bold text-sm text-gray-900">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-700 hover:bg-[#023c12] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 transition-all active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeFromCartHandler(item._id)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all active:scale-95"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">{isArabic ? 'حذف' : 'Remove'}</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Guarantees Badge Footer */}
              <div className="bg-[#023c12]/5 rounded-2xl p-4 border border-[#023c12]/10 flex items-center justify-around flex-wrap gap-4 text-xs text-[#023c12] font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isArabic ? 'ضمان جودة الأصالة 100%' : '100% Authentic Quality'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isArabic ? 'توصيل سريع لجميع الولايات' : 'Fast National Shipping'}</span>
                </div>
              </div>
            </div>

            {/* Right Summary Column (4 Cols) */}
            <div className="lg:col-span-4 sticky top-28">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-7"
              >
                <h2 className="text-lg font-extrabold text-[#023c12] mb-5 border-b border-gray-100 pb-4">
                  {t('orderSummary') || (isArabic ? 'ملخص الطلب' : 'Order Summary')}
                </h2>

                {/* Coupon Input */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    {isArabic ? 'رمز الخصم / الكوبون' : 'Promo Code'}
                  </label>
                  <CouponInput
                    cartItems={cartItems}
                    subtotal={subtotal}
                    onCouponApply={handleCouponApply}
                    onCouponRemove={handleCouponRemove}
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{isArabic ? `المجموع الفرعي (${totalItemsCount} عناصر)` : `Subtotal (${totalItemsCount} items)`}</span>
                    <span className="font-bold text-gray-900">{subtotal.toLocaleString()} DZD</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-[#023c12] bg-[#023c12]/5 px-3 py-2 rounded-xl font-bold border border-[#023c12]/10">
                      <span>{isArabic ? 'مبلغ الخصم' : 'Discount'}</span>
                      <span className="text-emerald-700">-{discount.toLocaleString()} DZD</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600">
                    <span>{isArabic ? 'التوصيل' : 'Shipping'}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      {isArabic ? 'يُحسب عند الدفع' : 'Calculated at checkout'}
                    </span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="pt-4 border-t border-gray-100 mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-[#023c12]">
                      {isArabic ? 'الإجمالي الكلي' : 'Total Amount'}
                    </span>
                    <div className="text-right rtl:text-left">
                      <span className="text-2xl md:text-3xl font-black text-[#023c12]">
                        {total.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-[#D4AF37] ml-1">DZD</span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link to="/quick-checkout" className="block w-full">
                  <button
                    type="button"
                    className="w-full py-4 rounded-2xl bg-[#023c12] hover:bg-[#023c12]/90 text-white font-extrabold text-base shadow-xl shadow-[#023c12]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 border border-[#D4AF37]/30"
                  >
                    <span>{t('placeOrder') || (isArabic ? 'إتمام الطلب' : 'Proceed to Checkout')}</span>
                    <ArrowRight className="w-5 h-5 rtl:rotate-180 text-[#D4AF37]" />
                  </button>
                </Link>

                <div className="mt-4 text-center">
                  <span className="text-[11px] text-gray-400 font-medium inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {isArabic ? 'معاملة آمنة ومضمونة 100%' : '100% Encrypted & Safe Checkout'}
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
