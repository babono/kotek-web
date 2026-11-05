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

/** Seconds per mallet stroke, and how a bilah behaves once struck: `GangsaTable`. */
const STROKE = 0.26;
const LOOK_BACK = 5;
/** Where in the phrase the gangsa rests under Reduce Motion. */
const STILL = STROKE * 20.4;
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

/** A cheap, well-mixed integer hash: the same stroke always lands the same. */
const hash = (x: number) => {
  let h = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
};

/**
 * Which bilah the mallet strikes on stroke `n`. It has nothing to do with the
 * sample: the gangsa plays itself forever, as on the app's landing screen.
 * Deliberately not random across all ten bilah, which looks like a fault:
 * as `GangsaTable` does, it picks within a window of four adjacent keys that
 * wanders along the instrument, so it looks like someone playing.
 */
const struckKey = (n: number) => {
  const start = hash(Math.floor(n / 16)) % (KEY_COUNT - 3);
  const offsets = n % 2 === 0 ? [0, 2] : [1, 3];
  return Math.min(KEY_COUNT - 1, start + offsets[hash(n + 977) % 2]);
};

const mix = (from: number[], to: number[], amount: number) =>
  `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * amount)).join(" ")})`;

/**
 * The app's "How kotekan works" guide, over the gangsa from its landing screen.
 * Three cards, each drawing the same short sample; hearing one rings its notes
 * in gold on the audio clock. The gangsa is apart from that: its one mallet
 * plays on by itself, whether or not anything is sounding.
 */
export function Interlock() {
  const [hearing, setHearing] = useState<InterlockCard | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const keys = useRef<(HTMLSpanElement | null)[]>([]);
  const mallet = useRef<HTMLImageElement>(null);
  /** When slot 0 of the sample lands, on the audio clock. */
  const origin = useRef(0);
  const sounding = useRef(false);
  const shownSlot = useRef<number | null>(null);

  const { silence, now: audioNow, start } = useInterlockAudio();

  /** Back to silence. Natural ends leave the last stroke ringing. */
  const finish = useCallback(() => {
    sounding.current = false;
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

    /** Follows the sample: only the gold ring is on the audio clock. */
    const followSample = () => {
      if (!sounding.current) return;
      const current = Math.floor(Math.max(0, audioNow() - origin.current) / SLOT);
      if (current >= SLOTS * ROUNDS) {
        finish();
      } else if (current % SLOTS !== shownSlot.current) {
        shownSlot.current = current % SLOTS;
        setSlot(shownSlot.current);
      }
    };

    /** The gangsa, a pure function of the clock, as `GangsaTable` draws it. */
    const drawGangsa = (t: number) => {
      const n = Math.floor(t / STROKE);

      keys.current.forEach((el, key) => {
        if (!el) return;
        let face = REST;
        let dip = 0;
        for (let back = 0; back <= LOOK_BACK; back++) {
          if (n < back || struckKey(n - back) !== key) continue;
          const age = t - (n - back) * STROKE;
          dip = DIP * Math.exp(-age / DIP_DECAY);
          face =
            back === 0
              ? mix(BILAH, STRUCK, Math.max(0, 1 - age / RING))
              : // Damped the moment the next stroke landed.
                mix(BILAH, DAMPED, Math.max(0, 1 - ((age - STROKE) / DAMP_FADE) ** 2));
          break;
        }
        el.style.backgroundColor = face;
        el.style.transform = `translateY(${dip * scale}px)`;
      });

      const head = mallet.current;
      if (head) {
        // Contact at each stroke, a quick rebound, the move to the next key in
        // the middle of the gap, and the fall onto it.
        const p = t / STROKE - n;
        const travel = Math.min(1, Math.max(0, (p - 0.15) / 0.6));
        const eased = travel * travel * (3 - 2 * travel);
        const from = keyCentre(struckKey(n));
        const x = from + (keyCentre(struckKey(n + 1)) - from) * eased;
        const angle = MALLET.lift * (1 - Math.max(Math.exp(-p / 0.08), p ** 6));
        head.style.transform =
          `translate(${(x - MALLET.strike.x) * scale}px, ${(KEYS.top - MALLET.strike.y) * scale}px) ` +
          `rotate(${angle.toFixed(2)}deg)`;
      }
    };

    const moving = () => !reduceMotion.matches;

    const loop = () => {
      followSample();
      if (moving()) drawGangsa(performance.now() / 1000);
      frame = sounding.current || moving() ? requestAnimationFrame(loop) : 0;
    };
    const run = () => {
      if (!frame && onScreen) frame = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Under Reduce Motion it stands still, mid-phrase.
    drawGangsa(STILL);
    run();

    const resize = new ResizeObserver(() => {
      scale = box.clientWidth / TABLE.width;
      drawGangsa(moving() ? performance.now() / 1000 : STILL);
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
    // `live` restarts the loop, which under Reduce Motion only runs to follow
    // the sample.
  }, [audioNow, finish, live, stop]);

  return (
    <div className="relative z-10 flex w-full flex-col items-center">
      <div className="flex w-full max-w-[64rem] flex-col gap-4 px-6 sm:px-36 lg:px-6">
        <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-between lg:gap-8">
          <div className="text-center lg:shrink-0 lg:text-left">
            <h2 className="text-[2.75rem] leading-none">{interlock.title}</h2>
            <p className="mt-1 text-[1.0625rem] text-pretty text-body">
              {interlock.definition}
            </p>
          </div>
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
