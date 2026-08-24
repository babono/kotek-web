/** Visible only on keyboard focus; lets keyboard users jump the nav. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-inverse focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-inverse-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
    >
      Skip to content
    </a>
  );
}
