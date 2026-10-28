import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  DraftingCompass,
  NotebookPen,
  Paperclip,
  Pencil,
  Ruler,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";

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

const GOLD = "#f2c161";

// Stationery outlines floating at different depths. `start`/`end` are logical
// insets so the composition mirrors itself in RTL. Negative speed = the layer
// travels faster than the page, so it reads as closer to the viewer.
const floaters = [
  { Icon: Pencil, start: "6%", top: "22%", size: 46, speed: -260, drift: 18, rot: -20, opacity: 0.55 },
  { Icon: Ruler, end: "7%", top: "16%", size: 54, speed: -180, drift: 14, rot: 28, opacity: 0.45 },
  { Icon: DraftingCompass, end: "10%", top: "62%", size: 50, speed: -320, drift: 22, rot: 10, opacity: 0.5, desktopOnly: true },
  { Icon: BookOpen, start: "11%", top: "64%", size: 58, speed: -130, drift: 10, rot: -8, opacity: 0.35, desktopOnly: true },
  { Icon: Paperclip, start: "27%", top: "13%", size: 28, speed: -90, drift: 8, rot: 32, opacity: 0.3, desktopOnly: true },
  { Icon: NotebookPen, end: "26%", top: "80%", size: 34, speed: -210, drift: 16, rot: -14, opacity: 0.3, desktopOnly: true },
];

// One parallax plane: scroll moves it vertically, the pointer nudges it on
// desktop. Both are transform-only so the browser can keep them on the GPU.
const Layer = ({ progress, pointerX, pointerY, speed = 0, drift = 0, depth, reduce, className = "", style, children }) => {
  const y = useTransform(progress, (p) => (reduce ? 0 : p * speed * depth));
  const x = useTransform(pointerX, (v) => v * drift);
  const py = useTransform(pointerY, (v) => v * drift);

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute pointer-events-none will-change-transform ${className}`}
      style={{ ...style, y }}
    >
      <motion.div className="w-full h-full" style={{ x, y: py }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

// Line-art take on the Soltane crown, drawn as strokes so it stays crisp at any size.
const CrownMark = ({ className = "", animate = true, strokeWidth = 3 }) => {
  const paths = [
    "M42 132 Q40 78 70 50",
    "M158 132 Q160 78 130 50",
    "M74 40 Q88 22 100 12 Q112 22 126 40",
    "M62 50 L70 118 L130 118 L138 50 L100 98 Z",
    "M82 76 L82 118 M118 76 L118 118",
    "M100 42 L111 60 L100 78 L89 60 Z",
    "M60 132 L140 132",
  ];
  return (
    <svg viewBox="0 0 200 145" fill="none" className={className}>
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke={GOLD}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
};

export const ParallaxHero = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar") || i18n.dir() === "rtl";
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  // Phones get roughly half the travel: still reads as depth, never seasick.
  const [depth, setDepth] = useState(1);
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      setDepth(small.matches ? 0.55 : 1);
      setFinePointer(fine.matches);
    };
    update();
    small.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      fine.removeEventListener("change", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Pointer position normalised to -1..1, eased so layers glide rather than snap.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 50, damping: 18, mass: 0.6 });
  const pointerY = useSpring(rawY, { stiffness: 50, damping: 18, mass: 0.6 });
  const pointerEnabled = finePointer && !reduce;

  const handlePointerMove = (e) => {
    if (!pointerEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // Text lifts away a touch faster than the page while the planes behind it lag.
  const contentY = useTransform(scrollYProgress, (p) => (reduce ? 0 : p * -70 * depth));
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [1, 0]);
  const bigCrownScale = useTransform(scrollYProgress, (p) => (reduce ? 1 : 1 + p * 0.18));

  const layerProps = { progress: scrollYProgress, pointerX, pointerY, depth, reduce };

  // Staggered entrance; with reduced motion everything is simply present.
  const enter = (delay) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        };

  const latinFont = (family) => (isRtl ? undefined : family);

  return (
    <section
      ref={sectionRef}
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate w-full min-h-[100svh] flex flex-col overflow-hidden bg-[#02110c] text-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Plane 0 — deep green base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #0d3a27 0%, #062319 45%, #02110c 100%)",
        }}
      />

      {/* Plane 1 — dot grid, slowest */}
      <Layer {...layerProps} speed={90} drift={4} className="-inset-x-8 -top-16 -bottom-16 -z-10">
        <div
          className="w-full h-full opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fffef0 1px, transparent 1.4px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
          }}
        />
      </Layer>

      {/* Plane 2 — oversized faint crown and warm glow */}
      <Layer {...layerProps} speed={240} drift={10} className="inset-0 -z-10 flex items-center justify-center">
        <motion.div style={{ scale: bigCrownScale }} className="relative w-[150vw] max-w-[1100px] md:w-[85vw]">
          <div
            className="absolute inset-[-10%] rounded-full"
            style={{ background: `radial-gradient(circle, ${GOLD}22 0%, transparent 60%)` }}
          />
          <CrownMark className="relative w-full opacity-[0.06]" animate={false} strokeWidth={1.5} />
        </motion.div>
      </Layer>

      {/* Plane 3 — arch frame echoing the shop's doorway motif */}
      <Layer {...layerProps} speed={60} drift={6} className="inset-x-3 top-[72px] bottom-0 sm:inset-x-[6%] -z-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M2 100 V26 Q2 4 50 2 Q98 4 98 26 V100"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.22"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M5 100 V28 Q5 8 50 6 Q95 8 95 28 V100"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.08"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </Layer>

      {/* Plane 4 — stationery floating in front */}
      {floaters.map(({ Icon, start, end, top, size, speed, drift, rot, opacity, desktopOnly }, i) => (
        <Layer
          key={i}
          {...layerProps}
          speed={speed}
          drift={drift}
          className={`z-0 ${desktopOnly ? "hidden md:block" : ""}`}
          style={{ insetInlineStart: start, insetInlineEnd: end, top }}
        >
          <span
            className="hero-float block origin-center scale-[0.7] md:scale-100"
            style={{ "--hero-rot": `${rot}deg`, animationDelay: `${-i * 1.3}s`, opacity }}
          >
            <Icon size={size} strokeWidth={1.1} color={i % 2 ? "#fffef0" : GOLD} />
          </span>
        </Layer>
      ))}

      {/* Foreground content */}
      <motion.div
        className="relative z-10 flex-1 flex items-center justify-center px-5 pt-[104px] pb-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-7 sm:gap-8">
          <motion.div {...enter(0)} className="w-20 sm:w-24">
            <CrownMark className="w-full drop-shadow-[0_0_18px_rgba(242,193,97,0.35)]" animate={!reduce} />
          </motion.div>

          <motion.div
            {...enter(0.15)}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] ps-2 pe-4 py-1.5"
          >
            <img className="w-[104px] sm:w-[120px] h-7 sm:h-8" alt="" src="/avatars.svg" />
            <div className="flex flex-col items-start">
              <img className="w-14 sm:w-16 h-3" alt="" src="/stars-1.svg" />
              <p
                className="font-medium text-white/90 text-xs sm:text-sm leading-5 whitespace-nowrap"
                style={{ fontFamily: latinFont("'Inter', Helvetica") }}
              >
                {t("heroSocialProof")}
              </p>
            </div>
          </motion.div>

          <h1 className="flex flex-col items-center gap-1 sm:gap-2">
            <motion.span
              {...enter(0.3)}
              className={`block text-[#e0e0e0] text-[2.6rem] sm:text-6xl lg:text-7xl ${
                isRtl ? "font-black leading-snug" : "font-semibold tracking-[-0.05em] leading-[1.05]"
              }`}
              style={{ fontFamily: latinFont("'Inter', sans-serif") }}
            >
              {t("heroTitle1")}
            </motion.span>
            <motion.span
              {...enter(0.45)}
              className={`block text-[#f2c161] text-[2.9rem] sm:text-7xl lg:text-8xl ${
                isRtl ? "font-black leading-snug" : "font-normal italic tracking-[-0.04em] leading-[1.05]"
              }`}
              style={{ fontFamily: latinFont("'Instrument Serif', serif") }}
            >
              {t("heroTitle2")}
            </motion.span>
          </h1>

          <motion.p
            {...enter(0.6)}
            className="max-w-xl text-[#fffef0]/80 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: latinFont("'Satoshi', sans-serif") }}
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div {...enter(0.75)} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/contact">
              <Button className="h-12 min-w-[150px] px-7 bg-[#f2c161] hover:bg-[#f5cd7c] rounded-full shadow-[0_12px_30px_-8px_rgba(242,193,97,0.55)] border-0 flex items-center justify-center gap-2 transition-colors">
                <span
                  className="font-medium text-[#02110c] text-base"
                  style={{ fontFamily: latinFont("'Inter', Helvetica") }}
                >
                  {t("heroCTA1")}
                </span>
                <img className={`w-4 ${isRtl ? "rotate-180" : ""}`} alt="" src="/left-arrow-alt---svg.svg" />
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                className="h-12 min-w-[150px] px-7 bg-transparent hover:bg-white/10 rounded-full border border-white/25 text-[#fffef0] hover:text-[#fffef0] flex items-center justify-center transition-colors"
              >
                <span className="font-medium text-base" style={{ fontFamily: latinFont("'Inter', Helvetica") }}>
                  {t("heroCTA2")}
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Suppliers strip */}
      <motion.div
        {...enter(1)}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-4 pb-28 md:pb-8 flex flex-col gap-5 pointer-events-none"
      >
        <div
          className="text-center font-medium text-neutral-100/55 text-xs sm:text-sm tracking-wide uppercase"
          style={{ fontFamily: latinFont("'Inter', Helvetica") }}
        >
          {t("suppliersTitle")}
        </div>
        <div
          className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          dir="ltr"
        >
          <div className="hero-marquee flex items-center w-max animate-scroll-left">
            {[0, 1].map((set) => (
              <div key={set} className="flex items-center gap-14 pr-14" aria-hidden={set === 1}>
                {partners.map((partner) => (
                  <div key={partner.name} className="flex-shrink-0 w-[96px] h-[36px] flex items-center justify-center opacity-50">
                    <img
                      src={partner.logo}
                      alt={set === 0 ? partner.name : ""}
                      className="max-w-full max-h-full object-contain invert brightness-0"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Soft edge into the next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 -z-10 bg-gradient-to-b from-transparent to-[#02110c]"
      />
    </section>
  );
};
