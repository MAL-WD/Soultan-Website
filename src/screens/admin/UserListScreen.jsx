import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  Edit,
  Trash2,
  Check,
  X,
  Search,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';
import AdminLayout from '../../components/AdminLayout';

const UserListScreen = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filtered = users?.data?.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Pick avatar bg color by name initial
  const avatarColors = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-teal-100 text-teal-700',
  ];
  const getAvatarColor = (name) => {
    const code = (name?.[0]?.charCodeAt(0) || 0) % avatarColors.length;
    return avatarColors[code];
  };

  return (
    <AdminLayout title="Users">
      {loadingDelete && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-gray-500">{users?.data?.length || 0} users total</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] bg-white w-56"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-24"><Loader /></div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered?.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-[#023c12]/2 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${getAvatarColor(user.name)}`}>
                          {user.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">{user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-[#023c12] hover:underline text-sm"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#023c12]/8 text-[#023c12] border border-[#023c12]/20">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          <UserIcon className="w-3 h-3" />
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/user/${user._id}/edit`}>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#023c12]/8 text-[#023c12] hover:bg-[#023c12] hover:text-white transition-all">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered?.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">No users found</div>
            )}
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default UserListScreen;
