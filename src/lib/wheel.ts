import { WHEEL_TOTAL_WEIGHT, type WheelSlice } from "@/content/wheel";

/** URL switch for demos: ?keychain=100 makes the keychain a certainty. */
export const KEYCHAIN_PARAM = "keychain";

/**
 * Reads the keychain override from a query string. A bare `?keychain` counts
 * as 100. Returns null when the parameter is absent, so the wheel falls back
 * to the odds defined in content.
 */
export function readKeychainOverride(search: string): number | null {
  const raw = new URLSearchParams(search).get(KEYCHAIN_PARAM);
  if (raw === null) return null;
  if (raw === "") return 100;

  const value = Number(raw);
  if (!Number.isFinite(value)) return 100;
  return Math.min(100, Math.max(0, value));
}

/**
 * Weight per wedge, in the same parts-per-thousand scale as the content.
 * With an override the keychain takes its share and the rest split what is
 * left, keeping the wheel's own odds untouched in the default case.
 */
export function buildWeights(
  slices: WheelSlice[],
  keychainPercent: number | null,
): number[] {
  if (keychainPercent === null) return slices.map((slice) => slice.weight);

  const keychainWeight = (keychainPercent / 100) * WHEEL_TOTAL_WEIGHT;
  const others = slices.filter((slice) => slice.tone !== "keychain").length;
  const eachOther = others > 0 ? (WHEEL_TOTAL_WEIGHT - keychainWeight) / others : 0;

  return slices.map((slice) =>
    slice.tone === "keychain" ? keychainWeight : eachOther,
  );
}

/**
 * Picks a wedge by weight. Called before the animation starts; the wheel is
 * then spun so the pointer lands on whatever came out of here.
 */
export function pickWeightedIndex(
  weights: number[],
  random: number = Math.random(),
): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return 0;

  let threshold = random * total;
  for (let i = 0; i < weights.length; i++) {
    threshold -= weights[i];
    if (threshold < 0) return i;
  }

  return weights.length - 1;
}
