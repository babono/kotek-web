import { figure } from "@/content/kotekan";
import { cn } from "@/lib/utils";

type NoteStyle = "polos" | "sangsih" | "ghost" | "gold";

const NOTE: Record<NoteStyle, string> = {
  polos: "bg-merah",
  sangsih: "bg-sangsih",
  gold: "bg-kuning",
  ghost: "border-[1.5px] border-dashed border-garis bg-transparent",
};

/**
 * The picker card's little roll: the real figure, a row per bilah, drawn with
 * the same pills the app uses, so the story's diagrams are its own notation.
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
  const rows = [7, 6, 5];
  const columns = figure.polos.length;

  return (
    <div
      aria-hidden
      className={cn("grid h-16 w-full gap-x-1 gap-y-1.5", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {rows.flatMap((key) =>
        Array.from({ length: columns }, (_, slot) => {
          const voices = [
            polos && figure.polos[slot] === key ? NOTE[polos] : null,
            sangsih && figure.sangsih[slot] === key ? NOTE[sangsih] : null,
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
