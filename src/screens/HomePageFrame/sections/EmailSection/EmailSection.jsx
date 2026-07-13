import { ArrowUpRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
   Inline white envelope — no external asset dependency, always white
───────────────────────────────────────────────────────────────────── */
const EnvelopeWhite = () => (
  <svg
    viewBox="0 0 480 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "auto" }}
  >
    <defs>
      <filter id="envDrop" x="-15%" y="-15%" width="130%" height="145%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000" floodOpacity="0.22" />
      </filter>
      <linearGradient id="bodyGrad" x1="240" y1="60" x2="240" y2="330" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="100%" stopColor="#e8e8e8" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="flapGrad" x1="240" y1="60" x2="240" y2="210" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="100%" stopColor="#d4d4d4" stopOpacity="1" />
      </linearGradient>
    </defs>

    {/* Envelope body */}
    <rect x="20" y="60" width="440" height="270" rx="16" fill="url(#bodyGrad)" filter="url(#envDrop)" />

    {/* Bottom left crease */}
    <path d="M20 330 L218 208" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
    {/* Bottom right crease */}
    <path d="M460 330 L262 208" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />

    {/* Envelope flap */}
    <path d="M20 76 Q20 60 36 60 L240 200 L444 60 Q460 60 460 76 L460 84 L240 224 L20 84 Z"
      fill="url(#flapGrad)" />

    {/* Flap fold shadow */}
    <path d="M20 84 L240 224 L460 84"
      stroke="#aaaaaa" strokeOpacity="0.30" strokeWidth="1" />

    {/* Outer border */}
    <rect x="20" y="60" width="440" height="270" rx="16"
      fill="none" stroke="white" strokeOpacity="0.40" strokeWidth="1.5" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────
   EmailSection
───────────────────────────────────────────────────────────────────── */
export const EmailSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const prefersReduced = useReducedMotion();

  /* ── Spring entry animations ── */
  const envLeftEntry = {
    hidden:  { x: -260, rotate: -15, opacity: 0 },
    visible: {
      x: 0, rotate: -15, opacity: 1,
      transition: { type: "spring", stiffness: 55, damping: 13, delay: 0.1 },
    },
  };
  const envRightEntry = {
    hidden:  { x: 260, rotate: 15, opacity: 0 },
    visible: {
      x: 0, rotate: 15, opacity: 1,
      transition: { type: "spring", stiffness: 55, damping: 13, delay: 0.25 },
    },
  };

  /* ── Continuous float after entry ── */
  const floatL = prefersReduced ? {} : {
    y:      [0, -12, 0],
    rotate: [-15, -17, -15],
  };
  const floatR = prefersReduced ? {} : {
    y:      [0, -12, 0],
    rotate: [15, 17, 15],
  };
  const floatT = { duration: 4.2, ease: "easeInOut", repeat: Infinity };

  return (
    <section
      className="relative w-full py-24 flex justify-center bg-[#f4f5f8] overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* ── Card ── */}
      <div
        className="
          w-full max-w-[1020px] mx-4 relative overflow-hidden
          rounded-[32px] border border-white/5
          min-h-[480px] flex flex-col items-center justify-center
          shadow-[0px_40px_100px_rgba(0,0,0,0.30)]
        "
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #0d6e37 0%, #044a22 40%, #021b0c 100%)",
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 bg-[url('/hmfvvpfimtjfr2zwfsvwihxsk-png.png')] bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none"
        />

        {/* Soft top radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
        />

        {/* ── Left envelope ── */}
        <motion.div
          className="absolute bottom-[-140px] left-[-60px] w-[340px] sm:w-[400px] md:w-[460px] pointer-events-none"
          variants={envLeftEntry}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          animate={floatL}
          transition={floatT}
        >
          <EnvelopeWhite />
        </motion.div>

        {/* ── Right envelope ── */}
        <motion.div
          className="absolute bottom-[-140px] right-[-60px] w-[340px] sm:w-[400px] md:w-[460px] pointer-events-none"
          variants={envRightEntry}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          animate={floatR}
          transition={floatT}
        >
          <EnvelopeWhite />
        </motion.div>

        {/* ── CONTENT ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6 pt-14 pb-28 md:pt-16 md:pb-32 gap-5"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-white font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(2.1rem, 5.5vw, 4.2rem)" }}
          >
            {t("email_ready")}
            <br />
            {isRtl ? (
              // Arabic: رحلتك كسلطان؟
              <>
                {t("email_journey")}{" "}
                <span className="font-serif italic font-normal opacity-90">
                  {t("email_soltane")}
                </span>
                {"؟"}
              </>
            ) : (
              // English: Soltane Journey?
              <>
                <span className="font-serif italic font-normal opacity-90 mr-2">
                  {t("email_soltane")}
                </span>
                {t("email_journey")}
              </>
            )}
          </h2>

          <p
            className="text-white/75 text-sm md:text-base max-w-[460px] leading-relaxed font-['Inter']"
            dangerouslySetInnerHTML={{
              __html: `${t("email_join")} ${t("email_soltane")}`,
            }}
          />

          <Link to="/products">
            <Button
              className="
                mt-3 bg-[#f2c161] hover:bg-[#e9b73e] text-[#02110c]
                rounded-full px-10 py-6 text-base font-semibold
                flex items-center gap-2 border-0
                shadow-[0px_12px_32px_rgba(242,193,97,0.45)]
                hover:shadow-[0px_16px_40px_rgba(234,179,8,0.55)]
                transition-all duration-300 hover:scale-[1.04] active:scale-95
              "
            >
              <span>{t("email_shop_now") || "Shop Now"}</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
