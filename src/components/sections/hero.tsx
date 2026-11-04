/* eslint-disable @next/next/no-img-element -- decorative SVGs */
import { Interlock } from "@/components/interlock/interlock";
import { AppStoreButton } from "@/components/ui/app-store-button";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { hero } from "@/content/landing";

/**
 * One side of the app's landing screen. The gate is drawn far larger than what
 * shows: only its inner edge reaches in, so it frames the page rather than
 * filling it. The penjor arches in from behind it, its sampian hanging free.
 */
function GateSide({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  const mirror = left ? "-scale-x-100" : "";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 hidden w-64 sm:block lg:w-[22rem] ${left ? "left-0" : "right-0"}`}
    >
      <img
        src="/art/janur-pole.svg"
        alt=""
        className={`absolute top-2 hidden h-[23rem] w-auto min-[90rem]:block ${mirror} ${left ? "left-[8.5rem]" : "right-[8.5rem]"}`}
      />
      <img
        src="/art/janur-hang.svg"
        alt=""
        className={`absolute top-[3.25rem] hidden h-52 w-auto min-[90rem]:block ${left ? "left-[13.5rem]" : "right-[13.5rem]"}`}
      />
      <img
        src="/art/pura-gate.svg"
        alt=""
        className={`absolute top-0 h-[max(100%,44rem)] w-auto max-w-none ${mirror} ${left ? "-translate-x-[76%] lg:-translate-x-[64%]" : "right-0 translate-x-[76%] lg:translate-x-[64%]"}`}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden">
      <GateSide side="left" />
      <GateSide side="right" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-12 pb-8 sm:px-36 md:pt-14 lg:px-6 [@media(max-height:800px)]:pt-8 [@media(max-height:800px)]:pb-5">
        <Reveal
          stagger
          className="flex max-w-[56rem] flex-col items-center gap-5 text-center"
        >
          <h1 className="text-[4.25rem] leading-[0.84] text-balance sm:text-7xl md:text-[5.5rem] lg:text-[6.25rem]">
            {hero.title}
          </h1>
          <p className="max-w-xl text-lg leading-snug text-pretty text-body sm:text-[1.3125rem]">
            {hero.description}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <ButtonLink href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </ButtonLink>
            <AppStoreButton size="large" />
          </div>
        </Reveal>
      </div>

      <Interlock />
    </section>
  );
}
