import type { IconProps } from "@/components/icons/icon-base";
import type { PlaceKind } from "@/content/landing";

function SchoolIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3.5 1.5 9 12 14.5l8.5-4.45V16H22V9.3a.9.9 0 0 0-.48-.8L12 3.5Z" />
      <path d="M5.5 13.6V17c0 1.65 2.9 3.5 6.5 3.5s6.5-1.85 6.5-3.5v-3.4L12 17l-6.5-3.4Z" />
    </svg>
  );
}

/** A bale: the banjar's open pavilion, a roof on posts. */
function BanjarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M11.4 3.2a1 1 0 0 1 1.2 0L22 10.1a.5.5 0 0 1-.3.9H2.3a.5.5 0 0 1-.3-.9l9.4-6.9Z" />
      <path d="M4.5 12.5h2.25V18H4.5zM10.9 12.5h2.25V18H10.9zM17.25 12.5h2.25V18h-2.25z" />
      <rect x="2.5" y="19" width="19" height="2.25" rx="1" />
    </svg>
  );
}

/** A panggul: the gangsa mallet, the sanggar's whole subject. */
function MalletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
      <path d="M4.5 19.5 14 10" strokeWidth="2.25" />
      <path d="M11.5 5.5 18.5 12.5" strokeWidth="5.5" />
    </svg>
  );
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M11.3 3.3a1 1 0 0 1 1.4 0l8.9 8.3c.33.3.12.9-.34.9H19.5V20a1 1 0 0 1-1 1h-3.75v-5.25a1 1 0 0 0-1-1h-3.5a1 1 0 0 0-1 1V21H5.5a1 1 0 0 1-1-1v-7.5H2.74c-.46 0-.67-.6-.34-.9l8.9-8.3Z" />
    </svg>
  );
}

function WorldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12h17M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" />
    </svg>
  );
}

export const placeIcons = {
  school: SchoolIcon,
  banjar: BanjarIcon,
  sanggar: MalletIcon,
  home: HomeIcon,
  world: WorldIcon,
} satisfies Record<PlaceKind | "world", (props: IconProps) => React.JSX.Element>;
