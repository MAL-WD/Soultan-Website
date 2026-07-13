import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Loader from '../components/Loader';
import { useVerifyDahebiaPaymentMutation } from '../slices/paymentsApiSlice';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';

const DahebiaPaymentScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);

  const transactionId = searchParams.get('transaction_id');
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');

  const { data: orderData } = useGetOrderDetailsQuery(orderId);
  const [verifyPayment, { isLoading }] = useVerifyDahebiaPaymentMutation();

  useEffect(() => {
    if (transactionId && status && reference) {
      verifyPaymentTransaction();
    }
  }, [transactionId, status, reference]);

  const verifyPaymentTransaction = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyPayment({
        reference,
        transactionId,
      }).unwrap();

      if (result.success) {
        toast.success('Payment verified successfully!');
        setTimeout(() => navigate(`/order/${orderId}`), 2000);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Payment verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Payment Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isVerifying || isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader />
                <p className="mt-4 text-gray-600">Verifying your payment...</p>
              </div>
            ) : status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="bg-green-100 rounded-full p-6">
                    <svg
                      className="w-12 h-12 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="text-gray-600">
                  Your payment has been processed successfully. Your order is being prepared.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Order ID:</span> {orderId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Transaction ID:</span> {transactionId}
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/order/${orderId}`)}
                  className="w-full bg-[#02110c] text-white hover:bg-[#02110c]/90"
                >
                  View Order Details
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="bg-red-100 rounded-full p-6">
                    <svg
                      className="w-12 h-12 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
                <p className="text-gray-600">
                  Unfortunately, your payment could not be processed. Please try again or choose a different payment method.
                </p>
                <Button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-[#02110c] text-white hover:bg-[#02110c]/90"
                >
                  Back to Cart
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DahebiaPaymentScreen;
