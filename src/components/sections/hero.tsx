/* eslint-disable @next/next/no-img-element -- decorative SVGs */
import { Gangsa } from "@/components/interlock/gangsa";
import { KotekanGuide } from "@/components/interlock/kotekan-guide";
import { AppStoreButton } from "@/components/ui/app-store-button";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { hero } from "@/content/landing";

/**
 * One side of the app's landing screen. The gate is drawn far larger than what
 * shows: only its inner edge reaches in, so it frames the page rather than
 * filling it.
 *
 * Behind it the penjor stands the full height of the hero, its foot behind the
 * post. The proportions are `Penjor.swift`'s, in the art's own units: the pole
 * is 202 x 536 with its centre 143 in from the edge, and the 113 wide sampian
 * hangs from under the arch, 171 in and 19 below the pole's top.
 */
function GateSide({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 hidden aspect-[202/536] lg:block ${left ? "left-0 translate-x-[20.8%] -scale-x-100" : "right-0 -translate-x-[20.8%]"}`}
      >
        <img
          src="/art/janur-hang.svg"
          alt=""
          className={`penjor-hang absolute top-[3.55%] w-[55.9%] ${left ? "[--swing-period:3.4s]" : "[--swing-period:3.9s]"}`}
          style={{ right: "36%" }}
        />
        <img src="/art/janur-pole.svg" alt="" className="absolute inset-0 h-full w-full" />
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 hidden w-64 sm:block lg:w-[22rem] ${left ? "left-0" : "right-0"}`}
      >
        <img
          src="/art/pura-gate.svg"
          alt=""
          className={`absolute top-0 h-[max(100%,44rem)] w-auto max-w-none ${left ? "-translate-x-[76%] -scale-x-100 lg:-translate-x-[64%]" : "right-0 translate-x-[76%] lg:translate-x-[64%]"}`}
        />
      </div>
    </>
  );
}

export function Hero() {
  // Clipped, not hidden: a hidden overflow still scrolls when something inside
  // is scrolled into view, which slid the hero sideways under its gates.
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-clip">
      <GateSide side="left" />
      <GateSide side="right" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-12 pb-8 sm:px-36 md:pt-14 lg:px-6 [@media(max-height:800px)]:pt-6 [@media(max-height:800px)]:pb-3">
        <Reveal
          stagger
          className="flex max-w-[56rem] flex-col items-center gap-5 text-center"
        >
          <h1 className="text-hero leading-[0.88] text-balance sm:text-[4rem] md:text-[5.5rem] lg:text-[6.25rem] [@media(max-height:800px)]:lg:text-[5rem]">
            {/* `rest` carries its own punctuation and space after the word. */}
            <KotekanGuide word={hero.title.word} />
            {hero.title.rest}
          </h1>
          <p className="max-w-xl text-lg leading-snug text-pretty text-body sm:text-[1.3125rem]">
            {hero.description}
          </p>
          <div className="mt-2 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
            <ButtonLink href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </ButtonLink>
            <AppStoreButton size="large" />
          </div>
        </Reveal>
      </div>

      <Gangsa />
    </section>
  );
}
