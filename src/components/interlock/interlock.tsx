"use client";

/* eslint-disable @next/next/no-img-element -- plain SVGs moved every frame */
import { useCallback, useEffect, useRef, useState } from "react";
import { SampleRoll } from "@/components/interlock/sample-roll";
import { useInterlockAudio } from "@/components/interlock/use-interlock-audio";
import { KipliSays } from "@/components/kipli/kipli-says";
import { kotekanSample, type Voice } from "@/content/kotekan";
import { interlock, type InterlockCard } from "@/content/landing";

/**
 * `GangsaTable`'s geometry, in the artwork's own units, so the bilah and the
 * mallet land where the designer put them on the app's landing screen.
 */
const TABLE = { width: 474, height: 84 };
const KEYS = { left: 82.5, right: 391.5, gap: 4, top: 35.5, height: 31 };
const KEY_COUNT = kotekanSample.keyCount;
const KEY_WIDTH = (KEYS.right - KEYS.left - KEYS.gap * (KEY_COUNT - 1)) / KEY_COUNT;
const keyCentre = (key: number) =>
  KEYS.left + key * (KEY_WIDTH + KEYS.gap) + KEY_WIDTH / 2;

const MALLET = {
  width: 153,
  height: 114,
  /** Where the head meets the key: the art is drawn at contact. */
  strike: { x: 39.5, y: 65.5 },
  /** The end of the handle, which the swing turns about. */
  pivot: { x: 118 / 153, y: 108 / 114 },
  /** How far the swing lifts the head, in degrees. */
  lift: 16,
};

/** How a bilah behaves once struck, from `GangsaTable`. */
const RING = 0.85;
const DIP = 2;
const DIP_DECAY = 0.09;
const DAMP_FADE = 0.45;

const BILAH = [245, 179, 49];
const REST = `rgb(${BILAH.join(" ")})`;
const STRUCK = [255, 218, 141];
const DAMPED = [206, 134, 40];

const SLOT = kotekanSample.strokeMs / 1000;
const SLOTS = kotekanSample.polos.length;
/** The sample twice round, as the app's guide plays it. */
const ROUNDS = 2;

const voicesFor = (card: InterlockCard | null): readonly Voice[] =>
  card === null || card === "together" ? ["polos", "sangsih"] : [card];

const keyAt = (voices: readonly Voice[], slot: number) => {
  for (const voice of voices) {
    const key = kotekanSample[voice][slot % SLOTS];
    if (key !== null) return key;
  }
  return null;
};

const mix = (from: number[], to: number[], amount: number) =>
  `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * amount)).join(" ")})`;

/**
 * The app's "How kotekan works" guide, over the gangsa from its landing screen.
 * Three cards, each drawing the same short sample; hearing one plays it on the
 * gangsa below, with the card's gold ring, the bilah and the one mallet all on
 * the audio clock. Left alone, the gangsa plays the whole line silently.
 */
export function Interlock() {
  const [hearing, setHearing] = useState<InterlockCard | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const keys = useRef<(HTMLSpanElement | null)[]>([]);
  const mallet = useRef<HTMLImageElement>(null);
  const voices = useRef(voicesFor(null));
  /** When slot 0 lands, on whichever clock is driving the frame. */
  const origin = useRef(0);
  const sounding = useRef(false);
  const shownSlot = useRef<number | null>(null);

  const { silence, now: audioNow, start } = useInterlockAudio();

  const clock = useCallback(
    () => (sounding.current ? audioNow() : performance.now() / 1000),
    [audioNow],
  );

  /** Back to the silent gangsa. Natural ends leave the last stroke ringing. */
  const finish = useCallback(() => {
    sounding.current = false;
    voices.current = voicesFor(null);
    origin.current = performance.now() / 1000;
    shownSlot.current = null;
    setSlot(null);
    setLive(false);
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
    setHearing(card);
    try {
      const at = await start(voicesFor(card), ROUNDS);
      if (at === null) return;
      voices.current = voicesFor(card);
      origin.current = at;
      sounding.current = true;
      setLive(true);
    } catch {
      setFailed(true);
      finish();
    }
  }

  // Everything per-frame lives here, written straight to the DOM, so React
  // only re-renders when the sounding slot moves.
  useEffect(() => {
    const box = stage.current;
    const hero = box?.closest("section");
    if (!box || !hero) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let onScreen = true;
    let scale = box.clientWidth / TABLE.width;

    const draw = () => {
      const t = Math.max(0, clock() - origin.current);
      const playing = voices.current;

      if (sounding.current) {
        const current = Math.floor(t / SLOT);
        if (current >= SLOTS * ROUNDS) {
          finish();
          return;
        }
        if (current % SLOTS !== shownSlot.current) {
          shownSlot.current = current % SLOTS;
          setSlot(shownSlot.current);
        }
      }

      // The strokes around now, newest first: what the mallet and bilah follow.
      const recent: { slot: number; key: number }[] = [];
      for (let s = Math.floor(t / SLOT); s >= 0 && recent.length < 6; s--) {
        const key = keyAt(playing, s);
        if (key !== null) recent.push({ slot: s, key });
      }

      keys.current.forEach((el, index) => {
        if (!el) return;
        const at = recent.findIndex((stroke) => stroke.key === index);
        let face = REST;
        let dip = 0;
        if (at >= 0) {
          const age = t - recent[at].slot * SLOT;
          dip = DIP * Math.exp(-age / DIP_DECAY);
          if (at === 0) {
            face = mix(BILAH, STRUCK, Math.max(0, 1 - age / RING));
          } else {
            // Damped the moment the next stroke landed.
            const since = t - recent[at - 1].slot * SLOT;
            face = mix(BILAH, DAMPED, Math.max(0, 1 - (since / DAMP_FADE) ** 2));
          }
        }
        el.style.backgroundColor = face;
        el.style.transform = `translateY(${dip * scale}px)`;
      });

      const head = mallet.current;
      if (head) {
        // Contact at each stroke, a quick rebound, the move to the next key in
        // the middle of the gap, and the fall onto it.
        const from = recent[0] ?? { slot: 0, key: keyAt(playing, 0) ?? 5 };
        let to = from.slot + 1;
        let next = keyAt(playing, to);
        while (next === null) next = keyAt(playing, ++to);
        const p = Math.min(1, (t - from.slot * SLOT) / ((to - from.slot) * SLOT));
        const travel = Math.min(1, Math.max(0, (p - 0.15) / 0.6));
        const eased = travel * travel * (3 - 2 * travel);
        const x = keyCentre(from.key) + (keyCentre(next) - keyCentre(from.key)) * eased;
        const angle = MALLET.lift * (1 - Math.max(Math.exp(-p / 0.08), p ** 6));
        head.style.transform =
          `translate(${(x - MALLET.strike.x) * scale}px, ${(KEYS.top - MALLET.strike.y) * scale}px) ` +
          `rotate(${angle.toFixed(2)}deg)`;
      }
    };

    const loop = () => {
      draw();
      if (sounding.current || !reduceMotion.matches) {
        frame = requestAnimationFrame(loop);
      } else {
        frame = 0;
      }
    };
    const run = () => {
      if (!frame && onScreen) frame = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    if (!sounding.current) origin.current = performance.now() / 1000 - SLOT * 8;
    draw();
    run();

    const resize = new ResizeObserver(() => {
      scale = box.clientWidth / TABLE.width;
      draw();
    });
    resize.observe(box);

    // Stops drawing once the hero has gone, and stops playing: sound nobody can
    // see the source of, or find the stop button for, is not a demo any more.
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) {
        run();
      } else {
        pause();
        if (sounding.current) stop();
      }
    });
    seen.observe(hero);

    return () => {
      pause();
      resize.disconnect();
      seen.disconnect();
    };
    // `live` restarts the loop, which under Reduce Motion only runs while
    // sound is playing.
  }, [clock, finish, live, stop]);

  return (
    <div className="relative z-10 flex w-full flex-col items-center">
      <div className="flex w-full max-w-[64rem] flex-col gap-4 px-6 sm:px-36 lg:px-6">
        <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-between lg:gap-8">
          <h2 className="text-center text-[2.75rem] leading-none lg:shrink-0 lg:text-left">
            {interlock.title}
          </h2>
          <KipliSays live mood={failed ? "sad" : "happy"}>
            {failed ? interlock.failed : interlock.kipli}
          </KipliSays>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {interlock.cards.map((card) => {
            const on = hearing === card.id;
            return (
              <article
                key={card.id}
                className="grid grid-cols-[minmax(0,1fr)_9.5rem] items-center gap-x-3 rounded-[1.375rem] bg-krem py-3 pr-3 pl-5 lg:grid-cols-[minmax(0,1fr)_8.25rem]"
              >
                <div>
                  <h3 className="text-[2rem] leading-none">{card.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-muted-foreground">
                    {card.gloss}
                  </p>
                  <HearButton
                    on={on}
                    label={card.hear}
                    onClick={() => void hear(card.id)}
                  />
                </div>
                <SampleRoll voices={voicesFor(card.id)} slot={on ? slot : null} />
              </article>
            );
          })}
        </div>
      </div>

      <div
        ref={stage}
        className="relative mt-14 w-[max(100%,30rem)] max-w-[52rem] [@media(max-height:800px)]:mt-10"
        aria-hidden
      >
        <img src="/art/gangsa-table.svg" alt="" className="block w-full" />
        {Array.from({ length: KEY_COUNT }, (_, key) => (
          <span
            key={key}
            ref={(el) => {
              keys.current[key] = el;
            }}
            className="absolute rounded-[10%] bg-kuning"
            style={{
              left: `${((KEYS.left + key * (KEY_WIDTH + KEYS.gap)) / TABLE.width) * 100}%`,
              top: `${(KEYS.top / TABLE.height) * 100}%`,
              width: `${(KEY_WIDTH / TABLE.width) * 100}%`,
              height: `${(KEYS.height / TABLE.height) * 100}%`,
            }}
          />
        ))}
        <img
          ref={mallet}
          src="/art/mallet.svg"
          alt=""
          className="absolute top-0 left-0 max-w-none will-change-transform"
          style={{
            width: `${(MALLET.width / TABLE.width) * 100}%`,
            transformOrigin: `${MALLET.pivot.x * 100}% ${MALLET.pivot.y * 100}%`,
          }}
        />
      </div>
    </div>
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
      data-needs-js
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
