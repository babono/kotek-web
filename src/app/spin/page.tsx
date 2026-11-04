import type { Metadata } from "next";
import { PrizeWheel } from "@/components/wheel/prize-wheel";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { wheelCopy } from "@/content/wheel";

export const metadata: Metadata = {
  title: "Spin the wheel",
  description:
    "Give the Kotek prize wheel a spin for a sticker, a candy, or the rare keychain.",
};

export default function SpinPage() {
  return (
    // A fixed-height column: the heading and button take what they need and
    // the wheel expands into everything that is left.
    <section
      id="spin"
      className="flex h-[calc(100svh-4rem)] flex-col items-center justify-center py-5"
    >
      {/* Capped so the stack stays together on a tall display instead of
          stretching the wheel away from its button. */}
      <Container className="flex max-h-[52rem] min-h-0 w-full flex-1 flex-col items-center gap-4">
        <div className="flex shrink-0 flex-col items-center gap-1.5 text-center">
          <Eyebrow>{wheelCopy.eyebrow}</Eyebrow>
          <h1 className="text-5xl leading-[0.9] text-balance sm:text-6xl">
            {wheelCopy.title}
          </h1>
        </div>

        <PrizeWheel />
      </Container>
    </section>
  );
}
