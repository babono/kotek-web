"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before this block animates in, in milliseconds. */
  delay?: number;
  /** Animate the direct children in sequence instead of the block as a whole. */
  stagger?: boolean;
  style?: CSSProperties;
};

/**
 * Fades and lifts its content into place the first time it scrolls into view.
 * Blocks already in the viewport on load animate immediately, so the hero
 * plays on arrival rather than waiting for a scroll.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
      className={`${stagger ? "reveal-stagger" : "reveal"} ${className}`}
    >
      {children}
    </div>
  );
}
