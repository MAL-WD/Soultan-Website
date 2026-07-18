import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ellipseImage from "../../../../assets/Ellipse.png";

export const ComparisonSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const soltaneFeatures = [
    t("comp_sol_1"),
    t("comp_sol_2"),
    t("comp_sol_3"),
    t("comp_sol_4"),
    t("comp_sol_5"),
  ];

  const othersFeatures = [
    t("comp_other_1"),
    t("comp_other_2"),
    t("comp_other_3"),
    t("comp_other_4"),
    t("comp_other_5"),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemLeftVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };
  const itemRightVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section className="w-full py-24 flex items-center bg-neutral-100 overflow-hidden relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* Gold Bullet Accent */}
      <img
        src={ellipseImage}
        alt=""
        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain"
        style={{ zIndex: 0 }}
      />
      <div className="container mx-auto px-4 max-w-[1200px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Others Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center rounded-[32px] overflow-hidden bg-white p-[6px] shadow-[0px_8px_32px_rgba(0,0,0,0.04)]"
          >
            <Card className="w-full h-full bg-[#f5f5f5] rounded-[26px] overflow-hidden border-0 bg-gradient-to-r from-white via-[#f5f5f5] to-[#f5f5f5]">
              <CardContent className="p-8 sm:p-10 flex flex-col justify-center h-full space-y-6">
                <h3 className={`text-center text-[#02110c] text-3xl md:text-4xl font-bold tracking-tight mb-2 ${isRtl ? 'font-arabic' : 'font-serif'}`}>
                  {t("comp_others")}
                </h3>

                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-0 w-full max-w-[400px] mx-auto"
                >
                  {othersFeatures.map((feature, index) => (
                    <motion.div
                      variants={itemLeftVariants}
                      key={index}
                      className={`flex items-center justify-start gap-3 py-3 ${
                        index < othersFeatures.length - 1
                          ? "border-b border-white"
                          : ""
                      }`}
                    >
                      <XIcon className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={2.5} />
                      <span className={`font-medium text-[#52546b] text-sm sm:text-base text-start ${isRtl ? 'font-arabic' : 'font-english'}`}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soltane Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex items-center rounded-[32px] overflow-hidden bg-gradient-to-br from-[#eab308] via-[#84cc16] to-[#14532d] p-[6px] shadow-[0px_16px_48px_rgba(0,0,0,0.1)]"
          >
            <Card className="w-full h-full bg-[#f5f5f5] rounded-[26px] overflow-hidden border-0 bg-gradient-to-r from-white via-[#f5f5f5] to-[#f5f5f5]">
              <CardContent className="p-8 sm:p-10 flex flex-col justify-center h-full space-y-6">
                <h3 className={`text-center text-[#02110c] text-3xl md:text-4xl font-bold tracking-tight mb-2 ${isRtl ? 'font-arabic' : 'font-serif'}`}>
                  {t("comp_soltane")}
                </h3>

                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-0 w-full max-w-[400px] mx-auto"
                >
                  {soltaneFeatures.map((feature, index) => (
                    <motion.div
                      variants={itemRightVariants}
                      key={index}
                      className={`flex items-center justify-start gap-3 py-3 ${
                        index < soltaneFeatures.length - 1
                          ? "border-b border-white"
                          : ""
                      }`}
                    >
                      <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" strokeWidth={2.5} />
                      <span className={`font-medium text-[#52546b] text-sm sm:text-base text-start ${isRtl ? 'font-arabic' : 'font-english'}`}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
