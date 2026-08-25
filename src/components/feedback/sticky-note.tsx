import { cn } from "@/lib/utils";

/** Rotations and tints are picked from the index so a note never moves. */
const TINTS = [
  "bg-[#f3d9a4]",
  "bg-[#e9c9a8]",
  "bg-[#dfe3c8]",
  "bg-[#f0d3c2]",
  "bg-[#e5dcc6]",
];

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"];

export function StickyNote({
  name,
  message,
  index,
  pending = false,
}: {
  name: string;
  message: string;
  index: number;
  pending?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-sm p-5 shadow-[0_10px_20px_-12px_rgba(46,33,25,0.55)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]",
        TINTS[index % TINTS.length],
        ROTATIONS[index % ROTATIONS.length],
        pending && "opacity-60",
      )}
    >
      <p className="text-sm leading-relaxed break-words text-foreground">
        {message}
      </p>
      <p className="text-xs font-semibold text-foreground/60">
        {name}
        {pending ? " · sticking…" : ""}
      </p>
    </div>
  );
}
