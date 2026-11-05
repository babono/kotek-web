/**
 * The sample from the app's "How kotekan works" guide (`KotekanSample`): one
 * line, 5 6 7 6 5 4 5 6, dealt out a stroke each, polos on the beat and sangsih
 * between. Key indices, null for a rest; index 0 is bilah 1. It was made for
 * the guide because the catalogue's figures share notes and double up, which
 * is the real thing but not the idea in one look.
 */
export const kotekanSample = {
  polos: [5, null, 7, null, 5, null, 5, null],
  sangsih: [null, 6, null, 6, null, 4, null, 6],
  /** Milliseconds per slot, the app's tempo for the sample. */
  strokeMs: 250,
  /** Bilah on the drawn gangsa. */
  keyCount: 10,
} as const;

export type Voice = "polos" | "sangsih";

/** The app's own recorded bilah, one file per key index the sample uses. */
export const samples = {
  4: "/audio/key4.m4a",
  5: "/audio/key5.m4a",
  6: "/audio/key6.m4a",
  7: "/audio/key7.m4a",
} as const;
