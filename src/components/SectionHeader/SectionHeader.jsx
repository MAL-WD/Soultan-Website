import React from "react";
import { Badge } from "../ui/badge";
import crownImage from "../../assets/crown.png";
import { motion } from "framer-motion";

export const SectionHeader = ({ badgeText, title, description }) => {
  // Premium smooth easing
  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <header className="flex flex-col items-center text-center mb-[40px] md:mb-[80px] px-4">
      <div className="relative mb-[10px] md:mb-[20px] flex flex-col items-center w-full max-w-[480px]">
        {/* Crown Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="relative w-full aspect-[600/350] flex items-center justify-center"
        >
          {/* Crown Image */}
          <img 
            src={crownImage} 
            alt="Crown" 
            className="w-full h-full object-contain" 
          />
          
          {/* Badge centered on the crown base */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center pt-[18%] sm:pt-[16%] md:pt-[14%]"
          >
              <Badge className="bg-[#03291c] text-[#f7f8ff] hover:bg-[#03291c] rounded-[30.19px] px-3 py-1 md:px-4 md:py-[6px] text-[10px] sm:text-xs font-semibold tracking-wide shadow-md border-none">
                {badgeText}
              </Badge>
          </motion.div>
        </motion.div>
        
        {/* Horizontal Gold-ish Line */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.6, ease: smoothEase }}
          className="w-[50%] h-1 md:h-1.5 bg-[#f2da61] rounded-full mt-[-15%] sm:mt-[18%] md:mt-[-25%] shadow-sm origin-center z-10" 
        />
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6, ease: smoothEase }}
        className="[font-family:'Inter',Helvetica] font-semibold text-[#02110c] text-[28px] sm:text-[38px] md:text-[48px] tracking-[-1.5px] sm:tracking-[-2px] md:tracking-[-2.40px] leading-[34px] sm:leading-[44px] md:leading-[54px] mb-4 mt-2 md:mt-3"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: smoothEase }}
          className="[font-family:'Inter',Helvetica] font-normal text-[#424242] text-sm sm:text-base md:text-lg tracking-[-0.32px] leading-[20px] sm:leading-[24px] max-w-[600px] mx-auto opacity-80"
        >
          {description}
        </motion.p>
      )}
    </header>
  );
};
