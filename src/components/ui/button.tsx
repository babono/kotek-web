import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        solid: "bg-inverse text-inverse-foreground hover:bg-inverse-hover",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border border-border bg-white text-foreground hover:border-foreground/30 hover:bg-card",
        ghost: "text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "px-5 py-2.5 text-sm",
        md: "px-6 py-3.5 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
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
