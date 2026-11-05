import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { impact } from "@/content/landing";
import { cn } from "@/lib/utils";

export function ImpactSection() {
  return (
    <Section id="impact" className="bg-krem">
      <Container>
        <SectionHeading eyebrow={impact.eyebrow} title={impact.title} />

        {/* The picker's selected card: gold ring, gold edge, tumpal along the top. */}
        <Reveal className="mt-12">
          <div className="tactile overflow-hidden rounded-[1.75rem] border-[3px] border-kuning bg-surface [--base:#e5a020] [--depth:6px]">
            <div aria-hidden className="tumpal" />
            <div className="grid gap-10 p-7 md:grid-cols-[auto_auto_auto] md:justify-between md:gap-8 md:p-12">
              {impact.places.map((group) => (
                <div key={group.kind}>
                  <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {group.kind}
                  </h3>
                  <ul className="mt-4 flex flex-col gap-2">
                    {group.names.map((name) => (
                      <li
                        key={name}
                        className="font-display text-[2.75rem] leading-[1] text-foreground md:text-[3.25rem]"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
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
      </Container>
    </Section>
  );
}
