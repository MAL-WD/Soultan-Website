import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
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

const GREEN = "#02110c";
const GOLD = "#f2c161";
const PAPER = "#f4efe3";

const photo = (id) =>
  `https://res.cloudinary.com/dv9htf53o/image/upload/c_fill,g_center,w_420,h_520,f_auto,q_auto/soltane-stationery/${id}`;

// Real shop photos. x/y are where each card rests once the arch has opened to
// full screen (vw / svh from the centre); while the arch is still a small
// doorway the same positions read as a tight cluster inside it.
const cards = [
  { id: "hjlyebuyttc7oom9pnqt", x: -37, y: -24, r: -7, drift: -60 },
  { id: "jgluw6rdxvkepa6uzdnt", x: -13, y: -36, r: 4, drift: -110 },
  { id: "rthriraq4ynqmaeyzlcx", x: 15, y: -33, r: -3, drift: -40 },
  { id: "zke5dqyxwgwtsvrgji10", x: 38, y: -20, r: 8, drift: -90 },
  { id: "mp6fh5yexnasljmfl0pq", x: -40, y: 12, r: 5, drift: -130 },
  { id: "vgic5sbp1gizudoip5dd", x: 37, y: 15, r: -6, drift: -70 },
  { id: "rwuk8enn3tlzypmet2lp", x: -25, y: 34, r: -4, drift: -150 },
  { id: "eqqcj8aksxrj5aloo5i1", x: 16, y: 36, r: 6, drift: -100 },
];

const cardsMobile = [
  { id: "hjlyebuyttc7oom9pnqt", x: -29, y: -35, r: -7, drift: -50 },
  { id: "rthriraq4ynqmaeyzlcx", x: 27, y: -33, r: 5, drift: -90 },
  { id: "mp6fh5yexnasljmfl0pq", x: -31, y: 33, r: 6, drift: -110 },
  { id: "zke5dqyxwgwtsvrgji10", x: 29, y: 36, r: -5, drift: -70 },
  { id: "jgluw6rdxvkepa6uzdnt", x: 0, y: -45, r: 2, drift: -130 },
];

// Arch geometry per breakpoint. The arch is drawn larger than the viewport so
// that at scale 1 its rounded top has left the screen and it reads as full-bleed.
const LAYOUT = {
  desktop: { w: 130, h: 200, start: 0.22, card: 11, cardStart: 2.3 },
  mobile: { w: 160, h: 130, start: 0.32, card: 30, cardStart: 1.8 },
};

const pullIn = cubicBezier(0.5, 0, 0.75, 0);
const settle = cubicBezier(0.22, 1, 0.36, 1);

const Card = ({ card, index, progress, archScale, layout }) => {
  // Shrink the cards in step with the arch growing, so on screen they only ever get bigger.
  const scale = useTransform(archScale, (a) => 1 + (layout.cardStart - 1) * (1 - (a - layout.start) / (1 - layout.start)));
  const y = useTransform(progress, (p) => `calc(${card.y}svh + ${p * card.drift}px)`);
  const rotate = useTransform(progress, [0, 0.7], [card.r * 2.2, card.r]);

  return (
    <motion.figure
      className="absolute left-1/2 top-1/2 m-0 will-change-transform"
      style={{
        width: `${layout.card}vw`,
        marginLeft: `${-layout.card / 2}vw`,
        marginTop: `${(-layout.card * 1.24) / 2}vw`,
        x: `${card.x}vw`,
        y,
        rotate,
        scale,
      }}
    >
      <div className="bg-white p-[4%] pb-[3%] rounded-[3px] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]">
        <img
          src={photo(card.id)}
          alt=""
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          className="block w-full aspect-[420/520] object-cover"
          draggable="false"
        />
        <figcaption
          className="mt-[3%] flex justify-between text-[#02110c]/60 text-[clamp(7px,0.75vw,11px)] tracking-[0.12em]"
          style={{ fontFamily: "'Inter', sans-serif" }}
          dir="ltr"
        >
          <span>N°{String(index + 1).padStart(2, "0")}</span>
          <span>SOLTANE</span>
        </figcaption>
      </div>
    </motion.figure>
  );
};

export const ArchHero = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar") || i18n.dir() === "rtl";
  const reduce = useReducedMotion();
  const trackRef = useRef(null);

  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsSmall(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const layout = isSmall ? LAYOUT.mobile : LAYOUT.desktop;
  const deck = isSmall ? cardsMobile : cards;

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // With reduced motion the scroll story is skipped and the opened state is shown as-is.
  const opened = useMotionValue(1);
  const progress = reduce ? opened : scrollYProgress;

  const archScale = useTransform(progress, [0, 0.7], [layout.start, 1], { ease: pullIn });
  const ringOpacity = useTransform(progress, [0.4, 0.65], [1, 0]);

  // The two words part like doors: sideways on desktop, up/down on phones.
  const away = (sign) =>
    useTransform(progress, [0, 0.45], ["0vw", `${sign * 40}vw`], { ease: pullIn });
  const awayY = (sign) =>
    useTransform(progress, [0, 0.45], ["0svh", `${sign * 30}svh`], { ease: pullIn });
  const startX = away(isRtl ? 1 : -1);
  const endX = away(isRtl ? -1 : 1);
  const topY = awayY(-1);
  const bottomY = awayY(1);
  const wordsOpacity = useTransform(progress, [0, 0.38], [1, 0]);
  const chromeOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  const headlineOpacity = useTransform(progress, [0.6, 0.8], [0, 1]);
  const headlineY = useTransform(progress, [0.6, 0.85], [40, 0], { ease: settle });

  const latin = !isRtl;
  const wordStartClass = latin
    ? "font-medium tracking-[-0.06em]"
    : "font-serif-ar-bold";
  const wordEndClass = latin
    ? "italic font-normal tracking-[-0.03em]"
    : "font-serif-ar-bold text-[#0d3a27]";
  const wordStartFont = latin ? "'Inter', sans-serif" : undefined;
  const wordEndFont = latin ? "'Instrument Serif', serif" : undefined;
  const wordSize = isSmall
    ? latin ? "text-[15vw]" : "text-[19vw]"
    : latin ? "text-[7.4vw]" : "text-[9.4vw]";

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="relative w-full" style={{ backgroundColor: GREEN }}>
      <div ref={trackRef} className={reduce ? "relative" : "relative h-[230vh] md:h-[280vh]"}>
        <div
          className={`${reduce ? "relative" : "sticky top-0"} h-[100svh] w-full overflow-hidden`}
          style={{ backgroundColor: PAPER }}
        >
          {/* Paper grain, static */}
          <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-[0.22]" />

          {/* Editorial chrome: top labels and scroll cue */}
          <motion.div
            style={{ opacity: chromeOpacity }}
            className="absolute inset-x-0 top-[96px] md:top-[104px] z-20 px-5 md:px-10 flex justify-between items-baseline text-[#02110c]/70 text-[11px] md:text-xs uppercase tracking-[0.18em]"
          >
            <span style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}>{t("heroMetaStart")}</span>
            <span style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}>{t("heroMetaEnd")}</span>
          </motion.div>
          {!reduce && (
            <motion.div
              style={{ opacity: chromeOpacity }}
              className="absolute inset-x-0 bottom-[84px] md:bottom-8 z-20 flex flex-col items-center gap-3 text-[#02110c]/70 text-[11px] md:text-xs uppercase tracking-[0.18em]"
            >
              <span className="hidden md:inline" style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}>{t("heroScrollCue")}</span>
              <span className="relative block h-10 w-px bg-[#02110c]/15 overflow-hidden">
                <span className="hero-cue-line absolute inset-0 bg-[#02110c]" />
              </span>
            </motion.div>
          )}

          {/* Desktop floor line: the doorway and both words stand on it */}
          {!isSmall && (
            <motion.div
              aria-hidden="true"
              style={{ opacity: wordsOpacity, top: `calc(50svh + ${(layout.h * layout.start) / 2}svh)` }}
              className="absolute inset-x-5 md:inset-x-10 z-[6] h-px bg-[#02110c]/25"
            />
          )}

          {/* The masthead words, split around the doorway */}
          <motion.div
            aria-hidden="true"
            style={{
              opacity: wordsOpacity,
              ...(isSmall ? {} : { bottom: `calc(50svh - ${(layout.h * layout.start) / 2}svh)` }),
            }}
            className={`absolute z-10 flex px-[4vw] text-[#02110c] leading-[0.8] select-none ${
              isSmall ? "inset-0 flex-col items-center justify-center gap-[43svh]" : "inset-x-0 top-0 flex-row items-end justify-between pb-[0.6vw]"
            }`}
          >
            <motion.span
              style={{ x: isSmall ? 0 : startX, y: isSmall ? topY : 0, fontFamily: wordStartFont }}
              className={`block whitespace-nowrap ${wordSize} ${wordStartClass}`}
            >
              {t("heroWordStart")}
            </motion.span>
            <motion.span
              style={{ x: isSmall ? 0 : endX, y: isSmall ? bottomY : 0, fontFamily: wordEndFont }}
              className={`block whitespace-nowrap ${wordSize} ${wordEndClass}`}
            >
              {t("heroWordEnd")}
            </motion.span>
          </motion.div>

          {/* The arch: a doorway that opens until it becomes the whole screen */}
          <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
            <motion.div
              className="relative shrink-0 overflow-hidden will-change-transform"
              style={{
                width: `${layout.w}vw`,
                height: `${layout.h}svh`,
                scale: archScale,
                borderRadius: "50% 50% 0 0 / 22% 22% 0 0",
                background: "radial-gradient(90% 60% at 50% 45%, #0d3a27 0%, #062319 50%, #02110c 100%)",
              }}
            >
              <motion.div
                aria-hidden="true"
                style={{ opacity: ringOpacity, borderRadius: "50% 50% 0 0 / 22% 22% 0 0" }}
                className="absolute inset-[2.2%] bottom-0 border-[5px] border-b-0 border-[#f2c161]/45"
              />
              {deck.map((card, i) => (
                <Card key={card.id} card={card} index={i} progress={progress} archScale={archScale} layout={layout} />
              ))}
            </motion.div>
          </div>

          {/* What you find inside */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-7 px-6 text-center"
          >
            <h1 className="flex flex-col items-center gap-1">
              <span
                className={`block text-[#fffef0] text-4xl sm:text-6xl lg:text-7xl ${
                  isRtl ? "font-black leading-snug" : "font-semibold tracking-[-0.05em] leading-[1.05]"
                }`}
                style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}
              >
                {t("heroTitle1")}
              </span>
              <span
                className={`block text-5xl sm:text-7xl lg:text-8xl ${
                  isRtl ? "font-black leading-snug" : "italic font-normal tracking-[-0.03em] leading-[1.05]"
                }`}
                style={{ color: GOLD, fontFamily: latin ? "'Instrument Serif', serif" : undefined }}
              >
                {t("heroTitle2")}
              </span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link to="/products">
                <Button className="h-12 min-w-[160px] px-7 rounded-full border-0 bg-[#f2c161] hover:bg-[#f5cd7c] text-[#02110c] text-base font-medium transition-colors">
                  <span style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}>{t("heroCTA2")}</span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="h-12 min-w-[160px] px-7 rounded-full bg-transparent hover:bg-white/10 border border-[#fffef0]/30 text-[#fffef0] hover:text-[#fffef0] text-base font-medium transition-colors"
                >
                  <span style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}>{t("heroCTA1")}</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Suppliers, on the green the arch opened into */}
      <div className="relative w-full max-w-[1440px] mx-auto px-4 pt-6 pb-28 md:pb-14 flex flex-col gap-5">
        <div
          className="text-center text-[#fffef0]/50 text-xs uppercase tracking-[0.18em]"
          style={{ fontFamily: latin ? "'Inter', sans-serif" : undefined }}
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
      </div>
    </section>
  );
};
