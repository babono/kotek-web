import { kotekanSample } from "@/content/kotekan";
import { cn } from "@/lib/utils";

type NoteStyle = "polos" | "sangsih" | "gold" | "ghost" | "sangsih-ghost";

const NOTE: Record<NoteStyle, string> = {
  polos: "bg-merah",
  sangsih: "bg-sangsih",
  gold: "bg-kuning",
  ghost: "border-[1.5px] border-dashed border-garis",
  "sangsih-ghost": "border-[1.5px] border-dashed border-sangsih/55 bg-sangsih/8",
};

/**
 * The roll from the app's "How kotekan works" guide: the same sample as the
 * hero, a row per bilah, time left to right, so the page's diagrams are the
 * app's own notation.
 */
export function MiniRoll({
  polos = "polos",
  sangsih = "sangsih",
  className,
}: {
  polos?: NoteStyle | null;
  sangsih?: NoteStyle | null;
  className?: string;
}) {
  const rows = [7, 6, 5, 4];
  const columns = kotekanSample.polos.length;

  return (
    <div
      aria-hidden
      className={cn("grid h-20 w-full gap-x-1 gap-y-1", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {rows.flatMap((key) =>
        Array.from({ length: columns }, (_, slot) => {
          const voices = [
            polos && kotekanSample.polos[slot] === key ? NOTE[polos] : null,
            sangsih && kotekanSample.sangsih[slot] === key ? NOTE[sangsih] : null,
          ].filter(Boolean);
          return (
            <span key={`${key}-${slot}`} className="relative min-h-0">
              {voices.length > 0 ? (
                <span
                  className={cn("absolute inset-0 rounded-[0.3rem]", voices[0])}
                />
              ) : null}
            </span>
          );
        }),
      )}
    </div>
  );
}
