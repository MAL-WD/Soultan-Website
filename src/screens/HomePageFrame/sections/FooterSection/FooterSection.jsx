import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import bgImage from "../../../../assets/Smooth Gradient of Gray to Green.png";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const FooterSection = () => {
  const { t } = useTranslation();

  const navigationLinks = [
    { label: t("products"), path: "/products" },
    { label: t("benefitsBadge", { defaultValue: "Benefits" }), path: "/#benefits" },
    { label: t("testimonialsBadge", { defaultValue: "Testimonials" }), path: "/#testimonials" },
    { label: t("faqBadge", { defaultValue: "FAQs" }), path: "/#faqs" },
    { label: t("contact"), path: "/contact" },
  ];

  const socialLinks = [
    { label: "Tiktok", path: "https://www.tiktok.com/@soultan_stationery" },
    { label: "Instagram", path: "https://www.instagram.com/soultan_stationery/" },
    { label: "Facebook", path: "https://www.facebook.com/PapetrieelSoltane?locale=fr_FR" },
  ];

  const pageLinks = [
    { label: t("home"), path: "/" },
    { label: t("about"), path: "/about" },
    { label: t("profile"), path: "/profile" },
  ];

  const contactInfo = [
    { label: "0656 97 54 04", path: "tel:0656975404", type: "contact" },
    { label: "soltanestationery@gmail.com", path: "mailto:soltanestationery@gmail.com", type: "contact" },
    { label: "La CNEP Branch", path: "https://soltanestationerylacnep.framer.website/", type: "branch" },
    { label: "Bidando Branch", path: "https://soltanstationerybidando.framer.website/", type: "branch" },
  ];

  return (
    <footer className="relative w-full bg-[#f7f8ff] overflow-hidden">
      <div
        className="absolute w-full h-full top-0 left-0 bg-cover bg-[50%_50%]"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Top fade — dissolves the hard line from the email section above */}
      <div
        className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, #f4f5f8 0%, transparent 100%)" }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[120px] pt-12 sm:pt-16 lg:pt-[100px] pb-[180px] sm:pb-[220px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[120px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h2 className="font-normal text-[#02110c] text-xl sm:text-2xl tracking-[-1.20px] leading-[28.8px]">
              {t("footer_subtitle")}
            </h2>

            <div className="w-full max-w-[294px] h-px bg-[#fffef0] rounded-[3px]" />

            <p className="font-normal text-[#595269fa] text-sm sm:text-base tracking-[-0.32px] leading-relaxed max-w-sm">
              {t("footer_description")}
            </p>

            <Button className="w-fit px-6 h-[43px] bg-[#e0e0e0] hover:bg-[#d0d0d0] rounded-lg shadow-[0px_10px_14px_-3px_#0000000f,0px_2.29px_3.2px_-2px_#00000014,0px_0.6px_0.84px_-1px_#00000017] border border-solid border-[#f2f2f2]">
              <span className="font-medium text-[#02110c] text-sm sm:text-base tracking-[-0.64px] leading-[19.2px]">
                {t("footer_cta")}
              </span>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10"
          >
            <nav className="flex flex-col gap-3">
              <h3 className="font-medium text-[#02110c] text-base sm:text-lg tracking-[-1.08px] leading-[21.6px]">
                {t("footer_nav")}
              </h3>
              <ul className="flex flex-col gap-2">
                {navigationLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="font-normal text-[#424242] text-sm sm:text-base tracking-[-0.96px] leading-[17.6px] hover:text-[#02110c] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="flex flex-col gap-3">
              <h3 className="font-medium text-[#02110c] text-base sm:text-lg tracking-[-1.08px] leading-[21.6px]">
                {t("footer_socials")}
              </h3>
              <ul className="flex flex-col gap-2">
                {socialLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-normal text-[#424242] text-sm sm:text-base tracking-[-0.96px] leading-[17.6px] hover:text-[#02110c] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="flex flex-col gap-3">
              <h3 className="font-medium text-[#02110c] text-base sm:text-lg tracking-[-1.08px] leading-[21.6px]">
                {t("footer_pages")}
              </h3>
              <ul className="flex flex-col gap-2">
                {pageLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="font-normal text-[#424242] text-sm sm:text-base tracking-[-0.96px] leading-[17.6px] hover:text-[#02110c] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="flex flex-col gap-3">
              <h3 className="font-medium text-[#02110c] text-base sm:text-lg tracking-[-1.08px] leading-[21.6px]">
                {t("footer_contact")}
              </h3>
              <ul className="flex flex-col gap-3">
                {contactInfo.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      dir={link.label.includes('0656') ? "ltr" : undefined}
                      target={link.type === 'branch' ? "_blank" : undefined}
                      rel={link.type === 'branch' ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-1.5 text-sm sm:text-base tracking-[-0.96px] leading-[17.6px] transition-colors whitespace-nowrap ${
                        link.type === 'branch' 
                          ? 'font-medium text-[#02110c] hover:text-[#055228] mt-1' 
                          : 'font-normal text-[#424242] hover:text-[#02110c]'
                      }`}
                    >
                      {link.label}
                      {link.type === 'branch' && (
                        <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </div>
      </div>

      <div className="absolute w-full left-0 bottom-0 h-[180px] sm:h-[220px] overflow-hidden">
        <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="[-webkit-text-stroke:1px_#f7f8ff26] bg-[linear-gradient(0deg,rgba(242,194,97,0.66)_10%,rgba(242,193,97,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-bold text-transparent text-[80px] sm:text-[140px] lg:text-[226.8px] tracking-[1px] leading-none"
          >
            SOLTANE
          </motion.div>
        </div>

        <div className="absolute w-full bottom-0 left-0 px-6 sm:px-12 lg:px-[120px] py-5 border-solid border-brand-color-main">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-normal text-[#e0e0e0] text-sm sm:text-base tracking-[-0.32px] leading-[17.6px]">
              {t("footer_rights")}
            </p>
            <p className="font-normal text-white text-sm sm:text-base text-center tracking-[-0.32px] leading-[17.6px]">
              {t("footer_made_by")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
