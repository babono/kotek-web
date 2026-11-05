import { placeIcons } from "@/components/icons/place-icons";
import { PlaceMap } from "@/components/sections/place-map";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { impact } from "@/content/landing";
import { cn } from "@/lib/utils";

const { market } = impact;

export function ImpactSection() {
  return (
    <Section id="impact" className="bg-krem">
      <Container>
        <SectionHeading eyebrow={impact.eyebrow} title={impact.title} />

        <Reveal className="mt-12">
          <PlaceMap />
        </Reveal>

        <Reveal stagger className="mt-8 grid gap-3 md:grid-cols-3">
          {impact.status.map((item) => (
            <div key={item.label} className="flex gap-3 p-2">
              {/* The app's status dots: Pandan is all good, Kuning is on its way. */}
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-3 shrink-0 rounded-full",
                  item.state === "live" ? "bg-pandan" : "bg-kuning",
                )}
              />
              <p className="text-[1.0625rem] text-pretty">
                <strong className="block font-semibold text-foreground">
                  {item.label}
                </strong>
                {item.body}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal stagger className="mt-16 flex flex-col items-center gap-3 text-center md:mt-24">
          <Eyebrow>{market.eyebrow}</Eyebrow>
          <h3 className="max-w-3xl text-[3.5rem] leading-[0.88] text-balance md:text-[4.75rem]">
            {market.title}
          </h3>
        </Reveal>

        <Reveal stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {market.stats.map((stat) => {
            const Icon = placeIcons[stat.icon];
            return (
              <article
                key={stat.label}
                className="flex flex-col gap-3 rounded-card border-[1.5px] border-garis/60 bg-surface p-6"
              >
                <Icon className="size-6 text-ireng" />
                <div>
                  <p className="mt-2 font-display text-[4rem] leading-[0.7] text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-[1.0625rem] leading-snug text-pretty">{stat.label}</p>
                  {"note" in stat ? (
                    <p className="mt-2 text-sm text-pretty text-muted-foreground">{stat.note}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </Reveal>

        <p className="mt-5 text-center text-sm text-pretty text-muted-foreground">
          {market.sourcesLabel}:{" "}
          {market.sources.map((source, i) => (
            <span key={source.href}>
              {i > 0 ? " · " : null}
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {source.label}
              </a>
            </span>
          ))}
        </p>
      </Container>
    </Section>
  );
}
