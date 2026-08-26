"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Base rotation speed in degrees per second (~24 seconds for one full 360° turn). */
const BASE_SPEED = 15;
/** Friction coefficient for spinning down the boost. */
const FRICTION = 1.6;
/** Minimum upward scroll speed (px/ms) required to trigger the fast-spin boost. */
const SCROLL_VELOCITY_THRESHOLD = 0.35;
/** Boost multiplier for converting scroll velocity to angular velocity (deg/s). */
const BOOST_MULTIPLIER = 550;
/** Maximum angular boost velocity (deg/s) — ~6.5 rotations per second. */
const MAX_BOOST = 2400;

export function NavLogo() {
  const logoRef = useRef<HTMLImageElement>(null);
  const angleRef = useRef(0);
  const boostRef = useRef(0);

  useEffect(() => {
    // Respect reduced motion settings
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let lastFrameTime = performance.now();
    let frameId: number;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    function handleScroll() {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = now - lastScrollTime;
      const dy = lastScrollY - currentScrollY; // Positive when scrolling UP toward top

      if (dt > 0 && dy > 0) {
        const velocity = dy / dt; // in px/ms
        if (velocity > SCROLL_VELOCITY_THRESHOLD) {
          // Fast upward scroll detected! Inject rotational momentum
          const addedBoost = Math.min(MAX_BOOST, velocity * BOOST_MULTIPLIER);
          boostRef.current = Math.min(MAX_BOOST, boostRef.current + addedBoost);
        }
      }

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    }

    function tick(now: number) {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1); // in seconds, capped at 100ms
      lastFrameTime = now;

      // Decay the boost with friction
      if (boostRef.current > 0.1) {
        boostRef.current *= Math.exp(-FRICTION * dt);
      } else {
        boostRef.current = 0;
      }

      // Increment rotation angle
      angleRef.current = (angleRef.current + (BASE_SPEED + boostRef.current) * dt) % 360;

      if (logoRef.current) {
        logoRef.current.style.transform = `rotate(${angleRef.current.toFixed(2)}deg)`;
      }

      frameId = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    frameId = requestAnimationFrame(tick);

    // Pause animation loop when tab is hidden to save power
    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        lastFrameTime = performance.now();
        frameId = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="relative size-9 shrink-0 flex items-center justify-center">
      <Image
        ref={logoRef}
        src="/logo-kotek.png"
        alt=""
        width={36}
        height={36}
        className="size-9 will-change-transform select-none pointer-events-none"
        priority
      />
    </div>
  );
}
