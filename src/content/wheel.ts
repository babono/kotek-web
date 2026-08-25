export type WheelSlice = {
  id: string;
  label: string;
  prize: string;
  /**
   * Odds in parts per thousand. The six wedges are drawn the same size, but
   * they are not equally likely: the keychain is 2%, and the remaining 98%
   * is split evenly across the other five (19.6% each).
   */
  weight: number;
  tone: "sticker" | "candy" | "keychain";
};

export const WHEEL_TOTAL_WEIGHT = 1000;

/** Keychain stays at 2%; the other nine wedges split the remaining 98%. */
const KEYCHAIN_WEIGHT = 20;
const OTHER_WEIGHT = (WHEEL_TOTAL_WEIGHT - KEYCHAIN_WEIGHT) / 9;

const sticker = (n: number): WheelSlice => ({
  id: `sticker-${n}`,
  label: "Sticker",
  prize: "a Kotek sticker",
  weight: OTHER_WEIGHT,
  tone: "sticker",
});

const candy = (n: number): WheelSlice => ({
  id: `candy-${n}`,
  label: "Candy",
  prize: "a candy",
  weight: OTHER_WEIGHT,
  tone: "candy",
});

/** Alternating, so no two wedges of the same prize ever sit side by side. */
export const wheelSlices: WheelSlice[] = [
  sticker(1),
  candy(1),
  sticker(2),
  candy(2),
  sticker(3),
  candy(3),
  sticker(4),
  candy(4),
  sticker(5),
  {
    id: "keychain",
    label: "Keychain",
    prize: "a Kotek keychain",
    weight: KEYCHAIN_WEIGHT,
    tone: "keychain",
  },
];

export const wheelCopy = {
  eyebrow: "Prize wheel",
  title: "Spin to win something small",
  description:
    "Come and find us at the booth, give the wheel a spin, and take home a little piece of Kotek.",
} as const;
