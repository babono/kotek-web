import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { PatternsMockup } from "@/components/mockups/patterns-mockup";
import { ProgressMockup } from "@/components/mockups/progress-mockup";
import { RolesMockup } from "@/components/mockups/roles-mockup";
import { features } from "@/content/landing";
import { cn } from "@/lib/utils";

const visuals = {
  patterns: PatternsMockup,
  roles: RolesMockup,
  feedback: ProgressMockup,
} as const;

export function FeaturesSection() {
  return (
    <Section id="features">
      <Container>
        <Reveal>
          <h2 className="max-w-xl text-3xl font-bold text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
            {features.title}
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-5">
          {features.cards.map((card) => {
            const Visual = visuals[card.id];
            return (
              <Reveal key={card.id}>
                <article
                  className={cn(
                    "grid items-center gap-8 rounded-card border border-border p-8 md:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12",
                    card.tint,
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-semibold tracking-wider text-accent uppercase">
                      {card.eyebrow}
                    </span>
                    <h3 className="text-2xl font-bold text-balance sm:text-3xl">
                      {card.title}
                    </h3>
                    <p className="max-w-md leading-relaxed text-muted-foreground">
                      {card.body}
                    </p>
                  </div>
                  <div className="lg:pl-4">
                    <Visual />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
