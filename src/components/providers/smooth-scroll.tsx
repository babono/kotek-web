"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Damped ("heavier") scrolling. Each wheel tick sets a target and the page
 * eases toward it over the following frames instead of jumping, which is what
 * gives the weighted feel.
 *
 * `lerp` is the fraction of the remaining distance covered per frame, so a
 * smaller number means a longer, heavier glide.
 */
const LERP = 0.085;

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: LERP,
      // Lenis runs its own rAF loop, kept in sync with its internal clock.
      autoRaf: true,
      // Route in-page hash links through Lenis so they ease rather than jump.
      // Lenis honours each section’s scroll-margin-top, which clears the header.
      anchors: true,
      // Leave touch devices on native momentum — hijacking it feels worse.
      syncTouch: false,
      // Forces lerp to 1 (1:1 tracking) when the user asks for reduced motion.
      respectReducedMotion: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
