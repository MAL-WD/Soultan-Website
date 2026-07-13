import React from "react";
import { ParallaxWrapper } from "../../components/ParallaxWrapper";
import { Button } from "../../components/ui/button";
import { BenefitsSection } from "./sections/BenefitsSection";
import { ComparisonSection } from "./sections/ComparisonSection";
import { DesignAndBuildSection } from "./sections/DesignAndBuildSection";
import { DesktopSection } from "./sections/DesktopSection";
import { EmailSection } from "./sections/EmailSection";
import { FaqsSection } from "./sections/FaqsSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { CategoriesMarqueeSection } from "./sections/CategoriesMarqueeSection";
import { IntroductionSection } from "./sections/IntroductionSection";
import { LocationSection } from "./sections/LocationSection/LocationSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { TrustSection } from "./sections/TrustSection";
import { UserFlowSection } from "./sections/UserFlowSection";
import { StatsSection } from "./sections/StatsSection";

const navigationItems = [
  { label: "About", width: "w-[36.94px]" },
  { label: "Blog", width: "w-[27.98px]" },
  { label: "Features", width: "w-[51.39px]" },
  { label: "Locations", width: "w-[62.61px]" },
];

export const HomePageFrame = () => {
  return (
    <div className="bg-neutral-100 w-full relative">
      <div className="w-full">
        <HeroSection />

        <ParallaxWrapper speed={0.15}>
          <IntroductionSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.1}>
          <CategoriesMarqueeSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.12}>
          <FeaturesSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.18}>
          <TrustSection />
        </ParallaxWrapper>

        <BenefitsSection />

        <ParallaxWrapper speed={0.15}>
          <DesignAndBuildSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.12}>
          <UserFlowSection />
        </ParallaxWrapper>

        <StatsSection />

        {/* <ParallaxWrapper speed={0.18}>
          <DesktopSection />
        </ParallaxWrapper> */}

        <ParallaxWrapper speed={0.1}>
          <TestimonialsSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.12}>
          <FaqsSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.15}>
          <ComparisonSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.1}>
          <LocationSection />
        </ParallaxWrapper>

        <ParallaxWrapper speed={0.12}>
          <EmailSection />
        </ParallaxWrapper>
      </div>
    </div>
  );
};

