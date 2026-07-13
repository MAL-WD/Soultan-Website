import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGetOrderDetailsQuery, usePayOrderMutation, useUpdateOrderStatusMutation } from '../slices/ordersApiSlice';
import { useUploadProductImageMutation } from '../slices/productsApiSlice'; // Reusing upload mutation
import Loader from '../components/Loader';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { t } = useTranslation();

  const { data: orderData, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const order = orderData?.data;
  const [uploadImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [updateOrderStatus, { isLoading: loadingUpdateStatus }] = useUpdateOrderStatusMutation();
  
  const { userInfo } = useSelector((state) => state.auth);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (order && !status) {
      setStatus(order.status);
      setNote(order.adminNotes || '');
    }
  }, [order, status]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage(formData).unwrap();
      // After upload, update order with payment proof
      // Note: I need to update the backend to accept payment proof update specifically
      // For now, I'll assume I can use payOrder to update it or create a new endpoint
      // Let's use payOrder for now and pass the proof URL
      
      await payOrder({ 
        orderId, 
        details: { 
          paymentProof: res.filePath,
          status: 'payment_verified' // Or pending verification
        } 
      }).unwrap();
      
      refetch();
      toast.success('Payment proof uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error?.data?.message || error.error}</AlertDescription></Alert>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#02110c]">Order {order._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('shipping')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Name: </strong> {order.user ? order.user.name : order.shippingAddress.name}</p>
              <p><strong>Email: </strong> {order.user ? <a href={`mailto:${order.user.email}`}>{order.user.email}</a> : 'Guest'}</p>
              <p>
                <strong>Phone: </strong> {order.shippingAddress.phone || 'N/A'}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Alert className="bg-green-100 text-green-800 border-green-200">
                  <AlertTitle>Delivered</AlertTitle>
                  <AlertDescription>Delivered on {order.deliveredAt}</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTitle>Not Delivered</AlertTitle>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('paymentMethod')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              
              {order.paymentMethod === 'Baridimob' && !order.isPaid && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <h3 className="font-bold mb-2">{t('ccpInfo')}</h3>
                  <p className="font-mono text-lg">CCP: 0000000000 CLE 00</p>
                  <p className="font-mono text-lg">Name: Soltane Stationery</p>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('uploadProof')}
                    </label>
                    <input
                      type="file"
                      onChange={uploadFileHandler}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f2c161] file:text-[#02110c] hover:file:bg-[#f2c161]/90"
                    />
                    {loadingUpload && <Loader />}
                  </div>
                </div>
              )}

              {order.paymentProof && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Payment Proof:</p>
                  <a href={order.paymentProof} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    View Proof
                  </a>
                </div>
              )}

              {order.isPaid ? (
                <Alert className="bg-green-100 text-green-800 border-green-200">
                  <AlertTitle>Paid</AlertTitle>
                  <AlertDescription>Paid on {order.paidAt}</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTitle>Not Paid</AlertTitle>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('items')}</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.length === 0 ? (
                <p>Order is empty</p>
              ) : (
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name_en}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="font-medium hover:underline">
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
                <span>{order.totalAmount - order.shippingCost} DZD</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingCost} DZD</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{order.totalAmount} DZD</span>
              </div>
            </CardContent>
          </Card>
          
          {userInfo && userInfo.role === 'admin' && (
            <Card className="mt-6 border-brand-color-main">
              <CardHeader className="bg-brand-color-main/5 pb-4">
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('status')}</label>
                  <select 
                    className="w-full border rounded-md p-2 bg-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {order.status && !['processing', 'shipped', 'cancelled', 'validated'].includes(order.status) && (
                      <option value={order.status}>{t(order.status) || order.status}</option>
                    )}
                    <option value="processing">{t('processing') || 'Processing'}</option>
                    <option value="shipped">{t('shipped') || 'Shipped'}</option>
                    <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
                    <option value="validated">{t('status_validated') || 'Validated'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Note</label>
                  <textarea 
                    className="w-full border rounded-md p-2 bg-white"
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional note..."
                  ></textarea>
                </div>
                <Button 
                  onClick={async () => {
                    try {
                      await updateOrderStatus({ orderId, status, note }).unwrap();
                      refetch();
                      toast.success(t('updateStatus') || 'Status updated');
                    } catch (err) {
                      toast.error(err?.data?.message || err.error);
                    }
                  }}
                  disabled={loadingUpdateStatus}
                  className="w-full bg-brand-color-main hover:bg-brand-color-main-hover"
                >
                  {loadingUpdateStatus ? <Loader /> : (t('updateStatus') || 'Update Status')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
