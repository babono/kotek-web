import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Kipli, the app's guide, speaking in the one bubble he ever uses: white,
 * ringed in Ireng, on a Garis edge.
 */
export function KipliSays({
  mood = "happy",
  live = false,
  className,
  children,
}: {
  mood?: "happy" | "sad";
  /** Announce changes to assistive tech: for lines that follow what's playing. */
  live?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={`/art/kipli-${mood}.svg`}
        alt=""
        width={59}
        height={52}
        className="h-[3.25rem] w-auto shrink-0"
      />
      <p
        aria-live={live ? "polite" : undefined}
        className="tactile rounded-kotek border-[1.5px] border-ireng bg-surface px-4 py-2.5 text-[0.9375rem] leading-snug text-ireng [--base:var(--garis)]"
      >
        {children}
      </p>
    </div>
  );
}
