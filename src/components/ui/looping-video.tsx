"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Silent footage that plays only while it can be seen, and not at all under
 * Reduce Motion. Nothing downloads until it is close to the viewport.
 *
 * The poster is a real image under the video rather than the `poster`
 * attribute, which is one more download with nothing to show until it lands,
 * and left the phone frame blank on a slow connection. A blurred thumbnail
 * built into the page shows at once, the sharp poster follows, and the video
 * only fades in once frames are actually playing.
 */
export function LoopingVideo({
  src,
  poster,
  label,
  sizes = "(min-width: 1024px) 38rem, 100vw",
  className,
}: {
  src: string;
  poster: StaticImageData;
  label: string;
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (Low Power Mode); the poster stays.
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        placeholder="blur"
        className="object-cover"
      />
      <video
        ref={ref}
        src={src}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setPlaying(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-300",
          playing ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
