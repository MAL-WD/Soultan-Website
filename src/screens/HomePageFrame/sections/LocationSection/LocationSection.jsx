import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Store, Building2, ExternalLink, Truck, Globe, ArrowRight } from "lucide-react";
import { SectionHeader } from "../../../../components/SectionHeader/SectionHeader";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import ellipseImage from "../../../../assets/Ellipse.png";

const branches = [
  {
    id: 1,
    nameKey: "branch_1_name",
    addrKey: "branch_1_addr",
    coords: "31.5970461,-2.231672",
    icon: Store,
    fullMapUrl: "https://maps.app.goo.gl/rEMzBQ9KicBtJg3B6",
    accentColor: "#f2c161",
  },
  {
    id: 2,
    nameKey: "branch_2_name",
    addrKey: "branch_2_addr",
    coords: "31.567666132759076,-2.2324320618687237",
    icon: MapPin,
    fullMapUrl: "https://maps.app.goo.gl/CQdoqYCWtFf5jqiW9?g_st=ipc",
    contactUrl: "https://soltanstationerybidando.framer.website/",
    accentColor: "#71b83e",
  },
  {
    id: 3,
    nameKey: "branch_3_name",
    addrKey: "branch_3_addr",
    coords: "31.609575,-2.2178261",
    icon: Building2,
    fullMapUrl: "https://maps.app.goo.gl/qLDcpt4eA9UXcrns5",
    contactUrl: "https://soltanestationerylacnep.framer.website/",
    accentColor: "#5b9ef5",
  },
];

export const LocationSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      className="relative w-full bg-neutral-100 py-24 overflow-hidden"
      id="locations"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Gold Bullet Accent */}
      <img
        src={ellipseImage}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]"
        style={{ zIndex: 0 }}
      />
      {/* Background ambient blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#f2da61]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#71b83e]/8 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        <SectionHeader
          badgeText={t("locationsBadge")}
          title={t("locationsTitle")}
          description={t("locationsDescription")}
        />

        {/* Branch Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto mb-16"
        >
          {branches.map((branch, index) => (
            <motion.div key={branch.id} variants={itemVariants} className="h-full">
              <div className="group relative h-full rounded-[28px] overflow-hidden bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col">

                {/* Colored top accent bar */}
                <div
                  className="h-1 w-full transition-all duration-500 group-hover:h-1.5"
                  style={{ background: `linear-gradient(90deg, ${branch.accentColor}cc, ${branch.accentColor})` }}
                />

                {/* Map */}
                <div className="relative h-52 w-full overflow-hidden">
                  <iframe
                    title={t(branch.nameKey)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${branch.coords}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-[1.02] group-hover:scale-100"
                  />
                  {/* Map overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />

                  {/* Branch number badge */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg"
                    style={{ background: branch.accentColor }}>
                    {index + 1}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col gap-4 p-6 flex-1">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${branch.accentColor}18` }}
                    >
                      <branch.icon className="w-5 h-5" style={{ color: branch.accentColor }} strokeWidth={2} />
                    </div>
                    <h3
                      className="text-lg font-bold text-[#02110c] tracking-tight leading-tight"
                      
                    >
                      {t(branch.nameKey)}
                    </h3>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-[#6b7280] text-sm leading-relaxed" >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#9ca3af]" strokeWidth={1.5} />
                    <span>{t(branch.addrKey)}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => window.open(branch.fullMapUrl, "_blank")}
                      className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold border border-neutral-200 hover:bg-[#02110c] hover:text-white hover:border-[#02110c] transition-all duration-300"
                      style={{  color: '#374151' }}
                    >
                      <span>{t("viewOnMap")}</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                    {branch.contactUrl && (
                      <button
                        onClick={() => window.open(branch.contactUrl, "_blank")}
                        className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold border border-neutral-200 hover:bg-[#02110c] hover:text-white hover:border-[#02110c] transition-all duration-300"
                        style={{  color: '#374151' }}
                      >
                        <span>{isRtl ? "الموقع" : "Website"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Modern Dark Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[32px] overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 30% 0%, #0d4d2c 0%, #041a0e 60%, #020e08 100%)",
          }}
        >
          {/* Grid lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow orbs */}
          <div className="absolute top-[-60px] left-[20%] w-[300px] h-[300px] rounded-full bg-[#f2c161]/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-80px] right-[10%] w-[250px] h-[250px] rounded-full bg-[#71b83e]/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 px-8 py-14 md:px-20 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-0">

            {/* Left: 68 States */}
            <div className={`flex-1 flex flex-col items-center ${isRtl ? 'md:items-end' : 'md:items-start'} text-center ${isRtl ? 'md:text-end' : 'md:text-start'} gap-5 md:${isRtl ? 'pl-16' : 'pr-16'}`}>
              {/* Icon pill */}
              <div className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f2c161]/20 flex items-center justify-center">
                  <Truck className="w-4.5 h-4.5 text-[#f2c161]" strokeWidth={2} />
                </div>
                <span className="text-white/60 text-sm font-medium" >
                  {isRtl ? "التوصيل السريع" : "Fast Delivery"}
                </span>
              </div>

              {/* Big stat */}
              <div>
                <div className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tighter"
                  style={{
                    
                    background: "linear-gradient(135deg, #f2c161 20%, #ffd98a 60%, #f2c161 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  68
                </div>
                <div className="text-white/50 text-lg font-semibold tracking-wide mt-1 uppercase" >
                  {isRtl ? "ولاية" : "Wilayas"}
                </div>
              </div>

              <p className="text-white/65 text-base leading-relaxed max-w-[320px]" >
                {t("deliveryInfo")}
              </p>

              <button
                className="flex items-center gap-2 text-[#f2c161] text-sm font-semibold hover:gap-3 transition-all duration-300"
                
                onClick={() => window.open("https://maps.app.goo.gl/rEMzBQ9KicBtJg3B6", "_blank")}
              >
                <span>{isRtl ? "تعرف أكثر" : "Learn more"}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/15 to-transparent" />

            {/* Horizontal divider (mobile) */}
            <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Right: Virtual Store */}
            <div className={`flex-1 flex flex-col items-center ${isRtl ? 'md:items-end' : 'md:items-start'} text-center ${isRtl ? 'md:text-end' : 'md:text-start'} gap-5 md:${isRtl ? 'pr-16' : 'pl-16'}`}>
              {/* Icon pill */}
              <div className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#71b83e]/20 flex items-center justify-center">
                  <Globe className="w-4.5 h-4.5 text-[#71b83e]" strokeWidth={2} />
                </div>
                <span className="text-white/60 text-sm font-medium" >
                  {isRtl ? "المتجر الرقمي" : "Virtual Store"}
                </span>
              </div>

              {/* Big stat */}
              <div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tighter text-white"
                  >
                  {isRtl ? "من سريرك" : "From Your"}
                  {!isRtl && (
                    <span style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      background: "linear-gradient(135deg, #71b83e, #9dce6b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "block",
                    }}>
                      Bed.
                    </span>
                  )}
                </div>
              </div>

              <p className="text-white/65 text-base leading-relaxed max-w-[320px]" >
                {t("bedStoreInfo")}
              </p>

              <button
                className="flex items-center gap-2 text-[#71b83e] text-sm font-semibold hover:gap-3 transition-all duration-300"
                
                onClick={() => window.location.href = '/products'}
              >
                <span>{isRtl ? "تسوق الآن" : "Shop online"}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
