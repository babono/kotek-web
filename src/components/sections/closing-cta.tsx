import Image from "next/image";
import { AppStoreButton } from "@/components/ui/app-store-button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { closingCta } from "@/content/landing";

export function ClosingCta() {
  // "ber-gangsa" stays whole: browsers will otherwise break it at the hyphen.
  const [lead, word] = closingCta.title.split(" ");
  return (
    <Section id="download" className="relative overflow-hidden">
      {/* The turning nawa sanga rose from the app's splash, kept inside the
          section on both axes because it turns: nothing may clip it. */}
      <div className="pointer-events-none absolute inset-3 flex items-center justify-center">
        <Image
          src="/art/nawasanga.svg"
          alt=""
          width={540}
          height={538}
          className="rose-turn size-[34rem] max-h-full max-w-full object-contain opacity-40"
        />
      </div>
      <Container className="relative">
        <Reveal stagger className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 lang="ban" className="text-closing leading-[0.9] md:text-[9rem]">
            {lead} <span className="whitespace-nowrap">{word}</span>
          </h2>
          <p className="text-lg">{closingCta.description}</p>
          <AppStoreButton variant="primary" className="mt-2" />
        </Reveal>
      </Container>
    </Section>
  );
}
