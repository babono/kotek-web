import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { realGangsa } from "@/content/landing";

export function RealGangsaSection() {
  return (
    <Section id="real-gangsa" className="pt-0 md:pt-0">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Image
            src={realGangsa.photo.src}
            alt={realGangsa.photo.alt}
            width={1132}
            height={678}
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="h-auto w-full rounded-card"
          />
        </Reveal>
        <Reveal stagger className="flex flex-col items-start gap-5">
          <Eyebrow>{realGangsa.eyebrow}</Eyebrow>
          <h2 className="text-[3.5rem] leading-[0.88] text-balance md:text-[4.75rem]">
            {realGangsa.title}
          </h2>
          <p className="text-lg leading-relaxed text-pretty">{realGangsa.body}</p>
          <ul className="flex flex-wrap gap-2">
            {realGangsa.points.map((point) => (
              <li
                key={point}
                className="rounded-full bg-krem px-4 py-2 text-[0.9375rem] font-semibold text-foreground"
              >
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
