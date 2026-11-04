/** `SectionLabel` from the app: small, tracked, uppercase, quiet. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
      {children}
    </span>
  );
}
