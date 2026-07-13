import React from "react";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "../../../slices/categoriesApiSlice";
import crownImage from "../../../assets/crown.png";

const fallbackCategories = {
  ar: [
    "أدوات مكتبية",
    "أدوات مدرسية",
    "دفاتر وكشاكيل",
    "أقلام فاخرة",
    "أدوات الرسم",
    "حقائب مدرسية",
    "أدوات هندسية",
    "مستلزمات فنية"
  ],
  en: [
    "Office Stationery",
    "School Supplies",
    "Notebooks & Papers",
    "Fine Writing Pens",
    "Drawing Tools",
    "School Bags",
    "Geometry Tools",
    "Art Materials"
  ]
};

export const CategoriesMarqueeSection = () => {
  const { i18n } = useTranslation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const isRtl = i18n.language === 'ar';

  // Extract category names or use fallbacks
  let displayCategories = [];
  if (categoriesData?.data && categoriesData.data.length > 0) {
    displayCategories = categoriesData.data.map(cat => isRtl ? cat.name_ar : cat.name_en);
  } else {
    displayCategories = isRtl ? fallbackCategories.ar : fallbackCategories.en;
  }

  // Double/triple the list to ensure there's enough content to scroll seamlessly
  const topRowCategories = [...displayCategories, ...displayCategories];
  const bottomRowCategories = [...displayCategories].reverse(); // reverse for variety
  const bottomRowRepeated = [...bottomRowCategories, ...bottomRowCategories];

  return (
    <section className="w-full bg-transparent py-12  flex flex-col gap-6 overflow-hidden select-none">
      
      {/* Top Bar - Scrolls Left to Right */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]" dir="ltr">
        <div className="flex items-center w-max animate-scroll-right-slow">
          {/* First Set */}
          <div className="flex items-center gap-6 pr-6">
            {topRowCategories.map((name, index) => (
              <React.Fragment key={`top-1-${index}`}>
                <div className="flex-shrink-0 min-w-[160px] sm:min-w-[200px] flex items-center justify-center bg-[#03291c] border border-[#f2da61]/20 rounded-full px-6 py-3 transition-all duration-300 hover:border-[#f2da61]/40">
                  <span className="text-[#fffef0] font-normal italic text-base sm:text-lg tracking-wide" style={{ fontFamily: isRtl ? 'ThmanyahSerifDisplay, Arial, sans-serif' : "'Instrument Serif', serif" }}>
                    {name}
                  </span>
                </div>
                <img 
                  src={crownImage} 
                  alt="Crown Separator" 
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              </React.Fragment>
            ))}
          </div>
          
          {/* Second Set */}
          <div className="flex items-center gap-6 pr-6">
            {topRowCategories.map((name, index) => (
              <React.Fragment key={`top-2-${index}`}>
                <div className="flex-shrink-0 min-w-[160px] sm:min-w-[200px] flex items-center justify-center bg-[#03291c] border border-[#f2da61]/20 rounded-full px-6 py-3 transition-all duration-300 hover:border-[#f2da61]/40">
                  <span className="text-[#fffef0] font-normal italic text-base sm:text-lg tracking-wide" style={{ fontFamily: isRtl ? 'ThmanyahSerifDisplay, Arial, sans-serif' : "'Instrument Serif', serif" }}>
                    {name}
                  </span>
                </div>
                <img 
                  src={crownImage} 
                  alt="Crown Separator" 
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar - Scrolls Right to Left */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]" dir="ltr">
        <div className="flex items-center w-max animate-scroll-left-slow">
          {/* First Set */}
          <div className="flex items-center gap-6 pr-6">
            {bottomRowRepeated.map((name, index) => (
              <React.Fragment key={`bottom-1-${index}`}>
                <div className="flex-shrink-0 min-w-[160px] sm:min-w-[200px] flex items-center justify-center bg-[#03291c] border border-[#f2da61]/20 rounded-full px-6 py-3 transition-all duration-300 hover:border-[#f2da61]/40">
                  <span className="text-[#fffef0] font-normal italic text-base sm:text-lg tracking-wide" style={{ fontFamily: isRtl ? 'ThmanyahSerifDisplay, Arial, sans-serif' : "'Instrument Serif', serif" }}>
                    {name}
                  </span>
                </div>
                <img 
                  src={crownImage} 
                  alt="Crown Separator" 
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              </React.Fragment>
            ))}
          </div>
          
          {/* Second Set */}
          <div className="flex items-center gap-6 pr-6">
            {bottomRowRepeated.map((name, index) => (
              <React.Fragment key={`bottom-2-${index}`}>
                <div className="flex-shrink-0 min-w-[160px] sm:min-w-[200px] flex items-center justify-center bg-[#03291c] border border-[#f2da61]/20 rounded-full px-6 py-3 transition-all duration-300 hover:border-[#f2da61]/40">
                  <span className="text-[#fffef0] font-normal italic text-base sm:text-lg tracking-wide" style={{ fontFamily: isRtl ? 'ThmanyahSerifDisplay, Arial, sans-serif' : "'Instrument Serif', serif" }}>
                    {name}
                  </span>
                </div>
                <img 
                  src={crownImage} 
                  alt="Crown Separator" 
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
