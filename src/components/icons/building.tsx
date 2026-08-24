import { strokeIcon, type IconProps } from "@/components/icons/icon-base";

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg {...strokeIcon} className={className}>
      <path d="M3 20h18" />
      <path d="M5 20V9.5L12 5l7 4.5V20" />
      <path d="M9.5 20v-4.5h5V20" />
      <path d="M9.5 11h1.5M13 11h1.5" />
    </svg>
  );
}
