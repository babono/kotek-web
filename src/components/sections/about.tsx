import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { about } from "@/content/landing";

export function AboutSection() {
  return (
    <Section id="about">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-5">
          <Reveal stagger className="flex flex-col items-start gap-4">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 className="text-[3.5rem] leading-[0.9] text-balance md:text-[4.5rem]">
              {about.title}
            </h2>
            <p className="text-lg leading-relaxed text-pretty">{about.paragraph}</p>
          </Reveal>
        </div>

        <Reveal className="flex flex-col gap-6">
          <Image
            src={about.photo.src}
            alt={about.photo.alt}
            width={2000}
            height={1125}
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="h-auto w-full rounded-card"
          />
          <ul aria-label="The team" className="flex flex-wrap gap-2">
            {about.team.map((name) => (
              <li
                key={name}
                className="rounded-full border-[1.5px] border-garis bg-surface px-3.5 py-1.5 text-[0.9375rem] font-semibold text-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
          <a
            href={about.partner.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${about.partner.name}, opens in a new tab`}
            className="w-fit rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Image
              src={about.partner.logo}
              alt=""
              width={341}
              height={89}
              className="h-9 w-auto"
            />
          </a>
        </Reveal>
      </Container>
    </Section>
  );
}
