import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// three.js only downloads when the hero mounts, keeping it out of the main bundle.
const CrownScene = lazy(() => import("./CrownScene"));

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export const CrownHero = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar") || i18n.dir() === "rtl";
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const introRef = useRef(null);
  const finalRef = useRef(null);

  // Single progress value shared by the 3D scene and the DOM text.
  const store = useMemo(() => ({ target: 0, current: 0, invalidate: null, visible: true }), []);
  const overlay = useMemo(() => ({ intro: introRef, final: finalRef }), []);

  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  const [webgl] = useState(() => typeof window !== "undefined" && hasWebGL());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsSmall(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    // Reduced motion (or no WebGL): show the finished composition, no scroll story.
    if (reduce || !webgl) {
      store.target = store.current = 1;
      store.invalidate?.();
      return;
    }
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        store.target = self.progress;
        store.invalidate?.();
      },
    });
    store.target = st.progress;
    return () => st.kill();
  }, [reduce, webgl, store]);

  // Stop idle rendering (breathing, parallax) once the hero is off screen
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      store.visible = entry.isIntersecting;
      if (store.visible) store.invalidate?.();
    });
    io.observe(trackRef.current);
    return () => io.disconnect();
  }, [store]);

  const staticFinal = reduce || !webgl;
  const latinFont = isRtl ? undefined : "'Inter', sans-serif";

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="relative w-full bg-[#03140e]">
      <div ref={trackRef} className={staticFinal ? "relative" : "relative h-[340vh] md:h-[420vh]"}>
        <div className={`${staticFinal ? "relative" : "sticky top-0"} h-[100svh] w-full overflow-hidden`}>
          {/* Poster: same colours as the scene, so loading never shows a black frame */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "radial-gradient(70% 60% at 50% 40%, #0b3123 0%, #05211a 45%, #03140e 100%)" }}
          />

          {webgl && (
            <div className="absolute inset-0" aria-hidden="true">
              <Suspense fallback={null}>
                <CrownScene store={store} overlay={overlay} isSmall={isSmall} reduce={!!reduce} />
              </Suspense>
            </div>
          )}

          {/* Soft vignette keeps text readable without a box behind it */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: isSmall
                ? "linear-gradient(to top, rgba(3,20,14,0.95) 0%, rgba(3,20,14,0.6) 32%, transparent 58%)"
                : "linear-gradient(to top, rgba(3,20,14,0.85) 0%, transparent 30%), linear-gradient(to right, rgba(3,20,14,0.7) 0%, transparent 32%, transparent 68%, rgba(3,20,14,0.7) 100%)",
            }}
          />

          {/* Opening frame: appears once the crown has arrived */}
          <div
            ref={introRef}
            className="pointer-events-none absolute inset-x-0 bottom-[96px] md:bottom-10 flex flex-col items-center gap-3 text-[#fffef0]/75 text-[11px] md:text-xs uppercase tracking-[0.2em]"
            style={{ opacity: 0 }}
          >
            <span style={{ fontFamily: latinFont }}>{t("heroScrollCue")}</span>
            <span className="relative block h-10 w-px bg-white/15 overflow-hidden">
              <span className="hero-cue-line absolute inset-0 bg-[#f2c161]" />
            </span>
          </div>

          {/* Final composition: the crowned customer in the centre, the slogan around them */}
          <div
            ref={finalRef}
            className="absolute inset-0 z-10"
            style={{ opacity: staticFinal ? 1 : 0, pointerEvents: staticFinal ? "auto" : "none" }}
          >
            <h1
              dir="rtl"
              lang="ar"
              className={`font-serif-ar-bold text-[#fffef0] leading-[1.2] ${
                isSmall
                  ? "absolute inset-x-0 bottom-[190px] px-4 text-center text-[3.3rem]"
                  : "absolute inset-x-[3vw] top-[28%] flex justify-between items-baseline text-[clamp(3.6rem,7.4vw,8.5rem)]"
              }`}
              style={{
                // Gold outline drawn behind the letters (paint-order keeps Arabic joins clean);
                // the dark glow underneath keeps it readable over the bright book spines
                WebkitTextStroke: "0.07em #f2c161",
                paintOrder: "stroke fill",
                textShadow: "0 0 24px rgba(3,20,14,0.9), 0 6px 40px rgba(0,0,0,0.6)",
              }}
            >
              {/* Read right to left: "the customer" on one side of the throne, "is the Sultan" on the other */}
              <span className="whitespace-nowrap">الزبون</span>
              {isSmall ? " " : null}
              <span className="whitespace-nowrap inline-block">هو السلطان</span>
            </h1>
            <div
              className={`absolute inset-x-0 flex flex-col items-center text-center gap-3 px-6 ${
                isSmall ? "bottom-[100px]" : "bottom-[6vh]"
              }`}
            >
              {!isRtl && (
                <p className="text-[#f2c161] italic text-xl md:text-2xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {t("heroSloganTranslation")}
                </p>
              )}
              <p className="text-[#fffef0]/75 text-sm md:text-base" style={{ fontFamily: latinFont }}>
                {t("heroSupport")}
              </p>
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 text-[#f2c161] text-base md:text-lg pb-1 border-b border-[#f2c161]/40 hover:border-[#f2c161] transition-colors"
                style={{ fontFamily: latinFont }}
              >
                {t("heroDiscover")}
                <span aria-hidden="true" className={`transition-transform ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                  {isRtl ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>        </div>
      </div>
    </section>
  );
};
