import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetActiveBannersQuery } from '../slices/bannersApiSlice';

export const AnnouncementBanner = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'ar').toLowerCase();
  const isArabic = currentLang.startsWith('ar');
  const isFrench = currentLang.startsWith('fr');

  const { data, isLoading } = useGetActiveBannersQuery({ type: 'announcement' });
  const banners = data?.data || [];

  const [isVisible, setIsVisible] = useState(true);

  // Check if dismissed previously
  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement_dismissed');
    if (dismissed) setIsVisible(false);
  }, []);

  if (isLoading || banners.length === 0 || !isVisible) return null;

  // Helper to get correct language text
  const getLangText = (b, field) => {
    if (isArabic && b[`${field}_ar`]) return b[`${field}_ar`];
    if (isFrench && b[`${field}_fr`]) return b[`${field}_fr`];
    if (b[`${field}_en`]) return b[`${field}_en`];
    // fallback
    return b[`${field}_ar`] || b[`${field}_fr`] || b[`${field}_en`] || '';
  };

  const tickerItems = banners.map((b) => ({
    ...b,
    text: getLangText(b, 'text'),
    linkText: getLangText(b, 'link_text'),
  }));

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcement_dismissed', 'true');
  };

  const bgColor = banners[0]?.bg_color || '#023c12';
  const textColor = banners[0]?.text_color || '#ffffff';

  return (
    <div
      className="relative w-full overflow-hidden flex items-center min-h-[40px]"
      style={{ backgroundColor: bgColor, color: textColor }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <style>{`
        @keyframes ticker-ltr {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        @keyframes ticker-rtl {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100%); }
        }
        .animate-ticker-ltr {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-ltr 25s linear infinite;
          padding-left: 100vw;
        }
        .animate-ticker-rtl {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-rtl 25s linear infinite;
          padding-right: 100vw;
        }
        .animate-ticker-ltr:hover, .animate-ticker-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full overflow-hidden">
        <div className={isArabic ? 'animate-ticker-rtl' : 'animate-ticker-ltr'}>
          {tickerItems.map((item, i) => (
            <div key={i} className="inline-flex items-center mx-16">
              <span className="text-sm font-medium tracking-wide">{item.text}</span>
              {item.link_url && (
                <Link
                  to={item.link_url}
                  className="mx-3 inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {item.linkText || (isArabic ? 'تسوق الآن' : 'Shop Now')}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fade Gradients for smooth entrance/exit */}
      <div className={`absolute top-0 bottom-0 left-0 w-8 pointer-events-none z-0`} style={{ backgroundImage: `linear-gradient(to right, ${bgColor}, transparent)` }} />
      <div className={`absolute top-0 bottom-0 right-0 w-8 pointer-events-none z-0`} style={{ backgroundImage: `linear-gradient(to left, ${bgColor}, transparent)` }} />

      <button
        onClick={handleDismiss}
        className="absolute right-2 z-10 p-1.5 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
};

