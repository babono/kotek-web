import { Container } from "@/components/ui/container";
import { DeviceFrame } from "@/components/ui/device-frame";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { designed } from "@/content/landing";
import { cn } from "@/lib/utils";

export function DesignedSection() {
  return (
    <Section id="designed">
      <Container>
        <SectionHeading title={designed.title} />

        <div className="mt-12 flex flex-col gap-4">
          {designed.features.map((feature, i) => (
            <Reveal key={feature.id}>
              <article
                className={cn(
                  "grid items-center gap-8 overflow-hidden rounded-[1.75rem] p-6 sm:p-8 lg:gap-12 lg:p-12",
                  i % 2 === 0
                    ? "bg-krem lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
                    : "bg-kayu/45 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]",
                )}
              >
                <div className={cn(i % 2 === 1 && "lg:order-2")}>
                  <h3 className="text-[3.5rem] leading-[0.9] md:text-[4.25rem]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-pretty">
                    {feature.body}
                  </p>
                </div>
                <DeviceFrame
                  src={feature.image}
                  alt={feature.alt}
                  sizes="(min-width: 1024px) 40rem, 100vw"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
