import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useValidateCouponMutation } from '../slices/couponsApiSlice';

const CouponInput = ({ cartItems, subtotal, onCouponApply, onCouponRemove }) => {
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const handleValidateCoupon = async (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
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
        toast.success('Coupon applied successfully!');
        setCouponCode('');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    onCouponRemove();
    toast.success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-green-900">Coupon Applied</p>
            <p className="text-sm text-green-700">{appliedCoupon.code}</p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleValidateCoupon} className="mb-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !couponCode.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Validating...' : 'Apply'}
        </Button>
      </div>
    </form>
  );
};

export default CouponInput;
