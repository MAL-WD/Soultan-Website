import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

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
      root.setAttribute('lang', 'en');
    }
  }, [i18n.language, i18n.resolvedLanguage]);

  return (
    <SmoothScroll>
      <Preloader />
      {!isAdminPath && <Header />}
      <main>
        <div className={isAdminPath ? '' : (['/', '/contact', '/about'].includes(location.pathname) ? '' : 'pt-[140px] bg-[#fafbfc]')}>
          <Outlet />
        </div>
      </main>
      {!isAdminPath && <Footer />}
      <ToastContainer />
    </SmoothScroll>
  );
};

export default App;
