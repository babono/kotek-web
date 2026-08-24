import { strokeIcon, type IconProps } from "@/components/icons/icon-base";

export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...strokeIcon} className={className}>
      <path d="M4 20h16" />
      <path d="M7 20v-5.5M12 20V8M17 20v-8.5" />
      <path d="m5.5 9 4-3.5 3 2L19 3" />
    </svg>
  );
}
