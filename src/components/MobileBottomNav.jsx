import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  SearchIcon,
  LayoutGridIcon,
  ShoppingCartIcon,
  UserIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XIcon,
} from 'lucide-react';

const MobileBottomNav = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const drawerRef = useRef(null);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  // Close drawer on route change
  useEffect(() => {
    setShowCategories(false);
  }, [location.pathname]);

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    };
    if (showCategories) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategories]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (showCategories) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showCategories]);

  const isActive = (path) => location.pathname === path;

  const handleSearchClick = () => {
    if (location.pathname === '/products') {
      // Focus the search input if already on products page
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate('/products');
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId) => {
    setShowCategories(false);
    navigate(`/products?category=${categoryId}`);
  };

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const navItems = [
    {
      key: 'home',
      icon: HomeIcon,
      label: isArabic ? 'الرئيسية' : 'Home',
      action: () => navigate('/'),
      active: isActive('/'),
    },
    {
      key: 'search',
      icon: SearchIcon,
      label: isArabic ? 'بحث' : 'Search',
      action: handleSearchClick,
      active: isActive('/products'),
    },
    {
      key: 'categories',
      icon: LayoutGridIcon,
      label: isArabic ? 'الفئات' : 'Categories',
      action: () => setShowCategories((prev) => !prev),
      active: showCategories,
    },
    {
      key: 'cart',
      icon: ShoppingCartIcon,
      label: isArabic ? 'السلة' : 'Cart',
      action: () => navigate('/cart'),
      active: isActive('/cart'),
      badge: cartCount,
    },
    {
      key: 'profile',
      icon: UserIcon,
      label: isArabic ? 'حسابي' : 'Profile',
      action: () => navigate('/profile'),
      active: isActive('/profile'),
    },
  ];

  return (
    <>
      {/* Categories Drawer Backdrop */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] lg:hidden"
            onClick={() => setShowCategories(false)}
          />
        )}
      </AnimatePresence>

      {/* Categories Slide-Up Drawer */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            ref={drawerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed bottom-[72px] left-0 right-0 z-[999] lg:hidden"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="mx-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[70vh] flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">
                  {isArabic ? 'الفئات' : 'Categories'}
                </h2>
                <button
                  onClick={() => setShowCategories(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Category List */}
              <div className="overflow-y-auto flex-1 p-3">
                {/* All Products */}
                <button
                  onClick={() => { setShowCategories(false); navigate('/products'); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors text-left group"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition-colors">
                    <LayoutGridIcon className="w-4 h-4" />
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {isArabic ? 'جميع المنتجات' : 'All Products'}
                  </span>
                </button>

                {/* Category Items */}
                {categories.map((category) => {
                  const name = isArabic ? category.name_ar : category.name_en;
                  const hasSubcategories = category.subcategories?.length > 0;
                  const isExpanded = expandedCategories.includes(category._id);

                  return (
                    <div key={category._id} className="flex flex-col">
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => handleCategorySelect(category._id)}
                          className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-800 text-sm">{name}</span>
                        </button>
                        {hasSubcategories && (
                          <button
                            onClick={() => toggleCategory(category._id)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors shrink-0"
                          >
                            <motion.span
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-center"
                            >
                              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                            </motion.span>
                          </button>
                        )}
                      </div>

                      {/* Subcategories */}
                      <AnimatePresence>
                        {hasSubcategories && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {category.subcategories.map((sub) => {
                              const subName = isArabic ? sub.name_ar : sub.name_en;
                              return (
                                <button
                                  key={sub._id}
                                  onClick={() => handleCategorySelect(sub._id)}
                                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-amber-50 transition-colors text-left"
                                  style={{ paddingInlineStart: '2.5rem' }}
                                >
                                  <span className="text-xs text-amber-500 shrink-0">└</span>
                                  <span className="text-sm text-gray-600">{subName}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[997] lg:hidden px-3 pb-3">
        <nav
          className="flex items-center justify-around bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/60 px-2 py-2"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={item.action}
                className="flex flex-col items-center gap-1 flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative group"
                aria-label={item.label}
              >
                {/* Active indicator */}
                {item.active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-amber-50 rounded-xl"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}

                {/* Icon container */}
                <span className="relative z-10 flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      item.active ? 'text-amber-600' : 'text-gray-500 group-hover:text-amber-500'
                    }`}
                  />
                  {/* Cart badge */}
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </span>

                {/* Label */}
                <span
                  className={`relative z-10 text-[10px] font-medium leading-none transition-colors duration-200 ${
                    item.active ? 'text-amber-600' : 'text-gray-500 group-hover:text-amber-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MobileBottomNav;
