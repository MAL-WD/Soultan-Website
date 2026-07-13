import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import casque1 from "../../../../assets/casques/1.avif";
import casque2 from "../../../../assets/casques/2.avif";
import casque3 from "../../../../assets/casques/3.avif";
import casque4 from "../../../../assets/casques/4.avif";
import ellipseImage from "../../../../assets/Ellipse.png";

export const DesignAndBuildSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedColorId, setSelectedColorId] = useState(1);

  const colorOptions = [
    { id: 1, hex: "bg-[#1a1a1a]", label: "color_1", image: casque1 },
    { id: 2, hex: "bg-[#f9fafb]", label: "color_2", image: casque2 },
    { id: 3, hex: "bg-[#a3e635]", label: "color_3", image: casque3 },
    { id: 4, hex: "bg-[#3b82f6]", label: "color_4", image: casque4 },
  ];

  const activeColor = colorOptions.find(c => c.id === selectedColorId);

  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <section className="w-full bg-neutral-100 py-12 sm:py-24 px-4 sm:px-6 overflow-hidden relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Gold Bullet Accent */}
      <img
        src={ellipseImage}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain"
        style={{ zIndex: 0 }}
      />
      <div className="container mx-auto flex flex-col items-center gap-16 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="bg-[linear-gradient(90deg,rgba(204,179,96,1)_0%,rgba(2,17,12,1)_50%,rgba(242,193,97,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Geist',Helvetica] font-semibold text-xl sm:text-2xl md:text-3xl tracking-tight"
          >
            {t("designBuilt")}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: smoothEase }}
            className="[font-family:'Inter',Helvetica] font-bold text-[#02110c] text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none"
          >
            {t("chooseStyle")}
          </motion.h2>
        </div>

        {/* Product Display Section */}
        <div className="relative w-full max-w-[1000px] flex flex-col items-center gap-12 group">
          
          {/* Main Product Image with Animation */}
          <div className="relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] aspect-[1/1] flex items-center justify-center">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-radial-gradient from-[#f2da61]/20 to-transparent blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700`} />
            
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedColorId}
                initial={{ opacity: 0, scale: 0.9, rotate: -2, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, rotate: 2, filter: "blur(6px)" }}
                transition={{ duration: 0.25, ease: smoothEase }}
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_45px_45px_rgba(0,0,0,0.2)] transition-all duration-700"
                alt={t(activeColor.label)}
                src={activeColor.image}
              />
            </AnimatePresence>
          </div>

          {/* Color Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, ease: smoothEase }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col items-center gap-4">
              <span className="[font-family:'Geist',Helvetica] font-bold text-[#02110c] text-xl tracking-tight transition-all duration-300">
                {t(activeColor.label)}
              </span>

              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-3 rounded-full border border-white shadow-xl">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedColorId(option.id)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${option.hex} border-4 transition-all duration-300 shadow-md transform hover:scale-110 active:scale-95 ${
                      selectedColorId === option.id 
                        ? "border-[#f2da61] scale-125 shadow-lg z-10" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={t(option.label)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
