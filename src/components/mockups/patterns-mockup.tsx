import { Panel } from "@/components/mockups/panel";
import { cn } from "@/lib/utils";

/**
 * The "Choose your kotekan" carousel: each card previews its figure as
 * interlocking polos (blue) and sangsih (purple) blocks across one gong cycle.
 */
type Block = { slot: number; row: number; part: "polos" | "sangsih" | "both" };

const FIGURE: Block[] = [
  { slot: 0, row: 0, part: "polos" },
  { slot: 1, row: 2, part: "sangsih" },
  { slot: 2, row: 1, part: "both" },
  { slot: 3, row: 0, part: "polos" },
  { slot: 4, row: 2, part: "sangsih" },
  { slot: 5, row: 0, part: "polos" },
  { slot: 6, row: 1, part: "both" },
  { slot: 7, row: 2, part: "sangsih" },
];

function FigurePreview({ dim = false }: { dim?: boolean }) {
  return (
    <div className={cn("relative h-16 w-full", dim && "opacity-40")}>
      {FIGURE.map((block) => (
        <span
          key={block.slot}
          style={{
            left: `${block.slot * 12.5}%`,
            top: `${block.row * 33}%`,
            width: "9%",
          }}
          className={cn(
            "absolute h-4 rounded-[3px]",
            block.part === "polos" && "bg-app-polos",
            block.part === "sangsih" && "bg-app-sangsih",
            block.part === "both" &&
              "bg-gradient-to-r from-app-polos from-50% to-app-sangsih to-50%",
          )}
        />
      ))}
      {/* the sweep: where the cycle is now */}
      <span className="absolute top-0 bottom-0 left-[37%] w-px bg-app-cream/70" />
    </div>
  );
}

export function PatternsMockup() {
  return (
    <Panel
      className="p-4"
      label="The app's kotekan picker: a Level 1 card called Ubitan Nyendok showing its figure as interlocking blue and purple blocks, between two locked cards."
    >
      <p className="mb-3 text-center font-serif text-sm tracking-wide text-app-cream">
        CHOOSE YOUR KOTEKAN
      </p>
      <div className="flex items-stretch gap-2">
        {/* peek of the previous card */}
        <div className="hidden w-16 shrink-0 overflow-hidden rounded-xl border border-app-brass/15 p-3 sm:block">
          <p className="text-[0.5rem] tracking-wider text-app-brass/60 uppercase">
            Lvl 4
          </p>
          <p className="mt-1 font-serif text-sm text-app-cream/40">Babaru</p>
        </div>

        {/* focused card */}
        <div className="min-w-0 flex-1 rounded-xl border border-app-brass/70 bg-app-panel p-4">
          <p className="text-[0.6rem] font-semibold tracking-[0.18em] text-app-brass uppercase">
            Level 1 · Telu family
          </p>
          <p className="mt-1 font-serif text-lg text-app-cream">
            Ubitan Nyendok
          </p>
          <div className="mt-3">
            <FigurePreview />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-app-miss">
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Needs 8 keys
          </p>
        </div>

        {/* peek of the next card */}
        <div className="hidden w-16 shrink-0 overflow-hidden rounded-xl border border-app-brass/15 p-3 sm:block">
          <p className="text-[0.5rem] tracking-wider text-app-brass/60 uppercase">
            Lvl 2
          </p>
          <p className="mt-1 font-serif text-sm text-app-cream/40">Kabelet</p>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.65rem] text-app-tan/50">
        Swipe to hear another
      </p>
    </Panel>
  );
}
