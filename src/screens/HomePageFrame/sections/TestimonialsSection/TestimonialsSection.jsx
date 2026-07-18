import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, useMotionValue, animate } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { SectionHeader } from "../../../../components/SectionHeader/SectionHeader";
import { Card, CardContent } from "../../../../components/ui/card";
import ellipseImage from "../../../../assets/Ellipse.png";

const testimonials = [
  { id: 1, author: "testimonial_1_author", role: "testimonial_1_role", quote: "testimonial_1_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: 2, author: "testimonial_2_author", role: "testimonial_2_role", quote: "testimonial_2_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
  { id: 3, author: "testimonial_3_author", role: "testimonial_3_role", quote: "testimonial_3_quote", stars: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
  { id: 4, author: "testimonial_4_author", role: "testimonial_4_role", quote: "testimonial_4_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" },
  { id: 5, author: "testimonial_5_author", role: "testimonial_5_role", quote: "testimonial_5_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
  { id: 6, author: "testimonial_6_author", role: "testimonial_6_role", quote: "testimonial_6_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim" },
  { id: 7, author: "testimonial_1_author", role: "testimonial_1_role", quote: "testimonial_1_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia" },
  { id: 8, author: "testimonial_2_author", role: "testimonial_2_role", quote: "testimonial_2_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel" },
  { id: 9, author: "testimonial_3_author", role: "testimonial_3_role", quote: "testimonial_3_quote", stars: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina" },
];

const TestimonialCard = ({ author, role, quote, stars, avatar, t }) => (
  <Card 
    className="mb-6 group cursor-pointer select-none"
    style={{
      backgroundColor: "rgb(255, 255, 255)",
      border: "2px solid rgb(255, 255, 255)",
      borderRadius: "16px",
      boxShadow: "inset 0px 0.602187px 0.602187px -1.25px rgba(0, 0, 0, 0.06), inset 0px 2.28853px 2.28853px -2.5px rgba(0, 0, 0, 0.06), inset 0px 10px 10px -3.75px rgba(0, 0, 0, 0.02), inset 0px 8px 262px 0px rgba(145, 130, 179, 0.04)"
    }}
  >
    <CardContent className="p-6 md:p-8 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 flex-shrink-0"
          style={{
            border: "2px solid rgb(255, 255, 255)",
            borderRadius: "10px",
            boxShadow: "0px 0.602187px 0.602187px -1px rgba(57, 46, 71, 0.15), 0px 2.28853px 2.28853px -2px rgba(57, 46, 71, 0.14), 0px 10px 10px -3px rgba(57, 46, 71, 0.1)"
          }}
        >
          <img src={avatar} alt={t(author)} className="w-full h-full object-cover rounded-[8px] pointer-events-none" />
        </div>
        <div className="flex flex-col">
          <span className="[font-family:'Inter',Helvetica] font-semibold text-[#000000] text-base leading-tight">
            {t(author)}
          </span>
          <span className="[font-family:'Inter',Helvetica] font-medium text-[rgb(120,120,120)] text-sm md:text-md mt-1">
            {t(role)}
          </span>
        </div>
      </div>
      
      <div 
        className="w-full h-[1px] my-1" 
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.05)", 
          borderRadius: "8px"
        }}
      ></div>

      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={`${i < stars ? "text-[#f2c161] fill-[#f2c161]" : "text-neutral-200 fill-neutral-200"}`} />
        ))}
      </div>

      <p className="[font-family:'Inter',Helvetica] font-medium text-[#424242] text-sm md:text-base leading-relaxed opacity-90 text-start">
        {t(quote)}
      </p>
    </CardContent>
  </Card>
);

const DraggableMarquee = ({ items, speed = 60, reverse = false, t, isMobile = false }) => {
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerHeight = useRef(0);
  const animationRef = useRef(null);

  // Duplicating items 4x for density
  const infiniteItems = [...items, ...items, ...items, ...items];

  const startAutoScroll = () => {
    if (animationRef.current) animationRef.current.stop();

    // Loop target calculation
    const currentY = y.get();
    const endY = reverse ? 0 : -1000; // Simplified wrap range
    
    // Duration based on remaining distance to keep speed constant
    const distance = reverse ? (0 - currentY) : (currentY - (-1000));
    const normalizedDistance = Math.abs(distance);
    const calculatedDuration = (normalizedDistance / 1000) * speed;

    animationRef.current = animate(y, reverse ? 0 : -1000, {
      duration: Math.max(calculatedDuration, 0),
      ease: "linear",
      onComplete: () => {
        y.set(reverse ? -1000 : 0);
        startAutoScroll();
      }
    });
  };

  useEffect(() => {
    if (!isDragging) {
      startAutoScroll();
    }
    return () => animationRef.current?.stop();
  }, [isDragging, reverse, speed]);

  const handleDragStart = () => {
    setIsDragging(true);
    if (animationRef.current) animationRef.current.stop();
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    // Boundary check for "infinite" wrap feel during drag
    let currentY = y.get();
    if (currentY < -1000) y.set(currentY + 1000);
    if (currentY > 0) y.set(currentY - 1000);
    startAutoScroll();
  };

  return (
    <div className="flex flex-col h-[360px] sm:h-[500px] md:h-[800px] overflow-hidden relative marquee-mask sm:touch-none">
      <motion.div
        drag={isMobile ? false : "y"}
        style={{ y }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: isMobile ? "default" : "grabbing" }}
        className={`flex flex-col gap-6 ${isMobile ? "" : "cursor-grab"}`}
      >
        {infiniteItems.map((item, idx) => (
          <TestimonialCard key={`${item.id}-${idx}`} {...item} t={t} />
        ))}
      </motion.div>
    </div>
  );
};

export const TestimonialsSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const col1 = [testimonials[0], testimonials[1], testimonials[2]];
  const col2 = [testimonials[3], testimonials[4], testimonials[5]];
  const col3 = [testimonials[6], testimonials[7], testimonials[8]];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const displayItems = isMobile ? testimonials : col1;

  return (
    <section className="relative w-full bg-neutral-100 py-16 sm:py-32 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Gold Bullet Accent - hidden on mobile to avoid overflow */}
      <img
        src={ellipseImage}
        alt=""
        className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none w-[350px] h-auto object-contain"
        style={{ zIndex: 0 }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <SectionHeader 
            badgeText={t("testimonialsBadge")}
            title={t("testimonialsTitle")}
            description={t("testimonialsDescription")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-[1400px] mx-auto relative content-start">
          <DraggableMarquee items={displayItems} speed={40} reverse={true} t={t} isMobile={isMobile} />
          <div className="hidden sm:block">
            <DraggableMarquee items={col2} speed={30} reverse={false} t={t} />
          </div>
          <div className="hidden md:block">
            <DraggableMarquee items={col3} speed={50} reverse={true} t={t} />
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          className="text-center mt-12 [font-family:'Inter',Helvetica] text-sm font-medium tracking-tight opacity-40"
        >
          {isRTL ? "اضغط واسحب أي عمود للتصفح بحرية" : "Drag any column up or down to explore"}
        </motion.p>
      </div>

      <style jsx>{`
        .marquee-mask {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
};
