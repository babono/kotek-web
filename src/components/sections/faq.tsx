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
          <h2 className="text-3xl font-bold text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
            Everything you need to know
          </h2>
          <p className="text-muted-foreground text-pretty">
            We&rsquo;ve answered the questions people ask most often about Kotek.
          </p>
        </Reveal>

        <Reveal stagger className="flex flex-col">
          <FaqAccordion faqs={faqs} />
        </Reveal>
      </Container>
    </Section>
  );
}
