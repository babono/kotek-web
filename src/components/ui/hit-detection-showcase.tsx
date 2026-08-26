"use client";

import { useEffect, useState } from "react";
import { hitDetection } from "@/content/landing";
import { cn } from "@/lib/utils";

export function HitDetectionShowcase() {
  const [activeKey, setActiveKey] = useState(2); // Key index 2 = Bilah 3 (Deng)
  const [isStriking, setIsStriking] = useState(false);

  // Automatic rhythmic strike simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsStriking(true);
      setTimeout(() => setIsStriking(false), 380);
    }, 1900);

    return () => clearInterval(interval);
  }, []);

  const keys = [
    { num: 1, name: "Ding", freq: "220 Hz", x: 120, y: 92 },
    { num: 2, name: "Dong", freq: "260 Hz", x: 152, y: 92 },
    { num: 3, name: "Deng", freq: "330 Hz", x: 184, y: 92 },
    { num: 4, name: "Dung", freq: "390 Hz", x: 216, y: 92 },
    { num: 5, name: "Dang", freq: "440 Hz", x: 248, y: 92 },
  ];

  const spectrumBars = [
    { h: "28%", activeH: "45%", color: "bg-app-polos" },
    { h: "42%", activeH: "68%", color: "bg-app-polos" },
    { h: "35%", activeH: "55%", color: "bg-app-polos" },
    { h: "58%", activeH: "82%", color: "bg-app-brass" },
    { h: "82%", activeH: "100%", color: "bg-app-brass" }, // Peak at Deng (330Hz)
    { h: "70%", activeH: "92%", color: "bg-app-brass" },
    { h: "48%", activeH: "72%", color: "bg-app-sangsih" },
    { h: "38%", activeH: "58%", color: "bg-app-sangsih" },
    { h: "28%", activeH: "46%", color: "bg-app-sangsih" },
    { h: "22%", activeH: "36%", color: "bg-app-cream/40" },
    { h: "18%", activeH: "28%", color: "bg-app-cream/30" },
    { h: "14%", activeH: "22%", color: "bg-app-cream/20" },
  ];

  const handleKeySelect = (idx: number) => {
    setActiveKey(idx);
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 380);
  };

  return (
    <div className="mx-auto mt-6 flex flex-col gap-6 rounded-card border border-border bg-card p-6 shadow-xs sm:p-8 md:p-10">
      {/* Header section matching feature cards */}
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-accent uppercase">
            {hitDetection.eyebrow}
          </span>
          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {hitDetection.title}
          </h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {hitDetection.description}
        </p>
      </div>

      {/* Dual Mockup Panels Grid in App Brand Guideline */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. Vision AI Panel */}
        <div
          role="img"
          aria-label="Vision AI key tracking mockup"
          className="flex flex-col justify-between overflow-hidden rounded-2xl bg-app-bg p-5 shadow-[0_20px_50px_-24px_rgba(46,33,25,0.6)] ring-1 ring-app-brass/20"
        >
          {/* In-app Header */}
          <div className="flex items-center justify-between">
            <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-app-tan/60 uppercase">
              Vision AI
            </p>
            <p className="text-[0.65rem] text-app-brass">Camera Feed · 60 fps</p>
          </div>

          {/* Inner Camera Screen */}
          <div className="relative my-4 flex h-40 flex-col justify-between overflow-hidden rounded-xl border border-app-brass/20 bg-app-panel p-3.5">
            {/* Camera Viewfinder Overlay */}
            <div className="flex items-center justify-between text-[0.6rem] font-mono text-app-tan/60">
              <span className="text-app-brass font-semibold">
                [CAM_01: BILAH_{keys[activeKey].num}]
              </span>
              <span className="text-app-polos">CONF: 99.4%</span>
            </div>

            {/* Scanning Laser Beam */}
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-linear-to-b from-transparent via-app-brass to-transparent opacity-80 animate-[scan_2.4s_ease-in-out_infinite]" />

            {/* 5 Gangsa Bronze Keys */}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {keys.map((k, idx) => {
                const isTarget = idx === activeKey;
                return (
                  <button
                    key={k.num}
                    type="button"
                    onClick={() => handleKeySelect(idx)}
                    className={cn(
                      "group relative flex flex-col items-center justify-between rounded-sm border transition-all duration-200 cursor-pointer",
                      idx === 0 ? "h-22 w-11" : "",
                      idx === 1 ? "h-20 w-11" : "",
                      idx === 2 ? "h-18 w-11" : "",
                      idx === 3 ? "h-16 w-11" : "",
                      idx === 4 ? "h-14 w-11" : "",
                      isTarget
                        ? "border-app-brass bg-linear-to-b from-app-cream via-app-brass to-app-bg shadow-[0_0_15px_rgba(201,160,99,0.5)] scale-105"
                        : "border-app-brass/30 bg-app-bar opacity-75 hover:opacity-100 hover:border-app-brass/60",
                    )}
                    aria-label={`Select Bilah ${k.num} ${k.name}`}
                  >
                    {/* Key number */}
                    <span
                      className={cn(
                        "mt-1 text-[10px] font-bold",
                        isTarget ? "text-app-panel font-black" : "text-app-cream/80",
                      )}
                    >
                      {k.num}
                    </span>

                    {/* Mallet Strike Target Box */}
                    {isTarget && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div
                          className={cn(
                            "size-6 rounded-xs border border-app-cream transition-all duration-150",
                            isStriking
                              ? "scale-115 bg-app-cream/40 shadow-[0_0_12px_#f6e3ac]"
                              : "scale-100 bg-app-cream/15",
                          )}
                        >
                          <span className="absolute -top-1 -left-1 text-[8px] text-app-cream">⌜</span>
                          <span className="absolute -top-1 -right-1 text-[8px] text-app-cream">⌝</span>
                          <span className="absolute -bottom-1 -left-1 text-[8px] text-app-cream">⌞</span>
                          <span className="absolute -bottom-1 -right-1 text-[8px] text-app-cream">⌟</span>
                        </div>
                      </div>
                    )}

                    {/* Key Pitch Name */}
                    <span
                      className={cn(
                        "mb-1 font-serif text-[10px]",
                        isTarget ? "text-app-panel font-bold" : "text-app-tan/70",
                      )}
                    >
                      {k.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom HUD Coordinates */}
            <div className="flex items-center justify-between text-[0.6rem] font-mono text-app-tan/50">
              <span>COORD: X={keys[activeKey].x} Y={keys[activeKey].y}</span>
              <span
                className={cn(
                  "font-semibold transition-colors",
                  isStriking ? "text-app-cream" : "text-app-tan/50",
                )}
              >
                {isStriking ? "HIT DETECTED" : "SPATIAL TRACKING"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-2">
            <h4 className="font-serif text-lg text-app-cream">
              {hitDetection.engines[0].title}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-app-tan/70">
              {hitDetection.engines[0].description}
            </p>
          </div>
        </div>

        {/* 2. Audio Analyzer Panel */}
        <div
          role="img"
          aria-label="Audio spectrum analyzer mockup"
          className="flex flex-col justify-between overflow-hidden rounded-2xl bg-app-bg p-5 shadow-[0_20px_50px_-24px_rgba(46,33,25,0.6)] ring-1 ring-app-brass/20"
        >
          {/* In-app Header */}
          <div className="flex items-center justify-between">
            <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-app-tan/60 uppercase">
              Audio Analyzer
            </p>
            <p className="text-[0.65rem] text-app-brass">Acoustic Onset · &lt;6ms</p>
          </div>

          {/* Inner Spectrum Screen */}
          <div className="relative my-4 flex h-40 flex-col justify-between overflow-hidden rounded-xl border border-app-brass/20 bg-app-panel p-3.5">
            {/* Top HUD */}
            <div className="flex items-center justify-between text-[0.6rem] font-mono text-app-tan/60">
              <span className="text-app-brass font-semibold">
                VOICE SPECTRUM: BRONZE_TIMBRE
              </span>
              <span
                className={cn(
                  "font-semibold transition-colors",
                  isStriking ? "text-app-cream" : "text-app-tan/50",
                )}
              >
                {isStriking ? "ATTACK: ONSET TRIGGER" : "LISTENING"}
              </span>
            </div>

            {/* Equalizer Spectrum Bars */}
            <div className="relative flex h-20 items-end justify-between gap-1.5 px-1">
              {spectrumBars.map((bar, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center justify-end h-full"
                >
                  <div
                    className={cn(
                      "w-full rounded-t-[3px] transition-all duration-150",
                      bar.color,
                      isStriking ? "opacity-100 shadow-[0_0_8px_rgba(201,160,99,0.3)]" : "opacity-60",
                    )}
                    style={{
                      height: isStriking ? bar.activeH : bar.h,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Frequency Axis with Active Key Readout */}
            <div className="flex justify-between border-t border-app-brass/15 pt-1 text-[0.6rem] font-mono text-app-tan/50">
              <span>110Hz</span>
              <span className="font-semibold text-app-brass">
                {keys[activeKey].freq} (Bilah {keys[activeKey].num} · {keys[activeKey].name})
              </span>
              <span>880Hz</span>
              <span>2.4kHz</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-2">
            <h4 className="font-serif text-lg text-app-cream">
              {hitDetection.engines[1].title}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-app-tan/70">
              {hitDetection.engines[1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Sensor Fusion In-App Bottom Strip */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-app-brass/30 bg-app-bg p-4 shadow-[0_10px_30px_-15px_rgba(46,33,25,0.5)] ring-1 ring-app-brass/20 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-app-brass text-xs font-bold text-app-bar">
            ⚡
          </span>
          <span className="font-serif text-base font-bold text-app-cream">
            {hitDetection.fusion.badge}
          </span>
        </div>
        <p className="text-xs text-app-tan/80 text-center sm:text-right max-w-lg leading-relaxed">
          {hitDetection.fusion.description}
        </p>
      </div>
    </div>
  );
}
