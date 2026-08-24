import { iconRegistry } from "@/components/icons/registry";
import { Card, CardDescription, CardIcon, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { audiences } from "@/content/landing";

export function AudienceSection() {
  return (
    <Section id="community">
      <Container>
        <SectionHeading title={audiences.title} />

        <Reveal stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {audiences.cards.map((card) => {
            const Icon = iconRegistry[card.icon];
            return (
              <Card key={card.title} className="gap-4">
                <CardIcon>
                  <Icon className="size-5.5" />
                </CardIcon>
                <span className="flex flex-col gap-2">
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.body}</CardDescription>
                </span>
              </Card>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
