"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { SampleRoll } from "@/components/interlock/sample-roll";
import { useInterlockAudio } from "@/components/interlock/use-interlock-audio";
import { KipliSays } from "@/components/kipli/kipli-says";
import { buttonVariants } from "@/components/ui/button";
import { kotekanSample, type Voice } from "@/content/kotekan";
import { interlock, type InterlockCard } from "@/content/landing";

const SLOT = kotekanSample.strokeMs / 1000;
const SLOTS = kotekanSample.polos.length;
/** The sample twice round, as the app's guide plays it. */
const ROUNDS = 2;

const voicesFor = (card: InterlockCard): readonly Voice[] =>
  card === "together" ? ["polos", "sangsih"] : [card];

/**
 * The underlined word in the headline, and the popup it opens: the app's
 * "How kotekan works" guide. Three cards draw the same short sample; hearing
 * one rings its notes in gold on the audio clock. Closing it stops the sound.
 */
export function KotekanGuide({ word }: { word: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const [hearing, setHearing] = useState<InterlockCard | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [origin, setOrigin] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const { silence, now, start } = useInterlockAudio();

  const finish = useCallback(() => {
    setOrigin(null);
    setSlot(null);
    setHearing(null);
  }, []);

  const stop = useCallback(() => {
    silence();
    finish();
  }, [finish, silence]);

  async function hear(card: InterlockCard) {
    if (hearing === card) {
      stop();
      return;
    }
    setFailed(false);
    setOrigin(null);
    setSlot(null);
    setHearing(card);
    try {
      const at = await start(voicesFor(card), ROUNDS);
      if (at !== null) setOrigin(at);
    } catch {
      setFailed(true);
      finish();
    }
  }

  // Walks the gold ring along the notes, on the audio's own clock.
  useEffect(() => {
    if (origin === null) return;
    let frame = 0;
    const follow = () => {
      const current = Math.floor(Math.max(0, now() - origin) / SLOT);
      if (current >= SLOTS * ROUNDS) {
        finish();
        return;
      }
      setSlot(current % SLOTS);
      frame = requestAnimationFrame(follow);
    };
    frame = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(frame);
  }, [finish, now, origin]);

  return (
    <>
      {/* Not hidden without JS: it is a word of the headline first. */}
      <button
        type="button"
        aria-haspopup="dialog"
        title={interlock.title}
        onClick={() => {
          flushSync(() => setOpened(true));
          dialog.current?.showModal();
        }}
        className="cursor-pointer rounded-sm underline decoration-kuning decoration-[0.07em] underline-offset-[0.14em] transition-colors hover:decoration-merah focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {word}
      </button>

      {/*
        Native <dialog> so focus trapping and Esc come for free. Portalled,
        and only once asked for: the word sits in the <h1>, and all this
        text must not read as part of the headline.
      */}
      {opened
        ? createPortal(
      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-labelledby="kotekan-guide-title"
        onClose={stop}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        className="pop-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] overscroll-contain rounded-[1.75rem] bg-surface p-5 text-body backdrop:bg-ireng/70 sm:p-7"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="kotekan-guide-title" className="text-[2.25rem] leading-none sm:text-[2.75rem]">
                {interlock.title}
              </h2>
              <p className="mt-1 text-[1.0625rem] text-pretty">{interlock.definition}</p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className={`${buttonVariants({ size: "regular" })} cursor-pointer`}
            >
              {interlock.close}
            </button>
          </div>

          <KipliSays live mood={failed ? "sad" : "happy"}>
            {failed ? interlock.failed : interlock.kipli}
          </KipliSays>

          <div className="grid gap-3 lg:grid-cols-3">
            {interlock.cards.map((card) => {
              const on = hearing === card.id;
              return (
                <article key={card.id} className="rounded-[1.375rem] bg-krem px-5 py-4 max-lg:grid max-lg:grid-cols-[minmax(0,1fr)_9.5rem] max-lg:items-center max-lg:gap-x-3 max-lg:pr-3">
                  <div>
                    <h3 className="text-[2rem] leading-none">{card.title}</h3>
                    <p className="mt-1 text-[0.9375rem] leading-snug text-muted-foreground">
                      {card.gloss}
                    </p>
                    <div className="hidden lg:my-3 lg:block">
                      <SampleRoll voices={voicesFor(card.id)} slot={on ? slot : null} />
                    </div>
                    <HearButton on={on} label={card.hear} onClick={() => void hear(card.id)} />
                  </div>
                  <div className="lg:hidden">
                    <SampleRoll voices={voicesFor(card.id)} slot={on ? slot : null} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </dialog>,
            document.body,
          )
        : null}
    </>
  );
}

function HearButton({
  on,
  label,
  onClick,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
            aria-pressed={on}
      onClick={onClick}
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg text-[1.0625rem] font-semibold whitespace-nowrap text-merah-tua focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path
          fill="currentColor"
          d="M11 4.7v14.6c0 .9-1 1.3-1.7.8L5 16.5H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2l4.3-3.6c.7-.5 1.7-.1 1.7.8Z"
        />
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path className={on ? "speaker-wave" : undefined} d="M14.5 9a4.2 4.2 0 0 1 0 6" />
          <path
            className={on ? "speaker-wave [animation-delay:160ms]" : undefined}
            d="M17.5 6.5a8 8 0 0 1 0 11"
          />
        </g>
      </svg>
      {on ? interlock.stop : label}
    </button>
  );
}
