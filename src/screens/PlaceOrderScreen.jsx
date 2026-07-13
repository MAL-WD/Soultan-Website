import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  
  // Shipping: Free if over 10000 DZD, else 500 DZD
  const shippingPrice = addDecimals(itemsPrice > 10000 ? 0 : 500);
  
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        items: cart.cartItems.map((item) => ({
          product: item._id,
          name_en: item.name_en,
          name_ar: item.name_ar,
          quantity: item.quantity,
          price: item.price,
          image: item.images[0]?.url,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalAmount: totalPrice,
      }).unwrap();
      
      dispatch(clearCartItems());
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#02110c]">{t('placeOrder')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('shipping')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('paymentMethod')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('items')}</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <img
                        src={item.images[0]?.url || '/placeholder.jpg'}
                        alt={item.name_en}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item._id}`} className="font-medium hover:underline">
                          {item.name_en}
                        </Link>
                      </div>
                      <div className="text-sm">
                        {item.quantity} x {item.price} DZD = {(item.quantity * item.price).toFixed(2)} DZD
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{itemsPrice} DZD</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingPrice} DZD</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{totalPrice} DZD</span>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {error?.data?.message || error.error}
                </div>
              )}

              <Button
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0 || isLoading}
                className="w-full bg-[#f2c161] hover:bg-[#f2c161]/90 text-[#02110c] font-bold h-12"
              >
                {isLoading ? 'Placing Order...' : t('placeOrder')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
