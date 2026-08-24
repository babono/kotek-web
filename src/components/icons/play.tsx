import type { IconProps } from "@/components/icons/icon-base";

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8.5 6.2a.9.9 0 0 1 1.37-.77l7.7 5.02a.9.9 0 0 1 0 1.51l-7.7 5.02a.9.9 0 0 1-1.37-.76V6.2Z" />
    </svg>
  );
}
