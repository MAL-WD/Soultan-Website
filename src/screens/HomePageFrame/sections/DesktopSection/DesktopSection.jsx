import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  { icon: "/mask-group-4.svg", textKey: "feature_case" },
  { icon: "/mask-group-2.svg", textKey: "feature_charger" },
  { icon: "/mask-group-1.svg", textKey: "feature_warranty" },
  { icon: "/mask-group.svg", textKey: "feature_shipping" },
];

export const DesktopSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <section className="relative w-full bg-neutral-100 py-32 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        
        {/* Header */}
        <header className="relative text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            <Badge className="mb-6 bg-[#02110c] hover:bg-[#02110c] text-neutral-100 rounded-full px-6 py-2 text-sm font-semibold tracking-tight shadow-lg border-white/20">
              {t("packsBadge")}
            </Badge>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: smoothEase }}
            className="[font-family:'Inter',Helvetica] font-bold text-[#02110c] text-5xl sm:text-7xl tracking-tighter leading-tight mb-6"
          >
            {t("packsTitle")}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: smoothEase }}
            className="[font-family:'Inter',Helvetica] font-medium text-[#424242] text-lg sm:text-xl leading-relaxed max-w-[500px] opacity-80"
          >
            {t("packsDescription")}
          </motion.p>
        </header>

        {/* Content Display */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">
          
          {/* Left Decorative Image */}
          <motion.img
            initial={{ opacity: 0, x: isRTL ? 100 : -100, rotate: isRTL ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: smoothEase }}
            className="hidden lg:block w-[350px] xl:w-[450px] aspect-[4/5] object-contain drop-shadow-2xl"
            alt="Decoration Left"
            src="/helper-mask-group.svg"
          />

          {/* Central Pricing Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}
            className="relative p-1 rounded-[32px] bg-gradient-to-b from-[#ffc10d] via-[#71b83e] to-[#023c12] shadow-2xl group"
          >
            <Card className="w-full sm:w-[500px] bg-white rounded-[28px] border-0 relative overflow-hidden">
              {/* Subtle Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#f2c161]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <CardContent className="relative p-10 pt-16 flex flex-col items-center text-center">
                <div className="flex flex-col gap-4 mb-12">
                  <div className="[font-family:'Geist',Helvetica] font-black text-[#02110c] text-7xl sm:text-8xl tracking-tighter leading-none group-hover:scale-110 transition-transform duration-500">
                    $299
                  </div>
                  <div className="relative inline-block self-center">
                    <span className="[font-family:'Geist',Helvetica] font-bold text-[#9ca3af] text-3xl sm:text-4xl tracking-tight opacity-60">
                      $349
                    </span>
                    <div className="absolute w-full top-1/2 left-0 h-[3px] bg-red-400 rotate-[-12deg] shadow-sm" />
                  </div>
                </div>

                <div className="w-full space-y-8 mb-12">
                   <div className="flex flex-col gap-2">
                      <span className="[font-family:'Geist',Helvetica] font-bold text-[#02110c] text-xl tracking-tight">
                        {t("launchOffer")}
                      </span>
                      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                   </div>
                   
                   <div className="space-y-4 text-left inline-block" dir={isRTL ? "rtl" : "ltr"}>
                      {features.map((feature, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-4 group/item"
                        >
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center p-1.5 group-hover/item:bg-[#f2c161] transition-colors duration-300">
                            <img src={feature.icon} alt="Icon" className="w-full h-full object-contain" />
                          </div>
                          <span className="[font-family:'Inter',Helvetica] font-medium text-[#424242] text-base group-hover/item:text-[#02110c] transition-colors duration-300">
                            {t(feature.textKey)}
                          </span>
                        </motion.div>
                      ))}
                   </div>
                </div>

                <Link to="/products" className="w-full">
                  <Button className="w-full h-[56px] bg-[#f2c161] hover:bg-[#02110c] hover:text-white text-[#02110c] rounded-2xl shadow-xl transition-all duration-500 flex items-center justify-center gap-3">
                    <span className="[font-family:'Inter',Helvetica] font-bold text-lg tracking-tight">
                      {t("preOrderNow")}
                    </span>
                    <img
                      className={`${isRTL ? 'rotate-180' : ''} w-4 h-4 transition-transform group-hover:translate-x-1`}
                      alt="Arrow"
                      src="/left-arrow-alt---svg.svg"
                    />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Decorative Image */}
          <motion.img
            initial={{ opacity: 0, x: isRTL ? -100 : 100, rotate: isRTL ? -10 : 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: smoothEase }}
            className="hidden lg:block w-[350px] xl:w-[450px] aspect-[4/5] object-contain drop-shadow-2xl"
            alt="Decoration Right"
            src="/helper-mask-group-1.svg"
          />
        </div>
      </div>

      {/* Background decoration elements */}
      <div className="absolute top-[30%] left-[-5%] w-[30%] h-[30%] bg-radial-gradient from-[#f2c161]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-radial-gradient from-[#71b83e]/10 to-transparent blur-[120px] pointer-events-none" />
    </section>
  );
};
