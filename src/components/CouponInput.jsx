import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Ticket, CheckCircle2, X } from 'lucide-react';
import { useValidateCouponMutation } from '../slices/couponsApiSlice';

const CouponInput = ({ cartItems, subtotal, onCouponApply, onCouponRemove }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const handleValidateCoupon = async (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      toast.error(isArabic ? 'يرجى إدخال رمز الكوبون' : 'Please enter a coupon code');
      return;
    }

    try {
      const response = await validateCoupon({
        code: couponCode.toUpperCase(),
        orderAmount: subtotal,
        items: cartItems,
      }).unwrap();

      if (response.success) {
        setAppliedCoupon(response.data.coupon);
        onCouponApply(response.data);
        toast.success(isArabic ? 'تم تطبيق الكوبون بنجاح!' : 'Coupon applied successfully!');
        setCouponCode('');
      }
    } catch (error) {
      toast.error(error?.data?.message || (isArabic ? 'رمز الكوبون غير صالح' : 'Invalid coupon code'));
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    onCouponRemove();
    toast.success(isArabic ? 'تم إزالة الكوبون' : 'Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-[#023c12]/5 border border-[#023c12]/15 rounded-2xl p-4 mb-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#023c12] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#023c12] text-sm tracking-wide">{appliedCoupon.code}</span>
              <span className="text-[10px] bg-[#D4AF37]/20 text-[#023c12] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {isArabic ? 'مُطبق' : 'Applied'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isArabic ? 'خصم مفعّل على الطلب' : 'Discount applied to your order'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemoveCoupon}
          className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors shadow-sm"
          title={isArabic ? 'إزالة الكوبون' : 'Remove coupon'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleValidateCoupon} className="mb-4">
      <div className="relative flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-200/80 focus-within:border-[#023c12] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#023c12]/10 transition-all">
        <div className="flex items-center gap-2 pl-3 rtl:pl-0 rtl:pr-3 text-gray-400">
          <Ticket className="w-4 h-4 text-[#023c12]" />
        </div>
        <input
          type="text"
          placeholder={isArabic ? 'رمز التخفيض...' : 'Enter coupon code...'}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1 bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none uppercase"
        />
        <button
          type="submit"
          disabled={isLoading || !couponCode.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#023c12] hover:bg-[#023c12]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
        >
          {isLoading ? (isArabic ? 'جاري التحقق...' : 'Validating...') : (isArabic ? 'تطبيق' : 'Apply')}
        </button>
      </div>
    </form>
  );
};

export default CouponInput;
