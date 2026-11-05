"use client";

import { useCallback, useEffect, useRef } from "react";
import { kotekanSample, samples, type Voice } from "@/content/kotekan";

const SLOT = kotekanSample.strokeMs / 1000;
const SLOTS = kotekanSample.polos.length;
/** How far ahead strokes are queued. Timers jitter; the audio clock does not. */
const LOOKAHEAD = 0.2;
/** A beat of air before the first stroke, so it isn't clipped. */
const LEAD_IN = 0.12;
/** The left hand's pinch: how long a ringing bilah takes to stop. */
const DAMP = 0.09;
/** As the app's guide plays them: a little apart, polos left, sangsih right. */
const VOICE = {
  polos: { pan: -0.3, level: 0.8 },
  sangsih: { pan: 0.3, level: 0.8 },
};
/** `SampleLibrary`: the strike starts here, relative to the sample's peak. */
const ONSET_THRESHOLD = 0.08;
/** `SampleLibrary`: pre-roll kept before the strike, and the ramp over it. */
const PRE_ROLL = 0.002;

type Key = keyof typeof samples;
type Sample = { buffer: AudioBuffer; onset: number };

/**
 * Where the strike is, in seconds. The recordings begin with up to 0.87s of
 * room tone, so playing one from its start puts the strike that far behind
 * the stroke, and the damp of the next stroke silences it before it arrives.
 * The app trims the same lead-in at load (`SampleLibrary.trimLeadingSilence`).
 */
function findOnset(buffer: AudioBuffer) {
  const data = buffer.getChannelData(0);
  let peak = 0;
  for (const value of data) peak = Math.max(peak, Math.abs(value));
  const threshold = peak * ONSET_THRESHOLD;
  const first = data.findIndex((value) => Math.abs(value) >= threshold);
  return Math.max(0, first / buffer.sampleRate - PRE_ROLL);
}

/**
 * Plays the sample on the Web Audio clock, the one thing in a browser steady
 * enough for an interlock: a `setInterval` queues strokes a little ahead, and
 * the audio thread lands them exactly. Each voice damps its last stroke as the
 * next one lands, as a player's left hand does.
 */
export function useInterlockAudio() {
  const ctx = useRef<AudioContext | null>(null);
  const output = useRef<AudioNode | null>(null);
  const run = useRef<GainNode | null>(null);
  const loaded = useRef<Partial<Record<Key, Sample>>>({});
  const timer = useRef<number | undefined>(undefined);
  const attempt = useRef(0);

  const stopQueue = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = undefined;
  }, []);

  /** Fades out whatever is ringing. A cut mid-ring would click. */
  const silence = useCallback(() => {
    attempt.current += 1;
    stopQueue();
    if (ctx.current && run.current) {
      run.current.gain.setTargetAtTime(0, ctx.current.currentTime, 0.03);
    }
    run.current = null;
  }, [stopQueue]);

  /**
   * Must be called from the click itself: browsers only let a user gesture
   * start audio. Resolves to when the first stroke will land, on the clock
   * that `now` reads, or to null if another `start` overtook this one.
   */
  const start = useCallback(
    async (voices: readonly Voice[], rounds: number) => {
      silence();
      const mine = attempt.current;
      const context = (ctx.current ??= new AudioContext());
      await context.resume();

      await Promise.all(
        (Object.entries(samples) as [string, string][]).map(async ([name, url]) => {
          const key = Number(name) as Key;
          if (loaded.current[key]) return;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`${url}: ${response.status}`);
          const buffer = await context.decodeAudioData(await response.arrayBuffer());
          loaded.current[key] = { buffer, onset: findOnset(buffer) };
        }),
      );
      if (mine !== attempt.current) return null;

      if (!output.current) {
        // The app's peak limiter, for the same reason: every sample peaks near
        // full scale, so two sounding at once would clip.
        const limiter = context.createDynamicsCompressor();
        limiter.threshold.value = -3;
        limiter.knee.value = 0;
        limiter.ratio.value = 20;
        limiter.attack.value = 0.002;
        limiter.release.value = 0.1;
        limiter.connect(context.destination);
        output.current = limiter;
      }
      const bus = context.createGain();
      bus.connect(output.current);
      run.current = bus;

      const strike = (key: Key, voice: Voice, when: number) => {
        const sample = loaded.current[key];
        if (!sample) return undefined;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const pan = context.createStereoPanner();
        source.buffer = sample.buffer;
        pan.pan.value = VOICE[voice].pan;
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(VOICE[voice].level, when + PRE_ROLL);
        source.connect(gain).connect(pan).connect(bus);
        source.start(when, sample.onset);
        return gain;
      };

      const origin = context.currentTime + LEAD_IN;
      const ringing: Partial<Record<Voice, GainNode>> = {};
      const total = SLOTS * rounds;
      let slot = 0;

      const queue = () => {
        while (slot < total && origin + slot * SLOT < context.currentTime + LOOKAHEAD) {
          const when = origin + slot * SLOT;
          for (const voice of voices) {
            const key = kotekanSample[voice][slot % SLOTS];
            if (key === null) continue;
            const last = ringing[voice];
            if (last) {
              last.gain.setValueAtTime(VOICE[voice].level, when);
              last.gain.linearRampToValueAtTime(0, when + DAMP);
            }
            ringing[voice] = strike(key, voice, when);
          }
          slot += 1;
        }
        // The last stroke is left to ring out, as the app's guide does.
        if (slot === total) stopQueue();
      };

      queue();
      timer.current = window.setInterval(queue, 25);
      return origin;
    },
    [silence, stopQueue],
  );

  const now = useCallback(() => ctx.current?.currentTime ?? 0, []);

  useEffect(
    () => () => {
      window.clearInterval(timer.current);
      void ctx.current?.close();
      // Forgotten, not just closed: a hot reload runs this and keeps the refs,
      // and a closed context never makes a sound again.
      ctx.current = null;
      output.current = null;
      run.current = null;
    },
    [],
  );

  return { start, silence, now };
}
