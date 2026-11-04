"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { DeviceFrame } from "@/components/ui/device-frame";
import { cn } from "@/lib/utils";

type Screen = {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
  readonly image: string;
  readonly alt: string;
};

/** `AppSwitcher.pills`, the app's own way of choosing between views. */
export function ScreenSwitcher({ screens }: { screens: readonly Screen[] }) {
  const [activeId, setActiveId] = useState(screens[0].id);
  const active = screens.find((s) => s.id === activeId) ?? screens[0];

  return (
    <div className="flex flex-col items-center gap-6">
      <div role="group" aria-label="App screens" className="flex flex-wrap justify-center gap-2">
        {screens.map((screen) => (
          <button
            key={screen.id}
            type="button"
            aria-pressed={screen.id === activeId}
            onClick={() => setActiveId(screen.id)}
            className={cn(
              buttonVariants({
                variant: screen.id === activeId ? "selected" : "secondary",
                size: "regular",
              }),
              "cursor-pointer",
            )}
          >
            {screen.label}
          </button>
        ))}
      </div>

      {/* Stacked, so all three load up front and the switch is instant. */}
      <div className="grid w-full max-w-5xl">
        {screens.map((screen) => (
          <div
            key={screen.id}
            aria-hidden={screen.id !== activeId}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-300",
              screen.id === activeId ? "opacity-100" : "invisible opacity-0",
            )}
          >
            <DeviceFrame
              src={screen.image}
              alt={screen.alt}
              sizes="(min-width: 1024px) 64rem, 100vw"
            />
          </div>
        ))}
      </div>

      <p aria-live="polite" className="max-w-xl text-center text-lg text-pretty text-body">
        {active.caption}
      </p>
    </div>
  );
}
