"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TransitionEvent,
} from "react";
import type { Faq } from "@/content/faqs";
import { cn } from "@/lib/utils";

/**
 * A single-open accordion. It keeps native <details> semantics, so keyboard
 * and screen-reader behaviour stay intact and the answers are readable with
 * JS off, but takes over the click so the panel can be animated open and shut
 * instead of snapping.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      {faqs.map((faq, i) => (
        <FaqItem
          key={faq.question}
          faq={faq}
          expanded={i === openIndex}
          onToggle={() => setOpenIndex((current) => (current === i ? -1 : i))}
        />
      ))}
    </>
  );
}

function FaqItem({
  faq,
  expanded,
  onToggle,
}: {
  faq: Faq;
  expanded: boolean;
  onToggle: () => void;
}) {
  // `open` on the <details> and `expanded` are deliberately separate: the panel
  // has to stay mounted while it animates shut, and has to be mounted at zero
  // height for a frame before it can animate open.
  const [open, setOpen] = useState(expanded);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function handleClick(event: MouseEvent<HTMLElement>) {
    // Stop the browser from toggling `open` itself: we drive it.
    event.preventDefault();

    if (expanded) {
      onToggle();
      return;
    }

    setOpen(true);
    // Let the collapsed panel paint once, so the grid has a height to grow from.
    frame.current = requestAnimationFrame(onToggle);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName === "grid-template-rows" && !expanded) {
      setOpen(false);
    }
  }

  return (
    <details open={open} className="border-b border-border first:border-t">
      <summary
        onClick={handleClick}
        className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium text-foreground marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {faq.question}
        <span
          aria-hidden
          className={cn(
            "relative flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
            expanded ? "bg-primary" : "bg-card-strong",
          )}
        >
          <span className="absolute h-px w-3.5 bg-foreground" />
          <span
            className={cn(
              "absolute h-3.5 w-px bg-foreground transition-transform duration-300 ease-out",
              expanded ? "scale-y-0" : "scale-y-100",
            )}
          />
        </span>
      </summary>

      <div
        onTransitionEnd={handleTransitionEnd}
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        className="grid transition-[grid-template-rows] duration-[350ms] ease-out"
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "pr-14 pb-6 text-sm leading-relaxed text-muted-foreground transition-opacity duration-300 ease-out",
              expanded ? "opacity-100 delay-75" : "opacity-0",
            )}
          >
            {faq.answer}
          </p>
        </div>
      </div>
    </details>
  );
}
