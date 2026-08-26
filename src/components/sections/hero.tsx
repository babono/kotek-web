import { AppStoreButton } from "@/components/ui/app-store-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HitDetectionShowcase } from "@/components/ui/hit-detection-showcase";
import { Reveal } from "@/components/ui/reveal";
import { hero } from "@/content/landing";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* soft brass wash behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(185,149,38,0.16),transparent_70%)]"
      />

      <Container className="relative">
        <Reveal
          stagger
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
        >
          <h1 className="text-4xl font-bold text-balance sm:text-5xl md:text-6xl md:leading-[1.05]">
            {hero.title}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-pretty">
            {hero.description}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <AppStoreButton />
            <ButtonLink href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal
          delay={320}
          className="relative mx-auto mt-14 max-w-5xl md:mt-20"
        >
          <figure>
            <div className="overflow-hidden rounded-lg shadow-[0_40px_90px_-40px_rgba(46,33,25,0.55)] ring-1 ring-border">
              <div className="relative aspect-video overflow-hidden">
                <video
                  src={hero.demoVideoUrl}
                  autoPlay
                  loop
                  muted
                  // iOS Safari refuses inline autoplay without this and
                  // takes the video fullscreen instead.
                  playsInline
                  disablePictureInPicture
                  preload="metadata"
                  className="aspect-video w-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm text-subtle-foreground">
              {hero.demoCaption}
            </figcaption>
          </figure>

          {/* Hit Detection Dual-Engine Showcase */}
          <HitDetectionShowcase />
        </Reveal>
      </Container>
    </section>
  );
}
