import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { about } from "@/content/landing";

export function AboutSection() {
  return (
    <Section id="about">
      <Container className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal stagger className="flex flex-col items-start gap-4">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h2 className="text-heading leading-[0.9] text-balance md:text-[4.5rem]">
            {about.title}
          </h2>
          <p className="text-lg text-pretty">{about.intro}</p>

          <ul
            aria-label="The team"
            className="mt-2 grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
          >
            {about.team.map((person) => (
              <li key={person.name} className="rounded-kotek bg-krem px-4 py-3">
                <p className="font-display text-[1.625rem] leading-none text-foreground">
                  {person.name}
                </p>
                <p className="mt-1 text-[0.9375rem] leading-tight text-muted-foreground">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="flex flex-col gap-6">
          <Image
            src={about.photo.src}
            alt={about.photo.alt}
            width={2000}
            height={1125}
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="h-auto w-full rounded-card"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Eyebrow>{about.origin.label}</Eyebrow>
              <p className="mt-2 font-display text-[1.625rem] leading-none text-foreground">
                {about.origin.name}
              </p>
            </div>
            <div>
              <Eyebrow>{about.partner.label}</Eyebrow>
              <a
                href={about.partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${about.partner.name}, opens in a new tab`}
                className="mt-2 block w-fit rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Image
                  src={about.partner.logo}
                  alt=""
                  width={341}
                  height={89}
                  className="h-9 w-auto"
                />
              </a>
              <p className="mt-2 text-[0.9375rem] leading-snug text-pretty text-muted-foreground">
                {about.partner.body}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
