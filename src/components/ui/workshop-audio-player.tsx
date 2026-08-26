"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface WorkshopAudioPlayerProps {
  src: string;
  title?: string;
  description?: string;
  className?: string;
}

export function WorkshopAudioPlayer({
  src,
  title = "Workshop session recording",
  description = "Live gangsa audio from our workshop at Mekar Bhuana",
  className,
}: WorkshopAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Attempt autoplay immediately
    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser prevented autoplay without interaction
          setIsPlaying(false);
        });
    };

    tryPlay();
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3.5 rounded-xl border border-border/80 bg-card/90 px-4 py-3 backdrop-blur-xs transition-all duration-300 sm:px-5 sm:py-3.5",
        isPlaying ? "border-brand-brass/40 shadow-xs" : "",
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        loop
        autoPlay
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex min-w-0 items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer",
            isPlaying
              ? "bg-foreground text-card hover:bg-foreground/90"
              : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs",
          )}
          aria-label={isPlaying ? "Pause workshop recording" : "Play workshop recording"}
        >
          {isPlaying ? (
            <svg
              viewBox="0 0 24 24"
              className="size-4.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 5.5A1.5 1.5 0 0 1 7.5 4h1A1.5 1.5 0 0 1 10 5.5v13A1.5 1.5 0 0 1 8.5 20h-1A1.5 1.5 0 0 1 6 18.5v-13Zm9.5-1.5A1.5 1.5 0 0 0 14 5.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 4h-1Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 size-4.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8.5 6.2a.9.9 0 0 1 1.37-.77l7.7 5.02a.9.9 0 0 1 0 1.51l-7.7 5.02a.9.9 0 0 1-1.37-.76V6.2Z" />
            </svg>
          )}
        </button>

        {/* Track Title and Description */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {title}
            </span>
            {isPlaying && (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-accent animate-[bounce_0.8s_infinite_100ms] h-full rounded-full" />
                <span className="w-0.5 bg-accent animate-[bounce_0.8s_infinite_300ms] h-2/3 rounded-full" />
                <span className="w-0.5 bg-accent animate-[bounce_0.8s_infinite_200ms] h-4/5 rounded-full" />
              </span>
            )}
          </div>
          <span className="truncate text-xs text-muted-foreground">
            {description}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
            isPlaying
              ? "bg-brand-sage/15 text-brand-sage"
              : "bg-border/60 text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              isPlaying ? "bg-brand-sage animate-pulse" : "bg-muted-foreground/60",
            )}
          />
          {isPlaying ? "Looping" : "Paused"}
        </span>
      </div>
    </div>
  );
}
