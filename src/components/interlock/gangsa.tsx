"use client";

/* eslint-disable @next/next/no-img-element -- plain SVGs moved every frame */
import { useEffect, useRef } from "react";
import { kotekanSample } from "@/content/kotekan";

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
 * The gangsa from the app's landing screen, with its one mallet, playing on by
 * itself forever. It is only ever decoration, so nothing here makes a sound.
 */
export function Gangsa() {
  const stage = useRef<HTMLDivElement>(null);
  const keys = useRef<(HTMLSpanElement | null)[]>([]);
  const mallet = useRef<HTMLImageElement>(null);

  // Everything per-frame lives here, written straight to the DOM.
  useEffect(() => {
    const box = stage.current;
    const hero = box?.closest("section");
    if (!box || !hero) return;

    let frame = 0;
    let scale = box.clientWidth / TABLE.width;

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

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = () => {
      drawGangsa(performance.now() / 1000);
      frame = requestAnimationFrame(loop);
    };

    // Under Reduce Motion it stands still, mid-phrase.
    drawGangsa(STILL);

    const resize = new ResizeObserver(() => {
      scale = box.clientWidth / TABLE.width;
      drawGangsa(still ? STILL : performance.now() / 1000);
    });
    resize.observe(box);

    // No drawing once the hero has scrolled away.
    const seen = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (entry.isIntersecting && !still) frame = requestAnimationFrame(loop);
    });
    seen.observe(hero);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div
      ref={stage}
      className="relative z-10 mx-auto mt-14 w-[calc(100%-2.5rem)] max-w-[52rem] sm:w-full self-center [@media(max-height:800px)]:mt-10"
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
  );
}
