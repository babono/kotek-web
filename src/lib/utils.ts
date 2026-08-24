import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones
 * in the same group (`bg-*`, `p-*`, …). Plain string concatenation cannot do
 * this — the winner would be decided by stylesheet order instead.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
