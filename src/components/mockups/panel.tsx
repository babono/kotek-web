/** Shared frame for the small app-UI panels shown in the feature cards. */
export function Panel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="w-full overflow-hidden rounded-2xl bg-inverse p-5 shadow-[0_20px_50px_-24px_rgba(46,33,25,0.6)] ring-1 ring-border"
    >
      {children}
    </div>
  );
}
