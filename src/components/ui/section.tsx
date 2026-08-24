import { cn } from "@/lib/utils";

/**
 * One band of the page. Owns the vertical rhythm so every section shares it,
 * and the scroll-margin that keeps anchored headings clear of the sticky header.
 */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-16 py-20 md:py-26", className)}
    >
      {children}
    </section>
  );
}
