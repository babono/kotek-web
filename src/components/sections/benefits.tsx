import { iconRegistry } from "@/components/icons/registry";
import { CardDescription, CardIcon, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits } from "@/content/landing";

export function BenefitsSection() {
  return (
    <Section>
      <Container>
        <SectionHeading title={benefits.title} />

        <Reveal
          stagger
          className="mx-auto mt-14 grid max-w-4xl gap-x-16 gap-y-12 sm:grid-cols-2"
        >
          {benefits.cards.map((card) => {
            const Icon = iconRegistry[card.icon];
            return (
              <article key={card.title} className="flex flex-col gap-4">
                <CardIcon>
                  <Icon className="size-5.5" />
                </CardIcon>
                <span className="flex flex-col gap-2">
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.body}</CardDescription>
                </span>
              </article>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
