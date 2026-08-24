import { AppStoreButton } from "@/components/ui/app-store-button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { closingCta } from "@/content/landing";

export function ClosingCta() {
  return (
    <Section id="download">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-inverse px-6 py-20 text-center md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,rgba(185,149,38,0.28),transparent_65%)]"
          />
          <Reveal
            stagger
            delay={120}
            className="relative mx-auto flex max-w-2xl flex-col items-center gap-5"
          >
            <h2 className="text-3xl font-bold text-balance text-inverse-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              {closingCta.title}
            </h2>
            <p className="text-inverse-foreground/70">{closingCta.description}</p>
            <AppStoreButton variant="primary" className="mt-2" />
          </Reveal>
        </Reveal>
      </Container>
    </Section>
  );
}
