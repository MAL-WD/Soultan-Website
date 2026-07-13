import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../slices/cartSlice';
import { Label } from '../components/ui/label';

const PaymentScreen = () => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('Baridimob');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6">{t('paymentMethod')}</h1>
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              id="Baridimob"
              name="paymentMethod"
              value="Baridimob"
              checked={paymentMethod === 'Baridimob'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 border-gray-300 text-[#f2c161] focus:ring-[#f2c161]"
            />
            <Label htmlFor="Baridimob" className="flex-1 cursor-pointer">
              <span className="font-bold block">{t('baridimob')}</span>
              <span className="text-sm text-gray-500">Manual transfer via CCP</span>
              <Link to="/payment/instructions" className="text-sm text-[#f2c161] hover:underline mt-1 block">
                View payment instructions →
              </Link>
            </Label>
          </div>

          <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              id="COD"
              name="paymentMethod"
              value="CashOnDelivery"
              checked={paymentMethod === 'CashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 border-gray-300 text-[#f2c161] focus:ring-[#f2c161]"
            />
            <Label htmlFor="COD" className="flex-1 cursor-pointer">
              <span className="font-bold block">{t('cashOnDelivery')}</span>
              <span className="text-sm text-gray-500">Pay when you receive</span>
            </Label>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#02110c] text-white">
          Continue
        </Button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
