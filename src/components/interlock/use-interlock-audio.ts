"use client";

import { useCallback, useEffect, useRef } from "react";
import { figure, samples, type Voice } from "@/content/kotekan";

const SLOT = figure.strokeMs / 1000;
const SLOTS = figure.polos.length;
/** How far ahead strokes are queued. Timers jitter; the audio clock does not. */
const LOOKAHEAD = 0.2;
/** A beat of air before the first stroke, so it isn't clipped. */
const LEAD_IN = 0.12;
/** The left hand's pinch: how long a ringing bilah takes to stop. */
const DAMP = 0.09;
const COLOTOMIC_GAIN = { kajar: 0.22, gong: 0.3 };

type Sample = keyof typeof samples;

/**
 * Plays the figure on the Web Audio clock, the one thing in a browser steady
 * enough for an interlock: a `setInterval` queues strokes a little ahead, and
 * the audio thread lands them exactly. Each voice damps its last stroke as the
 * next one lands, as a player's left hand does.
 */
export function useInterlockAudio({
  voices,
  onSlot,
}: {
  /** Read as each stroke is queued, so a change lands on the next stroke. */
  voices: () => readonly Voice[];
  /** Told each slot as it is queued, for anything that follows the cycle. */
  onSlot?: (slot: number) => void;
}) {
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const buffers = useRef<Partial<Record<Sample, AudioBuffer>>>({});
  const timer = useRef<number | undefined>(undefined);
  const startedAt = useRef(0);

  const strike = useCallback(
    (name: Sample, when: number, level: number) => {
      const buffer = buffers.current[name];
      if (!ctx.current || !master.current || !buffer) return undefined;
      const source = ctx.current.createBufferSource();
      const gain = ctx.current.createGain();
      source.buffer = buffer;
      gain.gain.value = level;
      source.connect(gain).connect(master.current);
      source.start(when);
      return gain;
    },
    [],
  );

  const silence = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = undefined;
    const context = ctx.current;
    if (context && master.current) {
      // A quick fade, not a cut: stopping mid-ring would click.
      master.current.gain.setTargetAtTime(0, context.currentTime, 0.03);
      window.setTimeout(() => {
        if (timer.current === undefined) void context.suspend();
      }, 200);
    }
  }, []);

  /**
   * Must be called from the click itself: browsers only let a user gesture
   * start audio. Returns when the first stroke will land, on the clock that
   * `now` reads, so the visuals can follow it exactly.
   */
  const start = useCallback(async () => {
    const context = (ctx.current ??= new AudioContext());
    await context.resume();

    await Promise.all(
      (Object.entries(samples) as [string, string][]).map(async ([name, url]) => {
        const key = name as unknown as Sample;
        if (buffers.current[key]) return;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${url}: ${response.status}`);
        buffers.current[key] = await context.decodeAudioData(
          await response.arrayBuffer(),
        );
      }),
    );

    if (!master.current) {
      master.current = context.createGain();
      master.current.connect(context.destination);
    }
    master.current.gain.cancelScheduledValues(context.currentTime);
    master.current.gain.setValueAtTime(1, context.currentTime);

    const origin = context.currentTime + LEAD_IN;
    startedAt.current = origin;
    const ringing: Partial<Record<Voice, GainNode>> = {};
    let slot = 0;

    const queue = () => {
      while (origin + slot * SLOT < context.currentTime + LOOKAHEAD) {
        const when = origin + slot * SLOT;
        const step = slot % SLOTS;
        onSlot?.(slot);

        for (const voice of voices()) {
          const key = figure[voice][step];
          if (key === null) continue;
          const last = ringing[voice];
          if (last) {
            last.gain.setValueAtTime(last.gain.value, when);
            last.gain.linearRampToValueAtTime(0, when + DAMP);
          }
          ringing[voice] = strike(key as Sample, when, 0.8);
        }

        if (slot % 4 === 0) strike("kajar", when, COLOTOMIC_GAIN.kajar);
        if (slot % (SLOTS * 2) === 0) strike("gong", when, COLOTOMIC_GAIN.gong);
        slot += 1;
      }
    };

    window.clearInterval(timer.current);
    queue();
    timer.current = window.setInterval(queue, 25);
    return origin;
  }, [onSlot, strike, voices]);

  const now = useCallback(() => ctx.current?.currentTime ?? 0, []);

  useEffect(
    () => () => {
      window.clearInterval(timer.current);
      void ctx.current?.close();
    },
    [],
  );

  return { start, silence, now };
}
