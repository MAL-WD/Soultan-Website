import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import CouponInput from '../components/CouponInput';
import { FadeInUp, StaggerContainer, StaggerItem } from '../components/Animations';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
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
  const total = subtotal - discount;

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData.coupon);
    setDiscount(couponData.discount);
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfa] pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#1b4332]/10 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-[#1b4332]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#02110c] font-serif">{t('cart')}</h1>
            {cartItems.length > 0 && (
              <p className="text-gray-500 mt-1">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} {t('items')}</p>
            )}
          </div>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-[#f2c161]/20 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-[#f2c161]" />
            </div>
            <h2 className="text-2xl font-bold text-[#02110c] mb-3">{isArabic ? "عربة التسوق فارغة" : "Your cart is empty"}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{isArabic ? "يبدو أنك لم تضف أي شيء إلى عربة التسوق بعد. استكشف مجموعتنا وابحث عن شيء تحبه!" : "Looks like you haven't added anything to your cart yet. Explore our collection and find something you love!"}</p>
            <Link to="/products">
              <Button className="h-14 px-8 rounded-full bg-[linear-gradient(339deg,rgba(250,219,157,0.7)_0%,rgba(242,193,97,1)_56%,rgba(252,221,159,0.52)_100%)] hover:opacity-90 transition-opacity border-0 text-[#02110c] font-bold text-lg shadow-lg shadow-[#f2c161]/20">
                {isArabic ? "اذهب للتسوق" : "Go Shopping"}
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <StaggerContainer staggerDelay={0.05}>
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <StaggerItem key={item._id}>
                        <motion.div 
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          className={`p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                          <Link to={`/product/${item._id}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden block">
                            <img
                              src={item.images[0]?.url || '/placeholder.jpg'}
                              alt={isArabic ? item.name_ar : item.name_en}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 mb-4">
                              <div>
                                <Link to={`/product/${item._id}`} className="text-lg font-bold text-[#02110c] hover:text-[#1b4332] transition-colors line-clamp-2">
                                  {isArabic ? item.name_ar : item.name_en}
                                </Link>
                                <div className="text-sm text-gray-500 mt-1">{item.price} DZD</div>
                              </div>
                              <div className="font-bold text-[#1b4332] text-lg sm:text-right">
                                {(item.price * item.quantity).toFixed(2)} DZD
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                                <button
                                  onClick={() => updateQuantity(item, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#1b4332] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-6 text-center font-semibold text-[#02110c]">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#1b4332] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeFromCartHandler(item._id)}
                                className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </AnimatePresence>
                </StaggerContainer>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#02110c] mb-6 font-serif">{t('orderSummary')}</h2>

                  <div className="mb-6">
                    <CouponInput
                      cartItems={cartItems}
                      subtotal={subtotal}
                      onCouponApply={handleCouponApply}
                      onCouponRemove={handleCouponRemove}
                    />
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600">
                      <span>{t('subtotal')} ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                      <span className="font-medium text-[#02110c]">{subtotal.toFixed(2)} DZD</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#1b4332] font-semibold bg-[#1b4332]/5 p-3 rounded-xl">
                        <span>{isArabic ? "الخصم" : "Discount"}</span>
                        <span>-{discount.toFixed(2)} DZD</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-bold text-[#02110c]">{t('total')}</span>
                        <div className="text-right">
                           <span className="text-2xl font-bold text-[#1b4332] block">{total.toFixed(2)} DZD</span>
                           <span className="text-xs text-gray-400">{isArabic ? "يتم حساب الضرائب والشحن عند الدفع" : "Taxes and shipping calculated at checkout"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/quick-checkout" className="block w-full">
                    <Button
                      className="w-full h-14 rounded-full bg-[linear-gradient(339deg,rgba(250,219,157,0.7)_0%,rgba(242,193,97,1)_56%,rgba(252,221,159,0.52)_100%)] hover:opacity-90 transition-opacity border-0 text-[#02110c] font-bold text-lg shadow-lg shadow-[#f2c161]/20 flex items-center justify-center group"
                    >
                      {t('placeOrder')} 
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Button>
                  </Link>
                  
                  <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                     <span className="text-sm text-center">{isArabic ? "دفع آمن" : "Secure Checkout"}</span>
                  </div>
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

