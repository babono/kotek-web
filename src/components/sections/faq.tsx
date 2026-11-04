import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { faqs } from "@/content/faqs";

export function FaqSection() {
  return (
    <Section id="faq">
      <Container className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
        <Reveal
          stagger
          className="flex flex-col gap-4 md:sticky md:top-28 md:self-start"
        >
          <h2 className="text-6xl leading-[0.88] text-balance sm:text-7xl">
            Everything you need to know
          </h2>
        </Reveal>

        <Reveal stagger className="flex flex-col">
          <FaqAccordion faqs={faqs} />
        </Reveal>
      </Container>
    </Section>
  );
}
