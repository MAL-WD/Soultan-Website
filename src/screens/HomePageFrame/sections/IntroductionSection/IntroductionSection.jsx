import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextColorLetters } from "./TextColorLetters";
import hhhImage from "../../../../assets/hhh.png";
import ellipseImage from "../../../../assets/Ellipse.png";

export const IntroductionSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "start 0.25"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.8], [0.95, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.4], [0.5, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-neutral-100 pt-[80px] md:pt-[120px] pb-[60px] md:pb-[100px] px-6 sm:px-12 md:px-24 lg:px-32 overflow-hidden flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Gold Bullet Accent - moved lower, hidden on mobile */}
      <img
        src={ellipseImage}
        alt=""
        className="hidden md:block absolute top-2/3 left-0 -translate-y-1/2 pointer-events-none w-[280px] h-auto object-contain opacity-60"
        style={{ zIndex: 0 }}
      />
      {/* No top fade here, handled differently if needed */}
      <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center text-center relative z-10">

        {/* Image with cloud fade + label overlaid at the bottom */}
        <motion.div
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="relative w-[260px] sm:w-[340px] md:w-[440px] flex-shrink-0"
        >
          <img
            className="w-full h-auto object-contain block"
            alt="Intro Background"
            src={hhhImage}
          />

          {/* Cloud/fade gradient at the bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, #f5f5f5 85%)",
            }}
          />

          {/* Label sitting on top of the fade, at the very bottom of the image */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute bottom-2 left-0 right-0 z-10 text-brand-color-accent text-base sm:text-lg font-semibold tracking-wide"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {isRTL ? 'من مكتبة السلطان ؟' : 'Meet Soltane'}
          </motion.p>
        </motion.div>

        {/* Reveal Text — snug below the image block */}
        <div className="w-full max-w-[1000px] mt-2">
          <TextColorLetters
            text={t('introText')}
            fontSize={window.innerWidth < 640 ? 24 : window.innerWidth < 1024 ? 36 : 48}
            lineHeight={1.3}
            letterSpacing={isRTL ? 0 : -2}
            duration={0.5}
            fontWeight={700}
            fontFamily={isRTL ? 'ThmanyahSerifDisplay, ThmanyahSerifText, Arial, sans-serif' : 'Inter, Helvetica, sans-serif'}
            transitionStartIndex={isRTL ? 0 : 40}
            paragraphAlign="center"
            isRTL={isRTL}
          />
        </div>

      </div>
    </section>
  );
};
