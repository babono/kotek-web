import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { AudienceSection } from "@/components/sections/audience";
import { BenefitsSection } from "@/components/sections/benefits";
import { ClosingCta } from "@/components/sections/closing-cta";
import { FaqSection } from "@/components/sections/faq";
import { FeaturesSection } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem";

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <ProblemSection />
        <AudienceSection />
        <FeaturesSection />
        <BenefitsSection />
        <FaqSection />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
