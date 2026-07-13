import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";
import { TextColorLetters } from "../IntroductionSection/TextColorLetters";

export const TrustSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const decorationVariants = {
    hidden: (side) => ({
      opacity: 0,
      x: side === "left" ? -40 : 40,
      rotate: side === "left" ? -10 : 10,
    }),
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 1,
        delay: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="relative w-full flex items-center bg-transparent py-32 overflow-visible"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-x-0 top-0 bottom-[-100px] pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(242, 218, 97, 0.4) 0%, rgba(242, 218, 97, 0) 100%)",
        }}
      />

      <motion.div
        className="container mx-auto px-4 max-w-[960px] flex flex-col items-center gap-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Stars */}
        <motion.img
          variants={itemVariants}
          className="w-full max-w-[960px] h-[29px]"
          alt="Stars"
          src="/stars.svg"
        />

        {/* Quote block */}
        <div className="relative w-full max-w-[850px] flex flex-col items-center">
          <motion.img
            custom="left"
            variants={decorationVariants}
            className="absolute w-[94px] h-[65px] -top-20 -left-16 sm:-left-24"
            alt="Quote decoration"
            src="/quote-decoration---okatgauukgm4fbe7ypnxhzende4-svg-1.svg"
          />

          {/* Animated scroll-driven text — same effect as IntroductionSection */}
          <div className="relative w-full text-center px-8">
            <TextColorLetters
              text={t("trustQuote")}
              fontSize={window.innerWidth < 640 ? 28 : window.innerWidth < 1024 ? 38 : 48}
              lineHeight={1.15}
              letterSpacing={isRTL ? 0 : -2}
              duration={0.5}
              fontWeight={700}
              fontFamily={isRTL ? 'ThmanyahSerifDisplay, ThmanyahSerifText, Arial, sans-serif' : 'Instrument Serif'}
              transitionStartIndex={isRTL ? 0 : 30}
              paragraphAlign="center"
              isRTL={isRTL}
            />
          </div>

          <motion.img
            custom="right"
            variants={decorationVariants}
            className="absolute w-[94px] h-[65px] -bottom-20 -right-16 sm:-right-24"
            alt="Quote decoration"
            src="/quote-decoration---okatgauukgm4fbe7ypnxhzende4-svg.svg"
          />
        </div>

        {/* Author card */}
        <motion.div variants={itemVariants}>
          <Card className="w-fit bg-white/80 backdrop-blur-md rounded-[32px] overflow-hidden shadow-[0px_32px_64px_-16px_rgba(21,48,43,0.12)] border-2 border-white/50 group hover:shadow-[0px_48px_80px_-16px_rgba(21,48,43,0.16)] transition-all duration-500">
            <CardContent className="flex items-center gap-5 px-6 py-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#f2c161]/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Avatar className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm relative z-10 transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage
                    src="/ai-man-profile-picture.png"
                    alt={t("trustAuthor")}
                    className="rounded-2xl object-cover"
                  />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="[font-family:'Inter',Helvetica] font-bold text-[#02110c] text-base tracking-tight leading-tight whitespace-nowrap">
                  {t("trustAuthor")}
                </span>
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#02110c]/60 text-xs tracking-wider leading-tight uppercase">
                  {t("trustRole")}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};
