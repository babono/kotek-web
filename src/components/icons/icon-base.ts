import type { SVGProps } from "react";

export type IconProps = { className?: string };

/** Shared stroke setup for the line icons, kept identical across the set. */
export const strokeIcon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} satisfies SVGProps<SVGSVGElement>;
