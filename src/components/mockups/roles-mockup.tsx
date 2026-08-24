import { Panel } from "@/components/mockups/panel";

/** polos on the off-beats, sangsih on the on-beats: the interlock, drawn out. */
const POLOS = [1, 0, 1, 0, 1, 1, 0, 1];
const SANGSIH = [0, 1, 0, 1, 0, 0, 1, 0];

const PARTS = [
  { label: "You", row: SANGSIH, active: true },
  { label: "Kotek", row: POLOS, active: false },
];

export function RolesMockup() {
  return (
    <Panel label="A role picker set to Sangsih, with the interlocking polos and sangsih parts shown as two rows of beats.">
      <p className="mb-4 text-xs font-medium tracking-wider text-subtle-foreground uppercase">
        Your role
      </p>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-inverse-foreground/5 p-1">
        <span className="rounded-full px-4 py-2 text-center text-sm text-subtle-foreground">
          Polos
        </span>
        <span className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
          Sangsih
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {PARTS.map((part) => (
          <div key={part.label} className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-xs text-subtle-foreground">
              {part.label}
            </span>
            <span className="flex min-w-0 flex-1 gap-1.5">
              {part.row.map((beat, i) => (
                <span
                  key={i}
                  className={`h-8 flex-1 rounded-md ${
                    beat === 1
                      ? part.active
                        ? "bg-primary"
                        : "bg-accent-muted/60"
                      : "bg-inverse-foreground/8"
                  }`}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
