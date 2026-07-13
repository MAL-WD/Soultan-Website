import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/admin/productlist', label: 'Products', labelAr: 'المنتجات', icon: Package },
  { path: '/admin/orderlist', label: 'Orders', labelAr: 'الطلبات', icon: ShoppingBag },
  { path: '/admin/userlist', label: 'Users', labelAr: 'المستخدمون', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', labelAr: 'الإحصائيات', icon: BarChart3 },
];

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
    } catch (e) {
      // ignore
    }
    dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Soltane Logo"
            className="h-12 w-auto object-contain"
          />
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Admin Panel</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#D4AF37] text-[#023c12] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#023c12]' : ''}`} />
              <span className="text-sm font-medium">{isArabic ? item.labelAr : item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-[#023c12]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#023c12]">
              {userInfo?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userInfo?.name || 'Admin'}</p>
            <p className="text-[10px] text-white/50 truncate">{userInfo?.email}</p>
          </div>
        </div>
        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6f8]" style={{ fontFamily: 'Satoshi, Inter, sans-serif' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 bg-[#023c12] overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-60 bg-[#023c12] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-xl font-bold text-[#023c12] truncate">{title}</h1>
            )}
          </div>
          {/* Admin Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#023c12]/5 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-[#023c12]">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
