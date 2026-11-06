"use client";

import { useEffect, useRef, useState } from "react";
import { SensorDiagram } from "@/components/sensors/sensor-diagram";
import { KipliSays } from "@/components/kipli/kipli-says";
import { buttonVariants } from "@/components/ui/button";
import { sensors } from "@/content/landing";

/** Each strike's story, and the bilah struck in turn. */
const STRIKE_MS = 3600;
const STEP_TIMES = [
  { at: "0s", for: "1.05s" },
  { at: "1.05s", for: "0.7s" },
  { at: "1.75s", for: "1.85s" },
];

/**
 * The button and popup behind Notice. The diagram only exists
 * while the popup is open, and remounts on every strike to replay its CSS.
 */
export function SensorExplainer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [strike, setStrike] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setStrike((s) => s + 1), STRIKE_MS);
    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <>
      <button
        type="button"
        data-needs-js
        onClick={() => {
          setStrike(0);
          setOpen(true);
          dialog.current?.showModal();
        }}
        className={`${buttonVariants({ variant: "secondary", size: "regular" })} mt-5 cursor-pointer`}
      >
        {sensors.cta}
      </button>

      {/* Native <dialog> so focus trapping and Esc come for free. */}
      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-labelledby="sensors-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        className="pop-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(52rem,calc(100vw-2rem))] overscroll-contain rounded-[1.75rem] bg-surface p-5 text-body backdrop:bg-ireng/70 sm:p-7"
      >
        {open ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h2 id="sensors-title" className="text-[2.25rem] leading-none sm:text-[2.75rem]">
                {sensors.title}
              </h2>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className={`${buttonVariants({ size: "regular" })} cursor-pointer`}
              >
                {sensors.close}
              </button>
            </div>

            <KipliSays>{sensors.kipli}</KipliSays>

            <div className="rounded-[1.375rem] bg-krem p-3 sm:p-4">
              <SensorDiagram key={strike} strike={strike} />
            </div>

            <ol key={strike} className="grid gap-3 sm:grid-cols-3">
              {sensors.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="sensor-step"
                  style={
                    {
                      "--step-at": STEP_TIMES[i].at,
                      "--step-for": STEP_TIMES[i].for,
                    } as React.CSSProperties
                  }
                >
                  <h3 className="flex items-baseline gap-2 text-[1.625rem] leading-tight">
                    <span className="text-gold-text">{i + 1}</span>
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-[0.9375rem] leading-snug text-pretty text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
