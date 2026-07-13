import React from "react";
import { FilterSidebarSection } from "./sections/FilterSidebarSection";
import ellipseImage from "../../assets/Ellipse.png";

export const ProductsMain = () => {
  return (
    <div className="flex flex-col w-full min-h-screen items-center relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Outer Gold Background Glows - Alternating */}
      <img src={ellipseImage} alt="" className="absolute top-[5%] left-0 pointer-events-none w-[350px] h-auto object-contain" style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className="absolute top-[20%] right-0 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]" style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className="absolute top-[40%] left-0 pointer-events-none w-[350px] h-auto object-contain" style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className="absolute top-[60%] right-0 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]" style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className="absolute top-[80%] left-0 pointer-events-none w-[350px] h-auto object-contain" style={{ zIndex: 0 }} />
      <img src={ellipseImage} alt="" className="absolute top-[95%] right-0 pointer-events-none w-[350px] h-auto object-contain scale-x-[-1]" style={{ zIndex: 0 }} />

      <div className="w-full max-w-[1440px] mx-auto relative z-10">
        <FilterSidebarSection />
      </div>
    </div>
  );
};
