import { strokeIcon, type IconProps } from "@/components/icons/icon-base";

export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...strokeIcon} className={className}>
      <path d="M13 3 5.5 13.5H11l-.5 7.5L18 10.5h-5.5z" />
    </svg>
  );
}
