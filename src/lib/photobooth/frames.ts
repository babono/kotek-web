/**
 * The photobooth's frames, drawn straight onto a canvas so the live preview
 * and the saved picture are the same drawing. Every colour is a Laras one
 * (laras.kotek.app), and the art is the site's own: the pura gate, Kipli,
 * the janur, the tumpal band and the gangsa.
 */

export type Rect = { x: number; y: number; w: number; h: number };

/** A captured picture, or the live camera, and whether to flip it. */
export type Source = {
  image: CanvasImageSource;
  width: number;
  height: number;
  mirror?: boolean;
};

export type ArtName =
  | "gate"
  | "kipli"
  | "janur"
  | "nawasanga"
  | "wordmark"
  | "mallet"
  | "gangsa";

export type Art = Record<ArtName, HTMLImageElement>;

const ART_SRC: Record<ArtName, string> = {
  gate: "/art/pura-gate.svg",
  kipli: "/art/kipli-happy.svg",
  janur: "/art/janur-hang.svg",
  nawasanga: "/art/nawasanga.svg",
  wordmark: "/art/wordmark-kotek-red.svg",
  mallet: "/art/mallet.svg",
  gangsa: "/art/gangsa-table.svg",
};

export function loadArt(): Promise<Art> {
  const entries = Object.entries(ART_SRC) as [ArtName, string][];
  return Promise.all(
    entries.map(
      ([name, src]) =>
        new Promise<[ArtName, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve([name, img]);
          img.onerror = () => reject(new Error(`Could not load ${src}`));
          img.src = src;
        }),
    ),
  ).then((pairs) => Object.fromEntries(pairs) as Art);
}

/** Laras' Nawa Sanga, as globals.css has them. */
const C = {
  merah: "#e14b2f",
  merahTua: "#a93321",
  kuning: "#f5b331",
  kuningEdge: "#e5a020",
  goldText: "#8d7044",
  ireng: "#1e2435",
  putih: "#fbf6ee",
  sangsih: "#2f4b82",
  kayu: "#f2ddb4",
  krem: "#f5ede0",
  garis: "#cdbba3",
  surface: "#ffffff",
  pattern: "#efe2cc",
  description: "#6b6e78",
  keyHighlight: "#ffda8d",
};

export type Fonts = { display: string; sans: string };

export type DrawContext = {
  ctx: CanvasRenderingContext2D;
  art: Art;
  fonts: Fonts;
  /** One per slot; null draws the empty placeholder. */
  sources: (Source | null)[];
  /** Fixed per picture so a redraw of it says the same thing. */
  line: string;
  date: string;
};

export type Frame = {
  id: string;
  name: string;
  blurb: string;
  width: number;
  height: number;
  slots: Rect[];
  draw: (d: DrawContext) => void;
};

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
/* ------------------------------------------------------------------ */

function rounded(ctx: CanvasRenderingContext2D, r: Rect, radius: number) {
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.w, r.h, radius);
}

/** A Laras surface: solid, on a darker base a few pixels below. */
function tactile(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  radius: number,
  fill: string,
  base: string,
  depth: number,
  stroke?: { color: string; width: number },
) {
  rounded(ctx, { ...r, y: r.y + depth }, radius);
  ctx.fillStyle = base;
  ctx.fill();
  rounded(ctx, r, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = stroke.color;
    ctx.stroke();
  }
}

/** Fills a rounded window with the picture, cropped to cover it. */
function photo(d: DrawContext, r: Rect, radius: number, source: Source | null) {
  const { ctx, art } = d;
  ctx.save();
  rounded(ctx, r, radius);
  ctx.clip();
  if (source) {
    const scale = Math.max(r.w / source.width, r.h / source.height);
    const w = source.width * scale;
    const h = source.height * scale;
    const x = r.x + (r.w - w) / 2;
    const y = r.y + (r.h - h) / 2;
    if (source.mirror) {
      ctx.translate(r.x * 2 + r.w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(source.image, x, y, w, h);
  } else {
    // The empty slot: Krem with a faint Kipli, so a thumbnail reads as a frame.
    ctx.fillStyle = C.krem;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    const kw = Math.min(r.w, r.h) * 0.42;
    const kh = kw * (341 / 389);
    ctx.globalAlpha = 0.16;
    ctx.drawImage(art.kipli, r.x + (r.w - kw) / 2, r.y + (r.h - kh) / 2, kw, kh);
  }
  ctx.restore();
}

/** Draws art at a width, keeping its proportions; returns the height used. */
function place(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  opts: { flip?: boolean; alpha?: number } = {},
) {
  const h = (w * img.naturalHeight) / img.naturalWidth;
  ctx.save();
  if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
  if (opts.flip) {
    ctx.translate(x * 2 + w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
  return h;
}

/** Art recoloured to one flat colour, for watermarks. */
function tinted(img: HTMLImageElement, color: string) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth * 2;
  c.height = img.naturalHeight * 2;
  const x = c.getContext("2d")!;
  x.drawImage(img, 0, 0, c.width, c.height);
  x.globalCompositeOperation = "source-in";
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}

const tintCache = new Map<string, HTMLCanvasElement>();
function tint(img: HTMLImageElement, color: string) {
  const key = `${img.src}|${color}`;
  let c = tintCache.get(key);
  if (!c) {
    c = tinted(img, color);
    tintCache.set(key, c);
  }
  return c;
}

/** The tumpal band: Kuning triangles with a Merah heart, as on the site. */
function tumpal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pointing: "down" | "up" = "down",
) {
  const count = Math.max(1, Math.round(w / (h * 1.5)));
  const tw = w / count;
  ctx.save();
  if (pointing === "up") {
    ctx.translate(0, y * 2 + h);
    ctx.scale(1, -1);
  }
  for (let i = 0; i < count; i++) {
    const left = x + i * tw;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + tw, y);
    ctx.lineTo(left + tw / 2, y + h);
    ctx.closePath();
    ctx.fillStyle = C.kuning;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(left + tw / 4, y);
    ctx.lineTo(left + (tw * 3) / 4, y);
    ctx.lineTo(left + tw / 2, y + h / 2);
    ctx.closePath();
    ctx.fillStyle = C.merah;
    ctx.fill();
  }
  ctx.restore();
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = "center",
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}

/** A falling note: a Merah (polos) or Sangsih pill with its bilah number. */
function note(
  d: DrawContext,
  cx: number,
  cy: number,
  n: number,
  half: "polos" | "sangsih",
  scale = 1,
  tail = true,
) {
  const { ctx } = d;
  const w = 74 * scale;
  const h = 34 * scale;
  // The tail it leaves, as on the play screen.
  ctx.save();
  if (!tail) ctx.globalAlpha = 0;
  if (tail) ctx.globalAlpha = 0.5;
  rounded(ctx, { x: cx - w * 0.28, y: cy - h * 3.2, w: w * 0.56, h: h * 3.2 }, 8 * scale);
  ctx.fillStyle = C.surface;
  ctx.fill();
  ctx.lineWidth = 2 * scale;
  ctx.strokeStyle = C.garis;
  ctx.stroke();
  ctx.restore();
  rounded(ctx, { x: cx - w / 2, y: cy - h / 2, w, h }, h / 2);
  ctx.fillStyle = half === "polos" ? C.merah : C.sangsih;
  ctx.fill();
  text(ctx, String(n), cx, cy + 9 * scale, `700 ${26 * scale}px ${d.fonts.sans}`, C.surface);
}

/** Kipli's bubble: white, ringed in Ireng, on a Garis edge. */
function bubble(d: DrawContext, right: number, y: number, size: number) {
  const { ctx } = d;
  ctx.font = `700 ${size}px ${d.fonts.sans}`;
  const w = ctx.measureText(d.line).width + size * 1.4;
  const h = size * 2;
  const r = { x: right - w, y, w, h };
  tactile(ctx, r, size * 0.55, C.surface, C.garis, 6, { color: C.ireng, width: 4 });
  text(ctx, d.line, r.x + w / 2, y + h / 2 + size * 0.36, ctx.font, C.ireng);
}

/* ------------------------------------------------------------------ */
/* The frames                                                          */
/* ------------------------------------------------------------------ */

const gate: Frame = {
  id: "gate",
  name: "Pura gate",
  blurb: "Between the candi bentar, as on the app's welcome screen.",
  width: 1080,
  height: 1350,
  slots: [{ x: 96, y: 176, w: 888, h: 800 }],
  draw(d) {
    const { ctx, art } = d;
    ctx.fillStyle = C.putih;
    ctx.fillRect(0, 0, 1080, 1350);
    // Nawa Sanga, the site's watermark, behind everything.
    const nw = 1180;
    ctx.drawImage(tint(art.nawasanga, C.pattern), (1080 - nw) / 2, 40, nw, nw * (538 / 540));

    tumpal(ctx, 0, 0, 1080, 44);
    place(ctx, art.wordmark, 1080 / 2 - 125, 70, 250);

    const slot = this.slots[0];
    tactile(ctx, { x: slot.x - 10, y: slot.y - 10, w: slot.w + 20, h: slot.h + 20 }, 40, C.ireng, C.garis, 10);
    photo(d, slot, 32, d.sources[0]);

    // The split gate, a half at each side, stepping in over the picture.
    const gh = 600;
    const gw = gh * (208 / 434);
    ctx.drawImage(art.gate, -18, 1350 - gh, gw, gh);
    place(ctx, art.gate, 1080 - gw + 18, 1350 - gh, gw, { flip: true });

    text(ctx, d.line, 540, 1080, `400 72px ${d.fonts.display}`, C.ireng);
    text(ctx, `kotek.app · ${d.date}`, 540, 1142, `600 28px ${d.fonts.sans}`, C.description);
    tumpal(ctx, 280, 1306, 520, 44, "up");
  },
};

/** Lanes and notes as on the play screen; the struck bilah is the 7. */
const play: Frame = {
  id: "play",
  name: "Play screen",
  blurb: "Notes falling, the 7 struck, Perfect.",
  width: 1080,
  height: 1350,
  slots: [{ x: 110, y: 130, w: 860, h: 800 }],
  draw(d) {
    const { ctx, art } = d;
    ctx.fillStyle = C.putih;
    ctx.fillRect(0, 0, 1080, 1350);

    // Ten lanes, one per bilah.
    const left = 60;
    const lane = (1080 - left * 2) / 10;
    ctx.strokeStyle = "rgba(205,187,163,0.45)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(left + i * lane, 0);
      ctx.lineTo(left + i * lane, 1040);
      ctx.stroke();
    }
    // The struck lane's column of light.
    const grad = ctx.createLinearGradient(0, 0, 0, 1040);
    grad.addColorStop(0, "rgba(245,179,49,0)");
    grad.addColorStop(1, "rgba(245,179,49,0.28)");
    ctx.fillStyle = grad;
    ctx.fillRect(left + 6 * lane, 0, lane, 1040);

    place(ctx, art.wordmark, 540 - 118, 44, 236);

    const slot = this.slots[0];
    tactile(ctx, { x: slot.x - 8, y: slot.y - 8, w: slot.w + 16, h: slot.h + 16 }, 36, C.ireng, C.garis, 10);
    photo(d, slot, 30, d.sources[0]);

    // Notes on their way down, either side of the picture and over its edges.
    const cx = (i: number) => left + (i - 0.5) * lane;
    note(d, cx(1), 330, 1, "polos");
    note(d, cx(2), 640, 2, "sangsih", 1, false);
    note(d, cx(10), 250, 10, "sangsih");
    note(d, cx(9), 560, 9, "polos", 1, false);
    note(d, cx(1), 860, 1, "sangsih");
    note(d, cx(10), 880, 10, "polos");
    note(d, cx(4), 1000, 4, "sangsih", 1, false);

    // The hit line, then the bilah.
    ctx.fillStyle = C.kuning;
    ctx.fillRect(left, 1040, 1080 - left * 2, 6);
    place(ctx, art.gangsa, 40, 1112, 1000);
    const gap = 10;
    const tw = lane - gap;
    for (let i = 0; i < 10; i++) {
      const r = { x: left + i * lane + gap / 2, y: 1066, w: tw, h: 132 };
      const struck = i === 6;
      if (struck) {
        // Gold halo round the struck bilah.
        const g = ctx.createRadialGradient(r.x + tw / 2, r.y + 50, 10, r.x + tw / 2, r.y + 50, 150);
        g.addColorStop(0, "rgba(255,218,141,0.95)");
        g.addColorStop(1, "rgba(255,218,141,0)");
        ctx.fillStyle = g;
        ctx.fillRect(r.x - 150, r.y - 150, tw + 300, 340);
      }
      tactile(ctx, r, 16, struck ? "#d96f3a" : C.kayu, struck ? C.merahTua : C.garis, 6, struck ? { color: C.kuning, width: 4 } : undefined);
      text(ctx, String(i + 1), r.x + tw / 2, r.y + 76, `700 30px ${d.fonts.sans}`, struck ? C.surface : C.goldText);
    }
    // Sparks and the verdict over the struck bilah.
    const sx = left + 6.5 * lane;
    ctx.fillStyle = C.kuning;
    for (const [dx, dy, r] of [[-38, -40, 6], [-14, -58, 5], [22, -48, 7], [44, -30, 5], [0, -28, 4]]) {
      ctx.beginPath();
      ctx.arc(sx + dx, 1040 + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = C.surface;
    ctx.font = `800 40px ${d.fonts.sans}`;
    ctx.textAlign = "center";
    ctx.strokeText("PERFECT", sx, 984);
    ctx.restore();
    text(ctx, "PERFECT", sx, 984, `800 40px ${d.fonts.sans}`, C.kuningEdge);
    place(ctx, art.mallet, sx - 30, 1110, 190);

    text(ctx, `${d.line}  ·  kotek.app`, 540, 1332, `600 26px ${d.fonts.sans}`, C.goldText);
  },
};

const kipli: Frame = {
  id: "kipli",
  name: "Kipli says",
  blurb: "Merah, with the janur and Kipli cheering you on.",
  width: 1080,
  height: 1350,
  slots: [{ x: 104, y: 160, w: 872, h: 860 }],
  draw(d) {
    const { ctx, art } = d;
    ctx.fillStyle = C.merah;
    ctx.fillRect(0, 0, 1080, 1350);
    const nw = 760;
    const ghost = tint(art.nawasanga, "rgba(169,51,33,0.55)");
    ctx.drawImage(ghost, -nw * 0.42, -nw * 0.38, nw, nw);
    ctx.drawImage(ghost, 1080 - nw * 0.5, 1350 - nw * 0.55, nw, nw);

    // The janur hanging in from the top corners.
    const janur = tint(art.janur, C.kayu);
    ctx.drawImage(janur, 22, -20, 96, 96 * (275 / 113));
    ctx.drawImage(janur, 1080 - 118, -20, 96, 96 * (275 / 113));

    const slot = this.slots[0];
    tactile(ctx, { x: slot.x - 24, y: slot.y - 24, w: slot.w + 48, h: slot.h + 48 }, 48, C.surface, C.merahTua, 14);
    photo(d, slot, 28, d.sources[0]);

    // Kipli over the bottom-right corner, saying the line.
    const kw = 300;
    place(ctx, art.kipli, 1080 - kw - 24, 1350 - 300, kw);
    bubble(d, 1080 - kw - 30, 1350 - 236, 40);

    text(ctx, "KOTEK", 72, 1270, `400 96px ${d.fonts.display}`, C.putih, "left");
    text(ctx, d.date, 76, 1312, `600 26px ${d.fonts.sans}`, C.kayu, "left");
  },
};

/** The classic booth strip: three in a row, top to bottom. */
const strip: Frame = {
  id: "strip",
  name: "Photo strip",
  blurb: "Three shots, one strip. Polos, sangsih, together.",
  width: 720,
  height: 2160,
  slots: [0, 1, 2].map((i) => ({ x: 56, y: 116 + i * 576, w: 608, h: 540 })),
  draw(d) {
    const { ctx, art } = d;
    ctx.fillStyle = C.kayu;
    ctx.fillRect(0, 0, 720, 2160);
    tumpal(ctx, 0, 0, 720, 40);

    const labels = ["Polos", "Sangsih", "Together"];
    const fills = [C.merah, C.sangsih, C.ireng];
    this.slots.forEach((slot, i) => {
      tactile(ctx, { x: slot.x - 8, y: slot.y - 8, w: slot.w + 16, h: slot.h + 16 }, 30, C.ireng, C.garis, 8);
      photo(d, slot, 24, d.sources[i] ?? null);
      // The half each shot plays, in its chip.
      ctx.font = `700 26px ${d.fonts.sans}`;
      const w = ctx.measureText(labels[i]).width + 36;
      rounded(ctx, { x: slot.x + 18, y: slot.y + 18, w, h: 44 }, 22);
      ctx.fillStyle = fills[i];
      ctx.fill();
      text(ctx, labels[i], slot.x + 18 + w / 2, slot.y + 49, ctx.font, C.surface);
    });

    const y = 116 + 3 * 576 + 8;
    place(ctx, art.kipli, 60, y + 6, 128);
    place(ctx, art.wordmark, 214, y + 22, 300);
    text(ctx, d.line, 214, y + 140, `400 54px ${d.fonts.display}`, C.ireng, "left");
    text(ctx, `kotek.app · ${d.date}`, 214, y + 186, `600 24px ${d.fonts.sans}`, C.goldText, "left");
    tumpal(ctx, 0, 2120, 720, 40, "up");
  },
};

export const frames: Frame[] = [gate, play, kipli, strip];

/** What Kipli says on a picture. One is picked for each one taken. */
export const kipliLines = [
  "Perfect!",
  "Nice one!",
  "Right on the beat!",
  "Again, faster!",
  "Locked in!",
];

export function pickLine() {
  return kipliLines[Math.floor(Math.random() * kipliLines.length)];
}

export function formatDate(at: Date) {
  return at.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** The site's fonts as canvas can name them, once they have loaded. */
export async function loadFonts(): Promise<Fonts> {
  const css = getComputedStyle(document.documentElement);
  const katibeh = css.getPropertyValue("--font-katibeh").trim() || "Georgia";
  const nunito = css.getPropertyValue("--font-nunito").trim();
  const fonts: Fonts = {
    display: `${katibeh}, Georgia, serif`,
    sans: `ui-rounded, "SF Pro Rounded", ${nunito ? `${nunito}, ` : ""}system-ui, sans-serif`,
  };
  await Promise.all([
    document.fonts.load(`400 40px ${fonts.display}`),
    document.fonts.load(`700 40px ${fonts.sans}`),
    document.fonts.load(`600 40px ${fonts.sans}`),
    document.fonts.load(`800 40px ${fonts.sans}`),
  ]).catch(() => undefined);
  return fonts;
}
