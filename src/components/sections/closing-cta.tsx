import Image from "next/image";
import { AppStoreButton } from "@/components/ui/app-store-button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { closingCta } from "@/content/landing";

export function ClosingCta() {
  return (
    <Section id="download" className="relative overflow-hidden">
      {/* The turning nawa sanga rose from the app's splash. */}
      <Image
        src="/art/nawasanga.svg"
        alt=""
        width={540}
        height={538}
        className="rose-turn pointer-events-none absolute top-1/2 left-1/2 w-[34rem] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-40"
      />
      <Container className="relative">
        <Reveal stagger className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 lang="ban" className="text-8xl leading-[0.9] md:text-[9rem]">
            {closingCta.title}
          </h2>
          <p className="text-lg">{closingCta.description}</p>
          <AppStoreButton variant="primary" className="mt-2" />
        </Reveal>
      </Container>
    </Section>
  );
}
