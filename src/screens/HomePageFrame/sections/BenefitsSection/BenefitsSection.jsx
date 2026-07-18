import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShoppingCart, Truck, ShieldCheck, Gift, Headset, Crown } from "lucide-react";
import { SectionHeader } from "../../../../components/SectionHeader/SectionHeader";

const benefitKeys = [2, 4, 5, 7, 8, 9];

const benefitsData = [
  {
    number: "01",
    Icon: ShoppingCart,
    image: "/benefits/all_in_one_store.png",
    bgColor: "#02110c",
    textColor: "#f7f8ff",
    accentColor: "#f2da61",
  },
  {
    number: "02",
    Icon: Truck,
    image: "/benefits/fast_delivery.png",
    bgColor: "#f2da61",
    textColor: "#02110c",
    accentColor: "#03291c",
  },
  {
    number: "03",
    Icon: ShieldCheck,
    image: "/benefits/trusted_schools.png",
    bgColor: "#03291c",
    textColor: "#f7f8ff",
    accentColor: "#f2da61",
  },
  {
    number: "04",
    Icon: Gift,
    image: "/benefits/exclusive_packs.png",
    bgColor: "#f7f8ff",
    textColor: "#02110c",
    accentColor: "#02110c",
  },
  {
    number: "05",
    Icon: Headset,
    image: "/benefits/customer_support.png",
    bgColor: "#02110c",
    textColor: "#f7f8ff",
    accentColor: "#f2da61",
  },
  {
    number: "06",
    Icon: Crown,
    image: "/benefits/brand_experience.png",
    bgColor: "#f2da61",
    textColor: "#02110c",
    accentColor: "#02110c",
  },
];

export const BenefitsSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const container = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Filter out any nulls from strict mode double-invocations
      const cards = cardRefs.current.filter(Boolean);
      const totalCards = cards.length;

      if (!cards[0]) return;

      gsap.set(cards[0], { yPercent: 0, scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cards[i], { yPercent: 100, scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: () => `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        const position = i;
        if (!currentCard || !nextCard) continue;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.7,
            rotation: isRTL ? -5 : 5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextCard,
          {
            yPercent: 0,
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className="relative w-full bg-neutral-100 pb-20" ref={container} dir={isRTL ? "rtl" : "ltr"}>
      <div className="pt-16 sm:pt-24 pb-2 sm:pb-8 px-6">
        <SectionHeader
          badgeText={t("benefitsBadge")}
          title={t("benefitsTitle")}
          description={t("benefitsDescription")}
        />
      </div>

      <div className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden p-2 sm:p-3 lg:p-8">
        <div className="relative h-[480px] md:h-[90%] w-full max-w-[1200px] max-h-[700px] overflow-hidden rounded-3xl">
          {benefitsData.map((benefit, i) => {
             const IconComponent = benefit.Icon;
             return (
             <div
               key={i}
               ref={(el) => {
                 cardRefs.current[i] = el;
               }}
               className="absolute h-full w-full rounded-3xl overflow-hidden shadow-2xl"
               style={{ backgroundColor: benefit.bgColor }}
             >
                <span
                  className="absolute font-black select-none pointer-events-none"
                  style={{
                    color: benefit.accentColor,
                    opacity: 0.12,
                    fontSize: "clamp(120px, 20vw, 220px)",
                    lineHeight: 1,
                    bottom: "-10px",
                    [isRTL ? "left" : "right"]: "24px",
                  }}
                >
                  {benefit.number}
                </span>

                <div className="relative z-10 w-full h-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-24 px-6 sm:px-16 py-8 sm:py-16">
                  <div 
                    className="flex flex-col gap-5 max-w-[500px]"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${benefit.accentColor}22`, color: benefit.accentColor }}
                    >
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                    </div>

                    <h3
                      className="font-bold leading-tight"
                      style={{
                        color: benefit.textColor,
                        fontSize: "clamp(32px, 5vw, 64px)",
                      }}
                    >
                      {t(`benefit_title_${benefitKeys[i]}`)}
                    </h3>

                    <p
                      className="leading-relaxed"
                      style={{
                        color: benefit.textColor,
                        opacity: 0.72,
                        fontSize: "clamp(14px, 1.5vw, 18px)",
                      }}
                    >
                      {t(`benefit_desc_${benefitKeys[i]}`)}
                    </p>
                  </div>

                  <div className="flex sm:hidden flex-shrink-0 items-center justify-center">
                    <div className="w-[160px] h-[160px] flex items-center justify-center">
                      <img src={benefit.image} alt="" className="w-full h-full object-contain scale-110" />
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-shrink-0 items-center justify-center">
                    <div
                      className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[480px] lg:h-[480px] flex items-center justify-center"
                    >
                      <img
                        src={benefit.image}
                        alt=""
                        className="w-full h-full object-contain scale-110"
                      />
                    </div>
                  </div>
                </div>
             </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};
