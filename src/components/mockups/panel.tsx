import { cn } from "@/lib/utils";

/**
 * Shared frame for the product mockups. Matches the app's own screen colour
 * rather than the site palette, so the panels read as real screenshots.
 */
export function Panel({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "w-full overflow-hidden rounded-2xl bg-app-bg p-5 shadow-[0_20px_50px_-24px_rgba(46,33,25,0.6)] ring-1 ring-app-brass/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
