import { cn } from "@/lib/utils";

/** Rotations and tints are picked from the index so a note never moves. */
const TINTS = [
  "bg-kayu",
  "bg-pattern",
  "bg-kuning/35",
  "bg-merah/15",
  "bg-krem",
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
        "flex flex-col gap-3 rounded-sm p-5 shadow-[0_10px_20px_-12px_rgba(30,36,53,0.55)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]",
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
