import { strokeIcon, type IconProps } from "@/components/icons/icon-base";

export function MalletIcon({ className }: IconProps) {
  return (
    <svg {...strokeIcon} className={className}>
      <path d="M4 20 13 11" />
      <rect x="12.5" y="4.5" width="8" height="6" rx="3" transform="rotate(45 16.5 7.5)" />
    </svg>
  );
}
