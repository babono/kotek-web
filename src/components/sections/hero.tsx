import { PlayIcon } from "@/components/icons/play";
import { AppStoreButton } from "@/components/ui/app-store-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { OverlayMockup } from "@/components/mockups/overlay-mockup";
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
          {/* <figure>
            <div className="overflow-hidden rounded-3xl shadow-[0_40px_90px_-40px_rgba(46,33,25,0.55)] ring-1 ring-border">
              <div className="relative aspect-video overflow-hidden">
                <OverlayMockup />
                <button
                  type="button"
                  aria-label="Play the demo video"
                  className="group absolute inset-0 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-inverse-foreground/95 text-foreground shadow-lg transition-transform group-hover:scale-105 md:size-20">
                    <PlayIcon className="ml-1 size-7 md:size-8" />
                  </span>
                </button>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm text-subtle-foreground">
              {hero.demoCaption}
            </figcaption>
          </figure> */}
          <figure>
            <div className="overflow-hidden rounded-3xl shadow-[0_40px_90px_-40px_rgba(46,33,25,0.55)] ring-1 ring-border">
              <div className="relative aspect-video overflow-hidden">
                <video
                  src={hero.demoVideoUrl}
                  autoPlay
                  autoFocus
                  loop
                  muted
                  disablePictureInPicture
                  preload="metadata"
                  className="w-full aspect-video object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm text-subtle-foreground">
              {hero.demoCaption}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
