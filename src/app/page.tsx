import { AudienceSection } from "@/components/sections/audience";
import { BenefitsSection } from "@/components/sections/benefits";
import { ClosingCta } from "@/components/sections/closing-cta";
import { FaqSection } from "@/components/sections/faq";
import { FeaturesSection } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { MekarBhuanaSection } from "@/components/sections/mekar-bhuana";
import { ProblemSection } from "@/components/sections/problem";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <AudienceSection />
      <MekarBhuanaSection />
      <FeaturesSection />
      <BenefitsSection />
      <FaqSection />
      <ClosingCta />
    </>
  );
}

