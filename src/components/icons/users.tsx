import { strokeIcon, type IconProps } from "@/components/icons/icon-base";

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...strokeIcon} className={className}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.4a3.25 3.25 0 0 1 0 5.2" />
      <path d="M17.5 14.2A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  );
}
