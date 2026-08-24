import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { problem } from "@/content/landing";

export function ProblemSection() {
  return (
    <Section>
      <Container>
        <SectionHeading
          title={problem.title}
          description={problem.description}
        />

        <Reveal stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {problem.cards.map((card) => (
            <Card key={card.title}>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.body}</CardDescription>
            </Card>
          ))}
        </Reveal>

        <Reveal
          stagger
          className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-3 text-center"
        >
          <h3 className="text-2xl font-bold text-balance sm:text-3xl">
            {problem.closing.title}
          </h3>
          <p className="text-muted-foreground">{problem.closing.body}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
