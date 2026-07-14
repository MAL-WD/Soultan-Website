import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { SectionHeader } from "../../../../components/SectionHeader/SectionHeader";
import ellipseImage from "../../../../assets/Ellipse.png";

const StepItem = ({ step, index, isRTL, t }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 30,
    restDelta: 0.001
  });

  // 1. Number activates first [0.1 - 0.2]
  const numberOpacity = useTransform(smoothProgress, [0.1, 0.2], [0.1, 1]);
  const numberScale = useTransform(smoothProgress, [0.1, 0.2], [1, 1.15]);
  
  // 2. Content appears as the line starts [0.2 - 0.45]
  const contentOpacity = useTransform(smoothProgress, [0.2, 0.45], [0, 1]);
  const contentY = useTransform(smoothProgress, [0.2, 0.45], [15, 0]);
  const contentBlur = useTransform(smoothProgress, [0.2, 0.42], ["blur(8px)", "blur(0px)"]);

  // 3. Connector line fills through the middle [0.2 - 0.7]
  const lineHeight = useTransform(smoothProgress, [0.2, 0.7], ["0%", "100%"]);
  const lineOpacity = useTransform(smoothProgress, [0.15, 0.3], [0.2, 1]);

  return (
    <motion.div 
      ref={ref}
      key={index} 
      className="relative flex flex-col sm:flex-row gap-8 sm:gap-12"
      initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Step Number & Connector */}
      <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-6 w-full sm:w-[120px] flex-shrink-0">
        <motion.div 
          style={{ 
            opacity: numberOpacity,
            scale: numberScale,
            background: "linear-gradient(135deg, #ccb360 0%, #f2c161 50%, #ffc44f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="[font-family:'Geist',Helvetica] font-black text-6xl sm:text-7xl tracking-tighter select-none pb-2 sm:pb-0"
        >
          {step.number}
        </motion.div>
        
        {step.hasConnector && (
          <div className="hidden sm:flex flex-1 w-[3px] bg-neutral-200/30 rounded-full min-h-[140px] relative overflow-hidden">
             <motion.div 
                style={{ height: lineHeight, opacity: lineOpacity }}
                className="absolute top-0 left-0 w-full bg-[linear-gradient(180deg,#f2c161,#ffc44f)] shadow-[0_0_20px_rgba(242,193,97,0.8)]"
             />
          </div>
        )}
        {/* Mobile Connector */}
        {step.hasConnector && (
          <div className="flex sm:hidden flex-1 h-[3px] bg-neutral-200/30 rounded-full relative overflow-hidden">
             <motion.div 
                style={{ width: lineHeight, opacity: lineOpacity }}
                className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} h-full bg-[linear-gradient(90deg,#f2c161,#ffc44f)] shadow-[0_0_20px_rgba(242,193,97,0.8)]`}
             />
          </div>
        )}
      </div>

      {/* Step Content */}
      <motion.div 
        style={{ opacity: contentOpacity, y: contentY }}
        className="flex-1 flex flex-col gap-6 group"
      >
        <div className="flex flex-col gap-4">
          <Badge className="bg-[#02110c] text-neutral-100 hover:bg-[#02110c] rounded-full px-4 py-1.5 w-fit shadow-lg transform transition-transform duration-500 group-hover:translate-y-[-2px]">
            <span className="[font-family:'Inter',Helvetica] font-medium text-xs sm:text-sm tracking-tight">
              {t(`step_badge_${index + 1}`)}
            </span>
          </Badge>

          <h3 className="[font-family:'Inter',Helvetica] font-bold text-[#02110c] text-2xl sm:text-3xl tracking-tight leading-snug group-hover:text-[#f2c161] transition-colors duration-500">
            {t(`step_title_${index + 1}`)}
          </h3>
        </div>

        <p className="[font-family:'Inter',Helvetica] font-medium text-[#424242] text-base sm:text-lg leading-relaxed opacity-80 max-w-[550px]">
          {t(`step_desc_${index + 1}`)}
        </p>

        <Link to="/products">
          <Button className="bg-[#f2c161] hover:bg-[#02110c] hover:text-white text-[#02110c] rounded-2xl w-fit h-[48px] px-8 transition-all duration-500 shadow-[0px_10px_20px_-5px_rgba(242,193,97,0.4)] hover:shadow-xl group">
            <span className="[font-family:'Inter',Helvetica] font-bold text-base tracking-tight">
              {t("getStarted")}
            </span>
            <img
              className={`w-4 h-4 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'} transition-transform duration-500 group-hover:translate-x-1`}
              alt="Arrow"
              src="/left-arrow-alt---svg.svg"
            />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

const steps = [
  { number: "01", hasConnector: true },
  { number: "02", hasConnector: true },
  { number: "03", hasConnector: false },
];

export const UserFlowSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section className="relative w-full bg-neutral-100 py-32 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Gold Bullet Accent - hidden on mobile */}
      <img
        src={ellipseImage}
        alt=""
        className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain"
        style={{ zIndex: 0 }}
      />
      <div className="container mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        <SectionHeader 
          badgeText={t("processBadge")}
          title={t("processTitle")}
          description={t("processDescription")}
        />

        <div className="flex flex-col gap-12 sm:gap-20 max-w-[800px] mx-auto">
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} isRTL={isRTL} t={t} />
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-radial-gradient from-[#f2c161]/10 back-transparent rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};
