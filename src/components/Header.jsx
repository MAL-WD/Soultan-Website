import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';

const NAV_BG = 'bg-[linear-gradient(180deg,rgba(16,16,16,0.9)_0%,rgba(21,48,43,0.9)_100%)]';
const BACKDROP = 'backdrop-blur-[5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5px)_brightness(100%)]';

const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      dispatch(clearCartItems());
      setIsMobileMenuOpen(false);
      navigate('/login');
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setIsMobileMenuOpen(false);
  };

  const LanguageSwitcher = () => (
    <button
      onClick={() => changeLanguage(currentLang.startsWith('en') ? 'ar' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5"
    >
      {currentLang.startsWith('en') ? (
        <>
          <div className="w-5 h-5 rounded-full bg-[#1b4332] flex items-center justify-center text-white text-xs font-bold leading-none pb-0.5" style={{ fontFamily: 'ThmanyahSerifDisplay, Arial, sans-serif' }}>
            ض
          </div>
          <span className="text-[#fcfcfa] text-sm font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>AR</span>
        </>
      ) : (
        <>
          <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-5 h-5 rounded-full object-cover" />
          <span className="text-[#fcfcfa] text-sm font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>EN</span>
        </>
      )}
    </button>
  );

  const CartIcon = () => (
    <Link
      to={cartItems.length > 0 ? '/cart' : '/products'}
      className="relative text-[#fcfcfa] hover:opacity-80 transition-opacity"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <ShoppingCart className="w-5 h-5" />
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#f2c161] text-[#02110c] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {cartItems.reduce((a, c) => a + c.quantity, 0)}
        </span>
      )}
    </Link>
  );

  return (
    <motion.header
      initial={{ y: -150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      className="fixed top-3 md:top-[18px] w-full flex justify-center z-50 pointer-events-none"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 pointer-events-auto flex justify-center">
        {/* ── DESKTOP NAV (≥1024px): centered pill ── */}
        <div className="hidden lg:flex justify-center">
          <nav className={`h-[72px] inline-flex items-center gap-6 px-6 rounded-[999px] ${NAV_BG} ${BACKDROP} border border-[#ffffff1a]`}>
            {/* Logo */}
            <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <img src="/logo.png" alt="Soltane" className="w-[46px] h-[46px] rounded-full object-cover" />
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10" />

            {/* Nav Links */}
            <Link to="/products" className="text-[#fcfcfa] text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
              {t('products')}
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="text-[#fcfcfa] text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1 whitespace-nowrap">
                {t('categories')}
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 pt-2 w-48 z-50">
                  <div className="bg-[rgba(16,16,16,0.95)] backdrop-blur-md border border-[#ffffff1a] rounded-lg shadow-lg py-2">
                    {categories.map((category) => (
                      <div key={category._id} className="relative group/sub">
                        <Link
                          to={`/products?category=${category._id}`}
                          className="flex items-center justify-between px-4 py-2 text-[#fcfcfa] text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          {currentLang.startsWith('ar') ? category.name_ar : category.name_en}
                          {category.subcategories?.length > 0 && (
                            <ChevronDown className={`w-3 h-3 ${currentLang.startsWith('ar') ? 'rotate-90' : '-rotate-90'}`} />
                          )}
                        </Link>

                        {category.subcategories?.length > 0 && (
                          <div className={`absolute top-0 ${currentLang.startsWith('ar') ? 'right-full mr-px' : 'left-full ml-px'} hidden group-hover/sub:block w-48 z-50`}>
                            <div className="bg-[rgba(16,16,16,0.95)] backdrop-blur-md border border-[#ffffff1a] rounded-lg shadow-lg py-2">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub._id}
                                  to={`/products?category=${sub._id}`}
                                  className="block px-4 py-2 text-[#fcfcfa] text-xs hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                                  onClick={() => setCategoriesOpen(false)}
                                >
                                  {currentLang.startsWith('ar') ? sub.name_ar : sub.name_en}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-[#fcfcfa] text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
              {t('about')}
            </Link>

            <Link to="/contact" className="text-[#fcfcfa] text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
              {t('contact')}
            </Link>

            {userInfo && userInfo.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-brand-color-accent text-sm font-bold hover:opacity-80 transition-opacity whitespace-nowrap border-s border-brand-color-accent/20 ps-6">
                {t('admin')}
              </Link>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-white/10" />

            {/* Right Actions */}
            <LanguageSwitcher />
            <CartIcon />

            {userInfo ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="text-[#fcfcfa] text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{userInfo.name}</span>
                </Link>
                <button onClick={logoutHandler} className="text-[#fcfcfa] hover:opacity-80 transition-opacity">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="h-9 rounded-[999px] bg-[linear-gradient(339deg,rgba(250,219,157,0.7)_0%,rgba(242,193,97,1)_56%,rgba(252,221,159,0.52)_100%)] hover:opacity-90 transition-opacity border-0 text-[#02110c]">
                  {t('signin')}
                </Button>
              </Link>
            )}
          </nav>
        </div>

        {/* ── MOBILE/TABLET BAR (<1024px): pill bar ── */}
        <div className="lg:hidden w-full flex flex-col items-center">
          <nav className={`h-[64px] w-full px-4 flex items-center justify-between rounded-full ${NAV_BG} ${BACKDROP} border border-[#ffffff1a] relative`}>
            {/* Left: Hamburger + Cart */}
            <div className="flex items-center gap-3">
              <button
                className="text-[#fcfcfa] hover:opacity-80 transition-opacity"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <CartIcon />
            </div>

            {/* Center: Logo */}
            <Link to="/" className="hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Soltane" className="w-[42px] h-[42px] rounded-full object-cover" />
            </Link>

            {/* Right: User + Lang */}
            <div className="flex items-center gap-3">
              {userInfo ? (
                <Link to="/profile" className="text-[#fcfcfa] hover:opacity-80 transition-opacity flex items-center gap-1.5" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">{userInfo.name}</span>
                </Link>
              ) : null}
              <LanguageSwitcher />
            </div>
          </nav>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`w-full overflow-hidden ${NAV_BG} ${BACKDROP} border border-[#ffffff1a] rounded-[24px] mt-2 shadow-xl`}
              >
                <div className="flex flex-col p-5 gap-4">
                  <Link to="/products" className="text-[#fcfcfa] text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('products')}
                  </Link>

                  {/* Mobile Categories */}
                  <div className="flex flex-col">
                    <button
                      className="text-[#fcfcfa] text-base font-medium flex items-center justify-between w-full"
                      onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    >
                      {t('categories')}
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {mobileCategoriesOpen && categories.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col gap-2 mt-2 ms-4 border-s border-[#ffffff1a] ps-4"
                        >
                          {categories.map((category) => (
                            <Link
                              key={category._id}
                              to={`/products?category=${category._id}`}
                              className="text-[#fcfcfa]/80 text-sm py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {currentLang.startsWith('ar') ? category.name_ar : category.name_en}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link to="/about" className="text-[#fcfcfa] text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('about')}
                  </Link>

                  <Link to="/contact" className="text-[#fcfcfa] text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('contact')}
                  </Link>

                  {userInfo && userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard" className="text-brand-color-accent text-base font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                      {t('admin')}
                    </Link>
                  )}

                  {!userInfo && (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full h-10 rounded-[999px] bg-[linear-gradient(339deg,rgba(250,219,157,0.7)_0%,rgba(242,193,97,1)_56%,rgba(252,221,159,0.52)_100%)] hover:opacity-90 transition-opacity border-0 text-[#02110c] font-semibold">
                        {t('signin')}
                      </Button>
                    </Link>
                  )}

                  <div className="h-px w-full bg-[#ffffff1a]" />

                  <div className="flex items-center justify-between">
                    {userInfo && (
                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-2 text-[#fcfcfa] hover:opacity-80 transition-opacity px-4 py-2 bg-white/5 rounded-full border border-white/5"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">{t('logout')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
