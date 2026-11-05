import { SensorExplainer } from "@/components/sensors/sensor-explainer";
import { Container } from "@/components/ui/container";
import { DeviceFrame } from "@/components/ui/device-frame";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { designed } from "@/content/landing";
import { cn } from "@/lib/utils";

export function DesignedSection() {
  return (
    <Section id="designed">
      <Container>
        <SectionHeading title={designed.title} description={designed.description} />

        <div className="mt-12 flex flex-col gap-4">
          {designed.features.map((feature, i) => (
            <Reveal key={feature.id}>
              <article
                className={cn(
                  "grid items-center gap-8 overflow-hidden rounded-[1.75rem] p-6 sm:p-8 lg:gap-12 lg:p-12",
                  i % 2 === 0
                    ? "bg-krem lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"
                    : "bg-kayu/45 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]",
                )}
              >
                <div className={cn(i % 2 === 1 && "lg:order-2")}>
                  <Eyebrow>{feature.plain}</Eyebrow>
                  {/* The first letters spell GONG, down the section. */}
                  <h3 className="mt-2 text-[3.5rem] leading-[0.9] md:text-[4.25rem]">
                    <span className="text-merah">{feature.title[0]}</span>
                    {feature.title.slice(1)}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-pretty">
                    {feature.body}
                  </p>
                  {"explainer" in feature ? <SensorExplainer /> : null}
                </div>
                <DeviceFrame
                  video={feature.video}
                  poster={feature.poster}
                  label={feature.label}
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
