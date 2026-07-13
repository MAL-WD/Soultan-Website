import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { SectionHeader } from "../../../../components/SectionHeader/SectionHeader";
import ellipseImage from "../../../../assets/Ellipse.png";

export const FaqsSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const faqItemsLeft = [1, 2, 3, 4];
  const faqItemsRight = [5, 6, 7, 8];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative w-full bg-neutral-100 py-24" dir={isRTL ? "rtl" : "ltr"}>
      {/* Gold Bullet Accent */}
      <img
        src={ellipseImage}
        alt=""
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]"
        style={{ zIndex: 0 }}
      />
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionHeader 
            badgeText={t("faqBadge")}
            title={t("faqTitle")}
            description={t("faqDescription")}
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible className="flex flex-col gap-4">
              {faqItemsLeft.map((id) => (
                <motion.div key={`faq-left-${id}`} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-neutral-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline text-start group">
                      <span className="[font-family:'Inter',Helvetica] font-semibold text-[#02110c] text-base md:text-lg tracking-tight group-data-[state=open]:text-brand-color-main transition-colors">
                        {t(`faq_q_${id}`)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0">
                      <p className="[font-family:'Inter',Helvetica] font-medium text-[#424242] text-[15px] md:text-base leading-relaxed opacity-80">
                        {t(`faq_a_${id}`)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible className="flex flex-col gap-4">
              {faqItemsRight.map((id) => (
                <motion.div key={`faq-right-${id}`} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-neutral-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline text-start group">
                      <span className="[font-family:'Inter',Helvetica] font-semibold text-[#02110c] text-base md:text-lg tracking-tight group-data-[state=open]:text-brand-color-main transition-colors">
                        {t(`faq_q_${id}`)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0">
                      <p className="[font-family:'Inter',Helvetica] font-medium text-[#424242] text-[15px] md:text-base leading-relaxed opacity-80">
                        {t(`faq_a_${id}`)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
