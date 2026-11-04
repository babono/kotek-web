import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The app's prominences, drawn as `AppControlSurface` draws them: solid,
 * and tactile on a darker base. One `primary` per view, as in the app: it is
 * the one way on. `selected` sits sunk, where a pressed face lands.
 */
export const buttonVariants = cva(
  "tactile inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary font-bold text-primary-foreground [--base:var(--merah-tua)] hover:bg-primary-hover",
        secondary:
          "border-[1.5px] border-garis bg-surface text-foreground [--base:var(--garis)] hover:bg-putih",
        selected: "sunk bg-ireng text-putih",
      },
      size: {
        compact: "min-h-9 px-4 text-sm [--depth:2px]",
        regular: "min-h-11 px-[1.375rem] text-base [--depth:3px]",
        large: "min-h-13 px-7 text-[1.1875rem] [--depth:4px]",
      },
    },
    defaultVariants: { variant: "primary", size: "large" },
  },
);

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Every call to action on this page navigates, so it is an anchor, not a
 * button — that keeps Cmd-click and middle-click working.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: ButtonLinkProps) {
  const isExternal = /^https?:/.test(href);

  return (
    <Link
      href={href}
      // Keep the landing page open when handing off to another site.
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}
