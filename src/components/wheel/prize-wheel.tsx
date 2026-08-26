"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WheelFace } from "@/components/wheel/wheel-face";
import { buttonVariants } from "@/components/ui/button";
import { wheelSlices, type WheelSlice } from "@/content/wheel";
import {
  buildWeights,
  pickWeightedIndex,
  readKeychainOverride,
} from "@/lib/wheel";
import { cn } from "@/lib/utils";

const SLICE_ANGLE = 360 / wheelSlices.length;

/** How long a full-power charge takes, and what it buys you. */
const CHARGE_MS = 1600;
const MIN_POWER = 0.05;
/*
 * Turns vary far more than duration, so power changes how fast the wheel
 * whips round rather than only how long it keeps going. Matching the two
 * ranges (as before) left the average speed identical at every power.
 */
const SPIN_MS = { min: 2200, max: 6500 };
const TURNS = { min: 0, max: 14 };
/** A softer curve for a weak flick, a snappier one at full power. */
const EASE_POWER = { min: 2.2, max: 3.8 };

/** Pointer spring: stiff enough to snap back between dividers. */
const STIFFNESS = 320;
const DAMPING = 13;
const MAX_DEFLECTION = 21;
/** How much of a wedge the divider stays in contact with the pointer for. */
const CONTACT = 0.28;

const easeOut = (t: number, exponent: number) => 1 - Math.pow(1 - t, exponent);

/**
 * Draws the prize and works out how far to turn to land on it. Lives outside
 * the component because it is deliberately impure.
 */
function planSpin(fromAngle: number, charge: number, weights: number[]) {
  const index = pickWeightedIndex(weights);
  const slice = wheelSlices[index];

  const centre = index * SLICE_ANGLE + SLICE_ANGLE / 2;
  const jitter = (Math.random() - 0.5) * SLICE_ANGLE * 0.55;
  const target = ((-(centre + jitter) % 360) + 360) % 360;
  const current = ((fromAngle % 360) + 360) % 360;

  let delta = target - current;
  if (delta <= 0) delta += 360;
  delta += 360 * Math.round(TURNS.min + charge * (TURNS.max - TURNS.min));

  return {
    slice,
    delta,
    duration: SPIN_MS.min + charge * (SPIN_MS.max - SPIN_MS.min),
    exponent: EASE_POWER.min + charge * (EASE_POWER.max - EASE_POWER.min),
  };
}

type Phase = "idle" | "charging" | "spinning";

function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

export function PrizeWheel() {
  // useSyncExternalStore rather than a hook that would make this route
  // dynamic; the server snapshot is empty so the default odds prerender.
  const search = useSyncExternalStore(
    subscribeToHistory,
    () => window.location.search,
    () => "",
  );
  const keychainOverride = readKeychainOverride(search);
  const weights = buildWeights(wheelSlices, keychainOverride);

  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<WheelSlice | null>(null);

  const wheelRef = useRef<SVGGElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Transient animation values: kept in refs so a 60fps spin never re-renders.
  const angle = useRef(0);
  const power = useRef(0);
  const frame = useRef(0);
  const pointerAngle = useRef(0);
  const pointerVel = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function setGauge(value: number) {
    if (gaugeRef.current) gaugeRef.current.style.width = `${value * 100}%`;
  }

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
  }

  function startCharging() {
    if (phase !== "idle") return;
    setPhase("charging");
    setResult(null);

    let startedAt = 0;
    const tick = (now: number) => {
      if (startedAt === 0) startedAt = now;
      power.current = Math.min(1, (now - startedAt) / CHARGE_MS);
      setGauge(power.current);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function release() {
    if (phase !== "charging") return;
    cancelAnimationFrame(frame.current);
    spin(Math.max(MIN_POWER, power.current));
  }

  function spin(charge: number) {
    // The prize is drawn by weight first; power only changes how long the
    // wheel takes to get there, never which wedge it lands on.
    const { slice, delta, duration, exponent } = planSpin(
      angle.current,
      charge,
      weights,
    );
    const from = angle.current;

    setPhase("spinning");

    if (prefersReducedMotion()) {
      angle.current = from + delta;
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${angle.current}deg)`;
      }
      finish(slice);
      return;
    }

    let startedAt = 0;
    let previous = 0;

    const tick = (now: number) => {
      if (startedAt === 0) {
        startedAt = now;
        previous = now;
      }
      const dt = Math.min((now - previous) / 1000, 1 / 30);
      previous = now;

      const t = Math.min(1, (now - startedAt) / duration);
      const nextAngle = from + delta * easeOut(t, exponent);
      angle.current = nextAngle;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${nextAngle}deg)`;
      }

      /*
       * The pointer rides over the dividers like a flapper over pegs. A
       * divider physically holds it aside while passing (`push`), and between
       * dividers a spring snaps it back — so it flutters when the wheel is
       * fast and ticks distinctly as it slows.
       */
      const frac = (((nextAngle / SLICE_ANGLE) % 1) + 1) % 1;
      const push = MAX_DEFLECTION * Math.max(0, 1 - frac / CONTACT);

      const acceleration =
        -STIFFNESS * pointerAngle.current - DAMPING * pointerVel.current;
      pointerVel.current += acceleration * dt;
      let next = pointerAngle.current + pointerVel.current * dt;

      if (next < push) {
        // Held aside by the divider; it cannot fall through it.
        next = push;
        pointerVel.current = 0;
      }

      pointerAngle.current = Math.max(-7, Math.min(MAX_DEFLECTION, next));
      if (pointerRef.current) {
        pointerRef.current.style.transform = `rotate(${pointerAngle.current}deg)`;
      }

      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }

      pointerAngle.current = 0;
      pointerVel.current = 0;
      if (pointerRef.current) pointerRef.current.style.transform = "rotate(0deg)";
      finish(slice);
    };

    frame.current = requestAnimationFrame(tick);
  }

  function finish(slice: WheelSlice) {
    power.current = 0;
    setGauge(0);
    setResult(slice);
    setPhase("idle");
    dialogRef.current?.showModal();
  }

  const busy = phase === "spinning";
  const label =
    phase === "spinning"
      ? "Spinning…"
      : phase === "charging"
        ? "Release to spin"
        : result
          ? "Hold to spin again"
          : "Hold to spin";

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-6">
      {/* Centres the wheel in whatever space is left once it hits its cap. */}
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <WheelFace wheelRef={wheelRef} pointerRef={pointerRef} />
      </div>

      {/* Power gauge */}
      <div className="flex w-full max-w-xs shrink-0 items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full border border-border bg-card">
          <div
            ref={gaugeRef}
            style={{ width: "0%" }}
            className="h-full rounded-full bg-primary transition-[background-color]"
          />
        </div>
        <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Power
        </span>
      </div>

      <button
        type="button"
        disabled={busy}
        onPointerDown={startCharging}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            if (!event.repeat) startCharging();
          }
        }}
        onKeyUp={(event) => {
          if (event.key === " " || event.key === "Enter") release();
        }}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "min-w-52 shrink-0 select-none disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {label}
      </button>

      <p className="shrink-0 text-center text-xs text-subtle-foreground">
        Hold the button to build power. The longer you hold, the longer it spins.
      </p>

      {keychainOverride === null ? null : (
        <p className="shrink-0 rounded-full bg-accent-muted/30 px-3 py-1 text-center text-[0.65rem] font-semibold tracking-wide text-accent uppercase">
          Demo mode · keychain {keychainOverride}%
        </p>
      )}

      {/* Native <dialog> so focus trapping and Esc come for free. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="prize-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="prize-dialog m-auto w-[min(22rem,calc(100vw-2rem))] overscroll-contain rounded-card border border-border bg-background p-8 text-center shadow-2xl backdrop:bg-foreground/60"
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          You won
        </p>
        <p id="prize-title" className="mt-2 font-display text-3xl text-foreground">
          {result?.label ?? ""}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Show this to someone at the booth to claim {result?.prize ?? "your prize"}.
        </p>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className={cn(buttonVariants({ variant: "primary" }), "mt-6 w-full")}
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
