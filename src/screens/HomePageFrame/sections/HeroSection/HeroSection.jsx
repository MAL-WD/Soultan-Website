import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotionValue } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import HeroBackground from "./HeroBackground";
import CursorGlow from "./CursorGlow";
import { ParallaxElement } from "../../../../components/ParallaxWrapper";

gsap.registerPlugin();

import giantLogo from "../../../../assets/partners/giant.png";
import algoLogo from "../../../../assets/partners/exine.png";
import vertexLogo from "../../../../assets/partners/vertex.png";
import kioseLogo from "../../../../assets/partners/kiose.png";
import technoLogo from "../../../../assets/partners/techno.png";

const partners = [
  { name: "Giant", logo: giantLogo },
  { name: "Algo", logo: algoLogo },
  { name: "Vertex", logo: vertexLogo },
  { name: "Kiose", logo: kioseLogo },
  { name: "Techno", logo: technoLogo },
];

export const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };


  const isRtl = i18n.language === 'ar';
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const avatarsRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const suppliersRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const isMobile = window.innerWidth < 768;

    // Glassmorphism card fades in and rises
    tl.fromTo(cardRef.current,
      { opacity: 0, y: isMobile ? 30 : 60, scale: isMobile ? 1 : 0.97, filter: isMobile ? "none" : "blur(12px)" },
      { opacity: 1, y: 0, scale: 1, filter: "none", duration: 1.1 },
    )
    // Avatars / social proof
    .fromTo(avatarsRef.current,
      { opacity: 0, y: 20, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
      "-=0.7"
    )
    // Title line 1 — letter-by-letter stagger
    .fromTo(title1Ref.current,
      { opacity: 0, y: 40, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      "-=0.4"
    )
    // Title line 2 — golden italic
    .fromTo(title2Ref.current,
      { opacity: 0, y: 30, skewX: isRtl ? 3 : -3, filter: "blur(6px)" },
      { opacity: 1, y: 0, skewX: 0, filter: "blur(0px)", duration: 0.9 },
      "-=0.5"
    )
    // Subtitle paragraph
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 20, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
      "-=0.5"
    )
    // CTA buttons pop in
    .fromTo(ctaRef.current,
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" },
      "-=0.4"
    );

    // Suppliers row floats up gently after everything
    gsap.fromTo(suppliersRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 1.4 }
    );

    // Subtle continuous float on card (disabled on mobile for performance)
    if (!isMobile) {
      gsap.to(cardRef.current, {
        y: "-=8",
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-[#02110c] bg-cover bg-center px-4 pt-[80px] pb-[140px] sm:pb-[80px] overflow-hidden"
      style={{ backgroundImage: "url('/container.png')" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeroBackground />
      <CursorGlow mouseX={mouseX} mouseY={mouseY} />
      
      <div className="w-full max-w-[1000px] relative z-10" dir={isRtl ? 'rtl' : 'ltr'}>
        <ParallaxElement speed={-0.1}>
          <div className="w-full flex flex-col items-center gap-12 text-center">
                {/* Main Content */}
                <div ref={cardRef} className="w-full max-w-4xl flex flex-col items-center justify-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" style={{ opacity: 0 }}>
                  {/* Avatars */}
                  <div ref={avatarsRef} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2" style={{ opacity: 0 }}>
                    <img
                      className="w-[120px] sm:w-[152px] h-8 sm:h-10"
                      alt="Avatars"
                      src="/avatars.svg"
                    />
                    <div className={`flex flex-col ${isRtl ? 'items-end' : 'items-start'}`}>
                      <img className="w-16 sm:w-20 h-4" alt="Stars" src="/stars-1.svg" />
                      <p className="[font-family:'Inter',Helvetica] font-medium text-white text-sm sm:text-base tracking-[0] leading-6 whitespace-nowrap">
                        {t('heroSocialProof')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 
                      ref={title1Ref}
                      className={`mb-2 text-[#e0e0e0] text-5xl sm:text-6xl lg:text-7xl tracking-[-3.60px] leading-snug break-words text-center ${isRtl ? 'font-black' : 'font-semibold'}`}
                      style={{ fontFamily: isRtl ? undefined : "'Inter', sans-serif", opacity: 0 }}
                    >
                      {t('heroTitle1')}
                    </h1>
                    <h1 
                      ref={title2Ref}
                      className={`italic text-[#f2c161] text-5xl sm:text-6xl lg:text-7xl tracking-[-3.60px] leading-snug text-center ${isRTL ? 'font-black' : 'font-normal'}`}
                      style={{ fontFamily: isRTL ? undefined : "'Instrument Serif', serif", opacity: 0 }}
                    >
                      {t('heroTitle2')}
                    </h1>
                  </div>

                  <div ref={subtitleRef} className="max-w-xl" style={{ opacity: 0 }}>
                    <p 
                      className="font-normal text-[#fffef0] text-base sm:text-lg tracking-[-0.34px] leading-relaxed"
                      style={{ fontFamily: isRtl ? 'inherit' : "'Satoshi', sans-serif" }}
                    >
                      {t('heroSubtitle')}
                    </p>
                  </div>

                  <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4" style={{ opacity: 0 }}>
                    <Link to="/contact">
                      <Button className="h-[45px] min-w-[140px] px-6 bg-[#f2c161] hover:bg-[#f2c161]/90 rounded-full shadow-[0px_10px_14px_-3px_#99810838] border-0 flex items-center justify-center gap-2">
                        <span className="font-medium text-[#02110c] text-base tracking-[-0.64px]" style={{ fontFamily: isRtl ? 'inherit' : "'Inter', Helvetica" }}>
                          {t('heroCTA1')}
                        </span>
                        <img className={`w-4 ${isRtl ? 'rotate-180' : ''}`} alt="Arrow" src="/left-arrow-alt---svg.svg" />
                      </Button>
                    </Link>

                    <Link to="/products">
                      <Button
                        variant="outline"
                        className="h-[45px] min-w-[140px] px-6 bg-[#e0e0e0] hover:bg-[#e0e0e0]/90 rounded-full shadow-[0px_10px_14px_-3px_#0000000f] border-0 text-[#02110c] flex items-center justify-center"
                      >
                        <span className="font-medium text-[#02110c] text-base tracking-[-0.64px]" style={{ fontFamily: isRtl ? 'inherit' : "'Inter', Helvetica" }}>
                          {t('heroCTA2')}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
          </div>
        </ParallaxElement>
      </div>

      {/* Suppliers merged into Hero */}
      <div ref={suppliersRef} className="absolute bottom-8 left-0 right-0 w-full max-w-[1440px] mx-auto px-4 flex flex-col gap-6 z-10 pointer-events-none" style={{ opacity: 0 }}>
        <div className="flex items-center justify-center self-center font-medium text-neutral-100/60 text-sm text-center tracking-wide uppercase" style={{ fontFamily: isRtl ? 'inherit' : "'Inter', Helvetica" }}>
          {t("suppliersTitle")}
        </div>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]" dir="ltr">
          <div className="flex items-center w-max animate-scroll-left">
            {/* First Set */}
            <div className="flex items-center gap-16 pr-16">
              {partners.map((partner, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 w-[100px] h-[40px] flex items-center justify-center transition-all duration-300 opacity-50"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter invert brightness-0"
                  />
                </div>
              ))}
            </div>
            
            {/* Second Set (Duplicate for seamless loop) */}
            <div className="flex items-center gap-16 pr-16">
              {partners.map((partner, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 w-[100px] h-[40px] flex items-center justify-center transition-all duration-300 opacity-50"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter invert brightness-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
