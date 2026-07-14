import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { SectionHeader } from "../../../../components/SectionHeader/SectionHeader";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../../slices/categoriesApiSlice";
import bagsImage from "../../../../assets/categories/bags.png";
import chessImage from "../../../../assets/categories/chess.png";
import ellipseImage from "../../../../assets/Ellipse.png";

const featureCards = [
  {
    titleKey: "cat_tech_title",
    subtitleKey: "cat_tech_subtitle",
    bgGradient: "bg-[linear-gradient(180deg,rgba(82,127,239,0.2)_0%,rgba(249,250,251,1)_100%)]",
    borderColor: "border-[#527fef33]",
    hoverBorderColor: "hover:border-[#527fef]/50",
    titleColor: "text-[#527fef]",
    subtitleColor: "text-black",
    image: "/image---a-part-of-the-black-headphone.png",
    gridArea: "md:col-span-2 md:row-span-1",
    titleSize: "text-2xl sm:text-[32px] lg:text-[40px] leading-tight",
    subtitleSize: "text-3xl sm:text-4xl lg:text-5xl leading-tight",
    contentPadding: "p-6 sm:p-8",
    gap: "gap-6 sm:gap-10",
    animationType: "left",
    matchKeyword: "Tech",
  },
  {
    titleKey: "cat_books_title",
    subtitleKey: null,
    bgGradient: "bg-[linear-gradient(180deg,rgba(138,7,48,0.8)_0%,rgba(243,244,246,1)_100%)]",
    borderColor: "border",
    hoverBorderColor: "hover:border-black/30",
    titleColor: "text-black",
    subtitleColor: null,
    image: "/phone-mask-group.svg",
    gridArea: "md:col-span-1 md:row-span-1",
    titleSize: "text-xl sm:text-2xl leading-tight",
    subtitleSize: null,
    contentPadding: "p-6 sm:p-10",
    imagePosition: "bottom-0 h-[70%]",
    animationType: "bottom",
    matchKeyword: "Book",
  },
  {
    titleKey: "cat_office_title",
    subtitleKey: null,
    bgGradient: "bg-[linear-gradient(0deg,rgba(242,243,245,0)_11%,rgba(242,225,97,1)_100%)]",
    borderColor: "border",
    hoverBorderColor: "hover:border-[#d4af37]/50",
    titleColor: "text-black",
    subtitleColor: null,
    image: "/battery-mask-group.svg",
    gridArea: "md:col-span-1 md:row-span-1",
    titleSize: "text-xl sm:text-2xl leading-tight",
    subtitleSize: null,
    contentPadding: "p-6 sm:p-10",
    imagePosition: "bottom-0 w-full h-[90%] object-bottom",
    animationType: "bottom",
    matchKeyword: "Office",
  },
  {
    titleKey: "cat_scents_title",
    subtitleKey: "cat_scents_subtitle",
    bgGradient: "bg-[linear-gradient(180deg,rgba(249,250,251,1)_7%,rgba(21,138,21,0.33)_100%)]",
    borderColor: "border-[#023d134a]",
    hoverBorderColor: "hover:border-[#15302b]/50",
    titleColor: "text-[#15302b]",
    subtitleColor: "text-black",
    image: "/image-mask-group.svg",
    gridArea: "md:col-span-2 md:row-span-1",
    titleSize: "text-2xl sm:text-[32px] lg:text-[40px] leading-tight",
    subtitleSize: "text-3xl sm:text-4xl lg:text-5xl leading-tight",
    contentPadding: "p-6 sm:p-8",
    gap: "gap-6 sm:gap-12",
    imagePosition: "bottom-0 right-0 w-[60%] h-[80%] object-right-bottom",
    animationType: "right",
    matchKeyword: "Scents",
  },
  {
    titleKey: "cat_edu_title",
    subtitleKey: "cat_edu_subtitle",
    bgGradient: "bg-[linear-gradient(180deg,rgba(146,64,14,0.3)_0%,rgba(249,250,251,1)_100%)]",
    borderColor: "border-[#92400e33]",
    hoverBorderColor: "hover:border-[#92400e]/50",
    titleColor: "text-[#92400e]",
    subtitleColor: "text-black",
    image: chessImage,
    gridArea: "md:col-span-2 md:row-span-1",
    titleSize: "text-2xl sm:text-[32px] lg:text-[40px] leading-tight",
    subtitleSize: "text-3xl sm:text-4xl lg:text-5xl leading-tight",
    contentPadding: "p-6 sm:p-8",
    gap: "gap-6 sm:gap-10",
    imagePosition: "bottom-0 right-0 w-[60%] h-[80%] object-right-bottom",
    animationType: "left",
    matchKeyword: "Educational",
  },
  {
    titleKey: "cat_bags_title",
    subtitleKey: null,
    bgGradient: "bg-[linear-gradient(180deg,rgba(21,48,43,0.1)_0%,rgba(243,244,246,1)_100%)]",
    borderColor: "border",
    hoverBorderColor: "hover:border-black/30",
    titleColor: "text-black",
    subtitleColor: null,
    image: bagsImage,
    gridArea: "md:col-span-1 md:row-span-1",
    titleSize: "text-xl sm:text-2xl leading-tight",
    subtitleSize: null,
    contentPadding: "p-6 sm:p-10",
    imagePosition: "bottom-0 w-full h-[85%] object-bottom",
    animationType: "bottom",
    matchKeyword: "Bags",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: (type) => ({
    opacity: 0,
    x: type === "left" ? -100 : type === "right" ? 100 : 0,
    y: type === "bottom" ? 100 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageVariants = {
  hidden: (type) => ({
    scale: 0.8,
    opacity: 0,
    x: type === "left" ? -50 : type === "right" ? 50 : 0,
    y: type === "bottom" ? 50 : 0,
  }),
  visible: {
    scale: 1,
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const FeaturesSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const getCategoryLink = (matchKeyword) => {
    if (!categories || categories.length === 0) return `/products?category=${matchKeyword}`;
    
    const keyword = matchKeyword.toLowerCase();
    const found = categories.find(cat => {
      const nameEn = (cat.name_en || "").toLowerCase();
      const nameAr = (cat.name_ar || "").toLowerCase();
      const slug = (cat.slug || "").toLowerCase();
      return nameEn.includes(keyword) || nameAr.includes(keyword) || slug.includes(keyword);
    });

    if (found) {
      return `/products?category=${found._id}`;
    }
    return `/products?category=${matchKeyword}`;
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-[80px] pt-0 bg-neutral-100 relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Gold Bullet Accent - hidden on mobile */}
      <img
        src={ellipseImage}
        alt=""
        className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]"
        style={{ zIndex: 0 }}
      />
      <div className="container mx-auto px-4 sm:px-8 lg:px-[100px] relative z-10">
        <SectionHeader
          badgeText={t("categoriesBadge")}
          title={t("categoriesTitle")}
          description={t("categoriesDescription")}
        />

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              className={`${card.gridArea} h-full`}
              variants={cardVariants}
              custom={card.animationType}
            >
              <Link 
                to={getCategoryLink(card.matchKeyword)} 
                className="block h-full cursor-pointer group"
              >
                <Card
                  className={`h-full ${card.bgGradient} rounded-[20px] sm:rounded-[30px] overflow-hidden border ${card.borderColor} shadow-none relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${card.hoverBorderColor || 'hover:border-[#f2da61]/50'}`}
                >
                  <CardContent className="relative h-[220px] sm:h-[300px] md:h-[420px] p-0 overflow-hidden">
                    {/* Category Image with matching animation */}
                    <motion.img
                      src={card.image}
                      alt={t(card.titleKey)}
                      className={`absolute ${card.imagePosition || "inset-0 w-full h-full"} object-contain transition-transform duration-700 md:group-hover:scale-110 md:group-hover:-translate-y-4`}
                      variants={isMobile ? {} : imageVariants}
                      custom={card.animationType}
                    />

                    {/* Gradient Overlay for better text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    <div
                      className={`relative z-10 flex flex-col ${card.gap || "gap-4 sm:gap-6"} h-full ${card.contentPadding} pointer-events-none ${isRTL ? "text-right items-end justify-start" : "text-left items-start justify-start"}`}
                    >
                      <div
                        className={`font-semibold ${card.titleColor} ${card.titleSize} ${isRTL ? 'tracking-normal' : 'tracking-[-1.60px]'}`}
                        style={{ fontFamily: isRTL ? 'ThmanyahSerifDisplay, Arial, sans-serif' : "'Geist', Helvetica, sans-serif" }}
                      >
                        {t(card.titleKey)}
                      </div>
                      {card.subtitleKey && (
                        <div
                          className={`font-semibold ${card.subtitleColor} ${card.subtitleSize} ${isRTL ? 'tracking-normal' : 'tracking-[-1.92px]'} whitespace-pre-line`}
                          style={{ fontFamily: isRTL ? 'ThmanyahSerifDisplay, Arial, sans-serif' : "'Geist', Helvetica, sans-serif" }}
                        >
                          {t(card.subtitleKey)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
