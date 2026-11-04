"use client";

/* eslint-disable @next/next/no-img-element -- plain SVGs moved every frame */
import { useCallback, useEffect, useRef, useState } from "react";
import { useInterlockAudio } from "@/components/interlock/use-interlock-audio";
import { KipliSays } from "@/components/kipli/kipli-says";
import { buttonVariants } from "@/components/ui/button";
import { figure, type Voice } from "@/content/kotekan";
import { interlock, type InterlockMode } from "@/content/landing";
import { cn } from "@/lib/utils";

/** `gangsa-table.svg`'s own units, and the keys' place on it (`GangsaTable`). */
const TABLE = { width: 474, height: 84 };
const KEYS = { left: 82.5, right: 391.5, gap: 4, top: 35.5, height: 31 };
const KEY_WIDTH =
  (KEYS.right - KEYS.left - KEYS.gap * (figure.keyCount - 1)) / figure.keyCount;
const keyCentre = (key: number) =>
  KEYS.left + key * (KEY_WIDTH + KEYS.gap) + KEY_WIDTH / 2;

const SLOT = figure.strokeMs / 1000;
const SLOTS = figure.polos.length;
/** How long a note takes to fall. */
const FALL = 1.5;
/** Cycles of polos alone before the other half joins in. */
const SOLO_CYCLES = 2;
const STROKE_SECONDS = 0.14;

const VOICE_COLOUR: Record<Voice, string> = {
  polos: "#e14b2f",
  sangsih: "#2f4b82",
};
/** The mallet's size on the table, and where along it the head strikes. */
const MALLET = { width: 84, polosHead: 0.14, sangsihHead: 0.86, top: 0.3 };
const STEM = "#f7eddc";
const DAMP = "#e7dbc6";

const voicesFor = (mode: InterlockMode): readonly Voice[] =>
  mode === "both" ? ["polos", "sangsih"] : [mode];

type Status = "idle" | "loading" | "playing" | "failed";

/**
 * The hero's gangsa, the one from the app's landing screen. It plays itself
 * silently until someone asks to hear it, then starts on polos alone, and the
 * other half joins in: the headline, as sound.
 */
export function Interlock() {
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<InterlockMode>("both");
  const modeRef = useRef<InterlockMode>("both");
  const pinned = useRef(false);

  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const keys = useRef<(HTMLSpanElement | null)[]>([]);
  const mallets = useRef<Record<Voice, HTMLImageElement | null>>({
    polos: null,
    sangsih: null,
  });
  /** When slot 0 lands, on whichever clock is driving the frame. */
  const origin = useRef(0);
  const sounding = useRef(false);

  const changeMode = useCallback((next: InterlockMode) => {
    modeRef.current = next;
    setMode(next);
  }, []);

  const audio = useInterlockAudio({
    voices: useCallback(() => voicesFor(modeRef.current), []),
    onSlot: useCallback(
      (slot: number) => {
        if (slot === SOLO_CYCLES * SLOTS && !pinned.current) changeMode("both");
      },
      [changeMode],
    ),
  });
  const { silence, now: audioNow, start } = audio;

  const clock = useCallback(
    () => (sounding.current ? audioNow() : performance.now() / 1000),
    [audioNow],
  );

  const stop = useCallback(() => {
    silence();
    sounding.current = false;
    origin.current = performance.now() / 1000;
    changeMode("both");
    setStatus("idle");
  }, [changeMode, silence]);

  async function play(first: InterlockMode, pin: boolean) {
    pinned.current = pin;
    changeMode(first);
    setStatus("loading");
    try {
      origin.current = await start();
      sounding.current = true;
      setStatus("playing");
    } catch {
      setStatus("failed");
      changeMode("both");
    }
  }

  function chooseMode(next: InterlockMode) {
    if (status === "playing") {
      pinned.current = true;
      changeMode(next);
    } else if (status !== "loading") {
      void play(next, true);
    }
  }

  // Everything per-frame lives here, drawn straight to the canvas and the DOM,
  // so React only re-renders when the mode or status changes.
  useEffect(() => {
    const surface = canvas.current;
    const box = stage.current;
    const context = surface?.getContext("2d");
    if (!surface || !box || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let onScreen = true;
    let width = 0;
    let height = 0;
    let scale = 1;

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = surface.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      scale = width / TABLE.width;
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pill = (x: number, y: number, w: number, h: number, r: number) => {
      context.beginPath();
      context.roundRect(x - w / 2, y, w, h, r);
      context.fill();
    };

    const draw = () => {
      const t = clock() - origin.current;
      const active = voicesFor(modeRef.current);
      const keyW = KEY_WIDTH * scale;
      // The canvas ends where the bilah begin, so a note lands on its key.
      const hitY = height;
      const pxPerSecond = height / FALL;
      const strokeH = Math.max(5, 8 * scale);
      const dampH = Math.max(2, 2.5 * scale);
      const first = Math.floor(t / SLOT) - 3;
      const last = Math.ceil((t + FALL) / SLOT);
      const lit = new Set<number>();

      context.clearRect(0, 0, width, height);

      for (let n = Math.max(first, 0); n <= last; n++) {
        const step = n % SLOTS;
        for (const voice of active) {
          const key = figure[voice][step];
          if (key === null) continue;
          const due = n * SLOT;
          const age = t - due;
          if (age >= 0 && age < STROKE_SECONDS) lit.add(key);

          const y = hitY - (due - t) * pxPerSecond - strokeH;
          const x = keyCentre(key) * scale;
          // A stem as long as the note, capped by the damp block.
          const stem = SLOT * 0.9 * pxPerSecond;
          // The top of the fall fades in, rather than notes popping into being.
          context.globalAlpha = Math.max(0, Math.min(1, (y + stem) / (height * 0.25)));
          context.fillStyle = STEM;
          pill(x, y - stem, keyW * 0.7, stem + strokeH / 2, 3);
          context.fillStyle = DAMP;
          pill(x, y - stem, keyW * 0.7, dampH, 2);
          context.fillStyle = VOICE_COLOUR[voice];
          if (y < height) pill(x, Math.min(y, height - 1), keyW, strokeH, strokeH / 2.4);
        }
      }
      context.globalAlpha = 1;

      keys.current.forEach((el, key) => {
        if (el) el.dataset.lit = String(lit.has(key));
      });

      for (const voice of ["polos", "sangsih"] as const) {
        const mallet = mallets.current[voice];
        if (!mallet) continue;
        if (!active.includes(voice)) {
          mallet.style.opacity = "0";
          continue;
        }
        const strokes = figure[voice];
        const slot = Math.max(0, Math.floor(t / SLOT));
        let from = slot;
        while (from > 0 && strokes[from % SLOTS] === null) from -= 1;
        let to = from + 1;
        while (strokes[to % SLOTS] === null) to += 1;
        const span = (to - from) * SLOT;
        const progress = Math.min(1, Math.max(0, (t - from * SLOT) / span));
        const a = keyCentre(strokes[from % SLOTS] ?? 6);
        const b = keyCentre(strokes[to % SLOTS] ?? 6);
        const x = (a + (b - a) * progress) * scale;
        // Up after the strike, down onto the next one.
        const lift = Math.sin(progress * Math.PI) * 9 * scale;
        const grip = (voice === "polos" ? MALLET.polosHead : MALLET.sangsihHead) * MALLET.width * scale;
        mallet.style.opacity = "1";
        // The mirror lives here too: the CSS `scale` property would apply
        // before this transform and send the mallet the wrong way.
        const mirror = voice === "sangsih" ? " scaleX(-1)" : "";
        mallet.style.transform = `translate3d(${x - grip}px, ${-lift}px, 0)${mirror}`;
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

    measure();
    origin.current = performance.now() / 1000 - SLOT * 8;
    draw();
    run();

    const resize = new ResizeObserver(() => {
      measure();
      draw();
    });
    resize.observe(surface);

    // Stops drawing off-screen, and stops playing: sound nobody can see the
    // source of, or find the stop button for, is not a demo any more.
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) {
        run();
      } else {
        pause();
        if (sounding.current) stop();
      }
    });
    seen.observe(box);

    return () => {
      pause();
      resize.disconnect();
      seen.disconnect();
    };
    // `status` restarts the loop, which under Reduce Motion only runs while
    // sound is playing.
  }, [clock, status, stop]);

  const playing = status === "playing";
  const kipli =
    status === "failed"
      ? interlock.failed
      : playing
        ? interlock.modes.find((m) => m.id === mode)?.kipli
        : interlock.idle;

  return (
    <div className="relative z-10 flex w-full flex-col items-center gap-5">
      <div data-needs-js className="flex flex-col items-center gap-3 px-6 lg:flex-row lg:gap-5">
        <KipliSays live mood={status === "failed" ? "sad" : "happy"}>
          {kipli}
        </KipliSays>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (playing ? stop() : void play("polos", false))}
            disabled={status === "loading"}
            aria-label={playing ? "Stop the kotekan" : "Play the kotekan with sound"}
            className={cn(
              buttonVariants({ variant: "secondary", size: "regular" }),
              "size-11 cursor-pointer px-0 focus-visible:outline-offset-2",
            )}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="size-4 fill-ireng" aria-hidden>
                <rect x="3" y="3" width="10" height="10" rx="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="size-4 fill-ireng" aria-hidden>
                <path d="M4 2.6v10.8c0 .6.7 1 1.2.7l8.6-5.4c.5-.3.5-1 0-1.3L5.2 1.9C4.7 1.6 4 2 4 2.6Z" />
              </svg>
            )}
          </button>
          <div role="group" aria-label="Which half to hear" className="flex gap-1.5">
            {interlock.modes.map((option) => {
              const selected = playing && mode === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseMode(option.id)}
                  aria-pressed={selected}
                  className={cn(
                    buttonVariants({
                      variant: selected ? "selected" : "secondary",
                      size: "regular",
                    }),
                    "cursor-pointer px-4 text-[0.9375rem]",
                    selected && option.id === "polos" && "bg-merah",
                    selected && option.id === "sangsih" && "bg-sangsih",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        ref={stage}
        className="relative mt-20 w-[max(100%,30rem)] max-w-[52rem] sm:mt-24 [@media(max-height:800px)]:mt-14"
        aria-hidden
      >
        <div className="relative">
          <img src="/art/gangsa-table.svg" alt="" className="block w-full" />
          <canvas
            ref={canvas}
            className="absolute inset-x-0 block h-36 w-full sm:h-44 [@media(max-height:800px)]:h-28"
            style={{ bottom: `${(1 - KEYS.top / TABLE.height) * 100}%` }}
          />
          {Array.from({ length: figure.keyCount }, (_, key) => (
            <span
              key={key}
              ref={(el) => {
                keys.current[key] = el;
              }}
              className="absolute rounded-[10%] bg-kuning transition-[background-color,transform] duration-150 data-[lit=true]:translate-y-[3%] data-[lit=true]:bg-key-highlight data-[lit=true]:duration-0"
              style={{
                left: `${((KEYS.left + key * (KEY_WIDTH + KEYS.gap)) / TABLE.width) * 100}%`,
                top: `${(KEYS.top / TABLE.height) * 100}%`,
                width: `${(KEY_WIDTH / TABLE.width) * 100}%`,
                height: `${(KEYS.height / TABLE.height) * 100}%`,
              }}
            />
          ))}
          <img
            ref={(el) => {
              mallets.current.polos = el;
            }}
            src="/art/mallet.svg"
            alt=""
            className="absolute left-0 opacity-0 transition-opacity duration-300 will-change-transform"
            style={{
              top: `${MALLET.top * 100}%`,
              width: `${(MALLET.width / TABLE.width) * 100}%`,
            }}
          />
          <img
            ref={(el) => {
              mallets.current.sangsih = el;
            }}
            src="/art/mallet.svg"
            alt=""
            className="absolute left-0 opacity-0 transition-opacity duration-300 will-change-transform"
            style={{
              top: `${MALLET.top * 100}%`,
              width: `${(MALLET.width / TABLE.width) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
