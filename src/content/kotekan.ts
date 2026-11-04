/**
 * Ubitan Nyendok, the app's first kotekan, from `Kotekan.figures` in the iOS
 * repo: key indices over one gong cycle, null for a rest. Index 0 is bilah 1.
 * Between them the two halves strike on every slot, so either one alone has
 * audible holes, which is the whole point of the demo.
 */
export const figure = {
  polos: [7, null, 6, 7, null, 7, 6, null],
  sangsih: [null, 5, 6, null, 5, null, 6, 5],
  /** Milliseconds per slot, the app's tempo for this figure. */
  strokeMs: 250,
  /** Bilah on the drawn gangsa. */
  keyCount: 10,
} as const;

export type Voice = "polos" | "sangsih";

/** The app's own recorded bilah, one file per key index the figure uses. */
export const samples = {
  5: "/audio/key5.m4a",
  6: "/audio/key6.m4a",
  7: "/audio/key7.m4a",
  kajar: "/audio/kajar.m4a",
  gong: "/audio/gong.m4a",
} as const;
