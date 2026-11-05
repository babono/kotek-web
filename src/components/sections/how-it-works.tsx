import Image from "next/image";
import { Container } from "@/components/ui/container";
import { MiniRoll } from "@/components/ui/mini-roll";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { howItWorks } from "@/content/landing";

const visuals = [
  <div key="record" aria-hidden className="relative h-20">
    <MiniRoll sangsih={null} />
    <Image
      src="/art/mallet.svg"
      alt=""
      width={153}
      height={114}
      className="absolute -top-3 right-0 h-14 w-auto"
    />
  </div>,
  <MiniRoll key="practise" />,
  <MiniRoll key="improve" polos="gold" sangsih="ghost" />,
];

export function HowItWorksSection() {
  return (
    <Section id="features">
      <Container>
        <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <article
              key={step.number}
              className="flex flex-col gap-5 rounded-card bg-krem p-6"
            >
              {/* `SetupHeader`: the app's step bars, filling Merah. */}
              <div aria-hidden className="flex gap-1.5">
                {howItWorks.steps.map((_, bar) => (
                  <span
                    key={bar}
                    className={`h-1.5 flex-1 rounded-full ${bar <= i ? "bg-merah" : "bg-surface"}`}
                  />
                ))}
              </div>
              {visuals[i]}
              <div>
                <h3 className="flex items-baseline gap-3 text-[2.75rem] leading-none">
                  <span className="text-gold-text">{step.number}</span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[1.0625rem] text-pretty">{step.body}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
