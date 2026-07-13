import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ellipseImage from "../../../../assets/Ellipse.png";

/* ───────────────────────── Animated Counter Hook ───────────────────────── */
const useCountUp = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  const start = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo for a smooth deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, hasStarted]);

  useEffect(() => {
    if (!startOnView || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [start, startOnView]);

  return { count, ref };
};

/* ───────────────────────── Stat Card ───────────────────────── */
const StatCard = ({ icon, value, suffix, label, sublabel, ringSpeed, index }) => {
  const numericValue = parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0;
  const { count, ref } = useCountUp(numericValue, 2200 + index * 200);

  // Format the displayed count (add comma separators for thousands)
  const formattedCount = count.toLocaleString("en-US");

  return (
    <div
      ref={ref}
      className="stat-card-soltane relative group"
      style={{ opacity: 1 }}
    >
      {/* Spinning conic‑gradient border */}
      <div className="absolute -inset-[1px] rounded-[24px] overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            background:
              "conic-gradient(from 0deg, #f2c161, #ffffff, #f2c161, #ffffff, #f2c161)",
            animation: `spinBorderStats ${ringSpeed}s linear infinite`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Card inner */}
      <div
        className="relative rounded-[24px] p-6 md:p-10 flex flex-col items-center text-center h-full overflow-hidden shadow-xl"
        style={{ background: "#ffffff" }}
      >
        {/* Ring + Icon */}
        <div className="relative w-16 h-16 mb-8">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 88 88"
          >
            <circle
              cx="44"
              cy="44"
              r="40"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="3"
            />
            <circle
              className="stat-ring-fill-soltane"
              cx="44"
              cy="44"
              r="40"
              fill="none"
              stroke="#f2c161"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="251"
              strokeDashoffset="251"
              style={{ strokeDashoffset: "50px" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* Number */}
        <div
          className="font-black mb-3 text-[#02110c]"
          style={{
            fontFamily: "'Geist', 'Inter', Helvetica, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            lineHeight: 1.2,
            paddingTop: "0.1em",
            letterSpacing: "-0.02em",
          }}
        >
          {formattedCount}{suffix}
        </div>

        {/* Label */}
        <p
          className="text-base font-bold mb-1"
          style={{ color: "#02110c", fontFamily: "'Inter', Helvetica, sans-serif", letterSpacing: "-0.01em" }}
        >
          {label}
        </p>
        <p
          className="text-[12px] font-medium"
          style={{ color: "#424242", fontFamily: "'Inter', Helvetica, sans-serif" }}
        >
          {sublabel}
        </p>
      </div>
    </div>
  );
};

/* ───────────────────────── Icons (Lucide-style inline SVGs) ───────────────────────── */
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ color: "#f2c161" }}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ color: "#f2c161" }}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ color: "#f2c161" }}
  >
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ color: "#f2c161" }}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ───────────────────────── Section ───────────────────────── */
export const StatsSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const stats = [
    {
      icon: <CalendarIcon />,
      value: "28",
      suffix: "+",
      labelKey: "stat_label_1",
      sublabelKey: "stat_sublabel_1",
      ringSpeed: 6,
    },
    {
      icon: <UsersIcon />,
      value: "10000",
      suffix: "+",
      labelKey: "stat_label_2",
      sublabelKey: "stat_sublabel_2",
      ringSpeed: 7,
    },
    {
      icon: <PackageIcon />,
      value: "5000",
      suffix: "+",
      labelKey: "stat_label_3",
      sublabelKey: "stat_sublabel_3",
      ringSpeed: 8,
    },
    {
      icon: <MapPinIcon />,
      value: "3",
      suffix: "",
      labelKey: "stat_label_4",
      sublabelKey: "stat_sublabel_4",
      ringSpeed: 9,
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-neutral-100"
      style={{ padding: "100px 24px" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Gold Bullet Accent */}
      <img
        src={ellipseImage}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]"
        style={{ zIndex: 0 }}
      />
      {/* Background decoration */}
      <div className="absolute top-[50%] right-[-10%] w-[40%] h-[40%] bg-radial-gradient from-[#f2c161]/10 back-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-black tracking-tight"
            style={{
              color: "#02110c",
              fontFamily: isRTL
                ? "'ThmanyahSerifDisplay', 'ThmanyahSerifText', Arial, sans-serif"
                : "'Geist', 'Inter', Helvetica, sans-serif",
            }}
          >
            {t("statsTitle")}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              index={index}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={t(stat.labelKey)}
              sublabel={t(stat.sublabelKey)}
              ringSpeed={stat.ringSpeed}
            />
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spinBorderStats {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
