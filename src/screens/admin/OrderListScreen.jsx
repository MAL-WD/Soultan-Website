import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Package,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import AdminLayout from '../../components/AdminLayout';

const STATUS_CONFIG = {
  pending:     { label: 'Pending',      color: 'bg-amber-50 text-amber-700 border-amber-200',    icon: Clock },
  processing:  { label: 'Processing',   color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: RefreshCw },
  shipped:     { label: 'Shipped',      color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  delivered:   { label: 'Delivered',    color: 'bg-green-50 text-green-700 border-green-200',    icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',    color: 'bg-red-50 text-red-600 border-red-200',          icon: XCircle },
  validated:   { label: 'Validated',    color: 'bg-teal-50 text-teal-700 border-teal-200',       icon: CheckCircle2 },
  no_response: { label: 'No Response',  color: 'bg-gray-50 text-gray-600 border-gray-200',       icon: Clock },
  returned:    { label: 'Returned',     color: 'bg-orange-50 text-orange-600 border-orange-200', icon: Package },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200', icon: Clock };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const OrderListScreen = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const filtered = orders?.data?.filter(
    (o) =>
      !search ||
      o._id.includes(search) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Orders">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-gray-500">{orders?.data?.length || 0} orders total</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] bg-white w-64"
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
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivered</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered?.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.025 }}
                    className="hover:bg-[#023c12]/2 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#023c12]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#023c12]">
                            {order.user?.name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{order.user?.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{order.createdAt?.substring(0, 10)}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-[#023c12]">{order.totalAmount?.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">DZD</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {order.isPaid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          {order.paidAt?.substring(0, 10) || 'Paid'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                          <XCircle className="w-4 h-4" />
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {order.isDelivered ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          {order.deliveredAt?.substring(0, 10) || 'Delivered'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link to={`/order/${order._id}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#023c12]/8 text-[#023c12] hover:bg-[#023c12] hover:text-white transition-all">
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered?.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">No orders found</div>
            )}
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default OrderListScreen;
