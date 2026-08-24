import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  as: Tag = "article",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "article" | "div";
}) {
  return (
    <Tag
      className={cn(
        "flex flex-col gap-3 rounded-card border border-border bg-card p-7",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-bold text-balance">{children}</h3>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
  );
}

/** The tinted square that holds a section icon. */
export function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-accent-muted/35 text-accent">
      {children}
    </span>
  );
}
