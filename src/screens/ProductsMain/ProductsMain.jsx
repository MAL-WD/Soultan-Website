import React from "react";
import { FilterSidebarSection } from "./sections/FilterSidebarSection";
import ellipseImage from "../../assets/Ellipse.png";
import { useTheme } from "../../context/ThemeContext";

export const ProductsMain = () => {
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col w-full min-h-screen items-center relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#0a1f0e] via-[#0d2411] to-[#061409]' : 'bg-[#fafbfc]'}`}>
      {/* Outer Gold Background Glows - Alternating */}
      <img src={ellipseImage} alt="" className={`absolute top-[5%] left-0 pointer-events-none w-[350px] h-auto object-contain ${isDark ? 'opacity-30' : 'opacity-100'}`} style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className={`absolute top-[20%] right-0 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1] ${isDark ? 'opacity-30' : 'opacity-100'}`} style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className={`absolute top-[40%] left-0 pointer-events-none w-[350px] h-auto object-contain ${isDark ? 'opacity-30' : 'opacity-100'}`} style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className={`absolute top-[60%] right-0 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1] ${isDark ? 'opacity-30' : 'opacity-100'}`} style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className={`absolute top-[80%] left-0 pointer-events-none w-[350px] h-auto object-contain ${isDark ? 'opacity-30' : 'opacity-100'}`} style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className={`absolute top-[95%] right-0 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1] ${isDark ? 'opacity-30' : 'opacity-100'}`} style={{ zIndex: 0 }} />

      <div className="w-full max-w-[1440px] mx-auto relative z-10">
        <FilterSidebarSection />
      </div>
    </div>
  );
};
