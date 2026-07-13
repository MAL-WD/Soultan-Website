import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Shield, Save } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Loader from '../../components/Loader';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import AdminLayout from '../../components/AdminLayout';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.role === 'admin');
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, role: isAdmin ? 'admin' : 'customer' });
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <AdminLayout title="Edit User">
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <Link
          to="/admin/userlist"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#023c12] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm">
            {error?.data?.message || error.error}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-[#023c12] px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#023c12] text-lg font-bold flex-shrink-0">
                {name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{name || 'User'}</p>
                <p className="text-white/60 text-xs">{email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              {loadingUpdate && (
                <div className="mb-4 flex justify-center"><Loader /></div>
              )}
              <form onSubmit={submitHandler} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </div>
                </div>

                {/* Admin Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#023c12]/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#023c12]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Admin Access</p>
                      <p className="text-xs text-gray-500">Grant full admin panel permissions</p>
                    </div>
                  </div>
                  {/* Custom Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isAdmin ? 'bg-[#023c12]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        isAdmin ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#023c12] text-white font-bold text-sm hover:bg-[#023c12]/90 transition-colors shadow-sm disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserEditScreen;
