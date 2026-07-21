import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollProgress from './components/ScrollProgress';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isProductsPath = location.pathname === '/products' || location.pathname.startsWith('/product/');

  useEffect(() => {
    // Apply font family based on language
    const root = document.documentElement;
    const lang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
    if (lang.startsWith('ar')) {
      root.style.fontFamily = 'ThmanyahSerifDisplay, ThmanyahSerifText, Arial, sans-serif';
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.style.fontFamily = 'Satoshi, Inter, sans-serif';
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', lang.startsWith('fr') ? 'fr' : 'en');
    }
  }, [i18n.language, i18n.resolvedLanguage]);

  return (
    <ThemeProvider>
      <ScrollProgress />
      <SmoothScroll>
        <Preloader />
        {!isAdminPath && <Header />}
        <main>
          <div className={isAdminPath ? '' : (['/', '/contact', '/about'].includes(location.pathname) ? 'pb-20 lg:pb-0' : isProductsPath ? 'pt-[100px] pb-20 lg:pb-0' : 'pt-[140px] pb-20 lg:pb-0 bg-[#fafbfc]')}>
            <Outlet />
          </div>
        </main>
        {!isAdminPath && <Footer />}
        {!isAdminPath && <MobileBottomNav />}
        <ToastContainer />
      </SmoothScroll>
    </ThemeProvider>
  );
};

export default App;
