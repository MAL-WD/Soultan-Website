import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useGetAnalyticsQuery } from '../../slices/analyticsApiSlice';
import AdminLayout from '../../components/AdminLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const STAT_CARDS = [
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    format: (v) => `${v?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} DZD`,
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    key: 'totalOrders',
    label: 'Total Orders',
    format: (v) => v?.toLocaleString() || '0',
    icon: ShoppingCart,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  {
    key: 'averageOrderValue',
    label: 'Avg Order Value',
    format: (v) => `${v?.toFixed(0) || 0} DZD`,
    icon: TrendingUp,
    gradient: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    format: (v) => v?.toLocaleString() || '0',
    icon: Users,
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
  },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f0f0f0' } },
  },
};

const AnalyticsDashboard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery();

  if (isLoading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center py-32 text-gray-400 text-sm gap-3">
          <div className="w-5 h-5 border-2 border-[#023c12] border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Analytics">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Failed to load analytics data. Please try again.
        </div>
      </AdminLayout>
    );
  }

  const analytics = analyticsData?.data || {};
  const { summary, revenueByDate, bestSellingProducts, lowStockProducts, ordersByStatus } = analytics;

  const revenueChartData = {
    labels: revenueByDate?.map((d) => d._id) || [],
    datasets: [
      {
        label: 'Revenue (DZD)',
        data: revenueByDate?.map((d) => d.revenue) || [],
        borderColor: '#023c12',
        backgroundColor: 'rgba(2, 60, 18, 0.06)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#023c12',
        fill: true,
      },
    ],
  };

  const bestSellingChartData = {
    labels: bestSellingProducts?.map((p) => (isArabic ? p.name_ar : p.name_en)) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: bestSellingProducts?.map((p) => p.totalSold) || [],
        backgroundColor: [
          'rgba(2, 60, 18, 0.8)',
          'rgba(212, 175, 55, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(244, 114, 182, 0.8)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const statusChartData = {
    labels: ordersByStatus?.map((s) => s._id) || [],
    datasets: [
      {
        data: ordersByStatus?.map((s) => s.count) || [],
        backgroundColor: [
          '#023c12',
          '#D4AF37',
          '#3b82f6',
          '#10b981',
          '#8b5cf6',
          '#f59e0b',
        ],
        borderWidth: 0,
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <AdminLayout title="Analytics">
      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
      >
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = summary?.[card.key];
          return (
            <motion.div
              key={card.key}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.format(value)}</p>
                </div>
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Revenue Trend</h3>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </div>
          <div className="p-5 h-72">
            <Line
              data={revenueChartData}
              options={{ ...chartOptions }}
            />
          </div>
        </motion.div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Orders by Status</h3>
            <p className="text-xs text-gray-400">Distribution overview</p>
          </div>
          <div className="p-5 h-72 flex items-center justify-center">
            <Pie
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Best Selling Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
      >
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-800">Top 10 Best-Selling Products</h3>
          <p className="text-xs text-gray-400">Ranked by units sold</p>
        </div>
        <div className="p-5 h-80">
          <Bar
            data={bestSellingChartData}
            options={{
              ...chartOptions,
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { color: '#f0f0f0' } },
                y: { grid: { display: false } },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-gray-800">Low Stock Alerts</h3>
        </div>
        {lowStockProducts && lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStockProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {isArabic ? product.name_ar : product.name_en}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 font-mono">{product.sku || 'N/A'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.stock < 5
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#023c12]">
                      {product.price?.toFixed(0)} DZD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-14 text-center text-gray-400 text-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No low stock products
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
