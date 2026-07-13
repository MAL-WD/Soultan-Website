import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboardScreen = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const quickLinks = [
    {
      name: isArabic ? 'المنتجات' : 'Products',
      desc: isArabic ? 'إدارة كتالوج المنتجات' : 'Manage your product catalog',
      path: '/admin/productlist',
      icon: Package,
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      lightText: 'text-emerald-600',
    },
    {
      name: isArabic ? 'الطلبات' : 'Orders',
      desc: isArabic ? 'تتبع ومعالجة الطلبات' : 'Track and process orders',
      path: '/admin/orderlist',
      icon: ShoppingBag,
      gradient: 'from-amber-400 to-yellow-500',
      lightBg: 'bg-amber-50',
      lightText: 'text-amber-600',
    },
    {
      name: isArabic ? 'المستخدمون' : 'Users',
      desc: isArabic ? 'إدارة حسابات المستخدمين' : 'Manage user accounts',
      path: '/admin/userlist',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-600',
    },
    {
      name: isArabic ? 'الإحصائيات' : 'Analytics',
      desc: isArabic ? 'تقارير المبيعات والأداء' : 'Sales reports and performance',
      path: '/admin/analytics',
      icon: BarChart3,
      gradient: 'from-purple-500 to-violet-600',
      lightBg: 'bg-purple-50',
      lightText: 'text-purple-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <AdminLayout title={t('adminDashboard') || 'Admin Dashboard'}>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[#023c12] text-white p-8 mb-8 shadow-xl"
      >
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D4AF37]/10" />
        <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-[#D4AF37]/5" />
        <div className="absolute top-4 right-32 w-16 h-16 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest">
              {isArabic ? 'مرحباً بك' : 'Welcome back'}
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isArabic ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h2>
          <p className="text-white/60 text-sm max-w-md">
            {isArabic
              ? 'أدر متجرك بكل سهولة — المنتجات والطلبات والمستخدمين والإحصائيات في مكان واحد.'
              : 'Manage your store effortlessly — products, orders, users, and analytics all in one place.'}
          </p>
        </div>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <motion.div key={link.path} variants={itemVariants}>
              <Link to={link.path} className="block group">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{link.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{link.desc}</p>
                  <div className="flex items-center gap-1 text-[#023c12] text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>{isArabic ? 'اذهب' : 'Go'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboardScreen;
