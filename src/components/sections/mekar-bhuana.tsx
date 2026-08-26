import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { WorkshopAudioPlayer } from "@/components/ui/workshop-audio-player";
import { mekarBhuana } from "@/content/landing";

function ExternalLinkIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function MekarBhuanaSection() {
  return (
    <Section id="mekar-bhuana" className="relative overflow-hidden bg-card/40">
      {/* Subtle warm decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-96 bg-[radial-gradient(50%_50%_at_50%_40%,rgba(185,149,38,0.12),transparent_70%)]"
      />

      <Container className="relative">
        {/* Section Header */}
        <Reveal
          stagger
          className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-border/80 bg-background/80 px-4 py-1.5 shadow-xs backdrop-blur-xs">
              <Image
                src="/mekar-bhuana/logo-mekarbhuana.svg"
                alt="Mekar Bhuana Logo"
                width={120}
                height={32}
                className="h-6 w-auto object-contain"
              />
              <span className="h-3 w-px bg-border" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {mekarBhuana.eyebrow}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              {mekarBhuana.title}
            </h2>
          </div>

          <p className="text-base text-muted-foreground text-pretty sm:text-lg">
            {mekarBhuana.description}
          </p>
        </Reveal>

        {/* Video & Audio Showcase */}
        <Reveal delay={150} className="mx-auto mt-12 max-w-4xl flex flex-col gap-4">
          <figure className="group relative overflow-hidden rounded-2xl border border-border bg-background p-2.5 shadow-[0_20px_60px_-25px_rgba(46,33,25,0.35)] transition-all duration-300 hover:shadow-[0_25px_70px_-20px_rgba(46,33,25,0.45)] sm:p-3.5">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-app-panel">
              <video
                src={mekarBhuana.video.src}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="metadata"
                className="size-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <figcaption className="mt-3 flex items-center justify-center gap-2 px-2 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm">
              <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
              <span>{mekarBhuana.video.caption}</span>
            </figcaption>
          </figure>

          {/* Workshop Audio Player */}
          <WorkshopAudioPlayer
            src={mekarBhuana.audio.src}
            title={mekarBhuana.audio.title}
            description={mekarBhuana.audio.description}
          />
        </Reveal>

        {/* Story & Heritage Cards */}
        <Reveal stagger delay={250} className="mt-14 grid gap-6 md:grid-cols-3">
          {mekarBhuana.pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group flex flex-col overflow-hidden rounded-card border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-brand-surface-strong">
                <Image
                  src={pillar.image}
                  alt={pillar.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>

        {/* CTA to Mekar Bhuana Website */}
        <Reveal
          delay={350}
          className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6"
        >
          <p className="text-sm text-muted-foreground">
            Explore their archives, recordings, and workshop offerings at{" "}
            <span className="font-medium text-foreground">
              {mekarBhuana.cta.domain}
            </span>
          </p>
          <ButtonLink
            href={mekarBhuana.cta.href}
            variant="outline"
            className="group gap-2 border-foreground/20 hover:border-foreground/50 hover:bg-card-strong"
          >
            <span>{mekarBhuana.cta.label}</span>
            <ExternalLinkIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
