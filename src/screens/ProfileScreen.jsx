import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res.data }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#02110c] text-white" disabled={loadingUpdateProfile}>
                  {loadingUpdateProfile ? 'Updating...' : 'Update'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <Loader />
              ) : errorOrders ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorOrders?.data?.message || errorOrders.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">DATE</th>
                        <th className="px-6 py-3">TOTAL</th>
                        <th className="px-6 py-3">PAID</th>
                        <th className="px-6 py-3">DELIVERED</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.data.map((order) => (
                        <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{order._id}</td>
                          <td className="px-6 py-4">{order.createdAt.substring(0, 10)}</td>
                          <td className="px-6 py-4">{order.totalAmount} DZD</td>
                          <td className="px-6 py-4">
                            {order.isPaid ? (
                              <span className="text-green-600 font-bold">
                                {order.paidAt?.substring(0, 10) || 'Yes'}
                              </span>
                            ) : (
                              <span className="text-red-600 font-bold">Not Paid</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {order.isDelivered ? (
                              <span className="text-green-600 font-bold">
                                {order.deliveredAt?.substring(0, 10) || 'Yes'}
                              </span>
                            ) : (
                              <span className="text-red-600 font-bold">Not Delivered</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Link to={`/order/${order._id}`}>
                              <Button variant="outline" size="sm">Details</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
