import { Panel } from "@/components/mockups/panel";
import { cn } from "@/lib/utils";

/**
 * The in-play role controls: pick polos or sangsih, and the app takes the
 * other half. Polos lands on the beat, sangsih falls in the gaps it leaves.
 */
const POLOS = [1, 0, 1, 0, 1, 1, 0, 1];
const SANGSIH = [0, 1, 0, 1, 0, 0, 1, 0];

const PARTS = [
  { label: "Polos · you", row: POLOS, mine: true },
  { label: "Sangsih", row: SANGSIH, mine: false },
];

export function RolesMockup() {
  return (
    <Panel label="The app's role controls: a Polos and Sangsih toggle set to Polos, with the two interlocking parts shown as rows of blue and purple notes.">
      {/* control strip, as it sits over the camera feed */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-app-brass/40 p-1">
          <span className="rounded-full bg-app-brass px-4 py-1.5 text-xs font-bold tracking-widest text-app-bar">
            POLOS
          </span>
          <span className="px-4 py-1.5 text-xs font-semibold tracking-widest text-app-tan/70">
            SANGSIH
          </span>
        </div>
        <span className="rounded-full border border-app-brass/40 px-3.5 py-1.5 text-xs font-semibold text-app-tan">
          1×
        </span>
      </div>

      {/* the interlock, drawn out */}
      <div className="mt-5 flex flex-col gap-3">
        {PARTS.map((part) => (
          <div key={part.label} className="flex items-center gap-3">
            <span className="flex w-24 shrink-0 items-center gap-1.5 text-[0.65rem] text-app-tan/70">
              <span
                className={cn(
                  "size-2.5 rounded-[3px]",
                  part.mine
                    ? "bg-app-polos"
                    : "border-2 border-app-sangsih bg-transparent",
                )}
              />
              {part.label}
            </span>
            <span className="flex min-w-0 flex-1 gap-1.5">
              {part.row.map((beat, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-7 flex-1 rounded-[4px]",
                    beat === 0
                      ? "bg-app-cream/5"
                      : part.mine
                        ? "bg-app-polos"
                        : "bg-app-sangsih",
                  )}
                />
              ))}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.65rem] text-app-tan/50">
        Polos on the beat, sangsih between. Take a half; the app plays the other.
      </p>
    </Panel>
  );
}
