import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { contribute } from "@/content/landing";
import { siteConfig } from "@/content/site";

export function ContributeSection() {
  return (
    <Section id="get-involved" className="bg-krem">
      <Container>
        <SectionHeading eyebrow={contribute.eyebrow} title={contribute.title} />
        <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {contribute.ways.map((way) => (
            <article
              key={way.who}
              className="flex flex-col items-start gap-4 rounded-card bg-surface p-6"
            >
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {way.who}
                </p>
                <h3 className="mt-3 text-[2.125rem] leading-[0.95] md:text-[2.5rem] text-balance">
                  {way.what}
                </h3>
              </div>
              <ButtonLink
                href={
                  "href" in way
                    ? way.href
                    : `mailto:${siteConfig.email}?subject=${encodeURIComponent(way.subject)}`
                }
                variant="secondary"
                size="regular"
              >
                {way.cta}
              </ButtonLink>
            </article>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
