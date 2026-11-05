import { AboutSection } from "@/components/sections/about";
import { ClosingCta } from "@/components/sections/closing-cta";
import { ComplementSection } from "@/components/sections/complement";
import { ContributeSection } from "@/components/sections/contribute";
import { DesignedSection } from "@/components/sections/designed";
import { FaqSection } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { ImpactSection } from "@/components/sections/impact";
import { InsideSection } from "@/components/sections/inside";
import { RealGangsaSection } from "@/components/sections/real-gangsa";
import { StorySection } from "@/components/sections/story";

/** Story, then features, then impact. The order is the argument. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <InsideSection />

      <StorySection />

      <HowItWorksSection />
      <ComplementSection />
      <DesignedSection />
      <RealGangsaSection />

      <ImpactSection />
      <AboutSection />
      <ContributeSection />

      <FaqSection />
      <ClosingCta />
    </>
  );
}
