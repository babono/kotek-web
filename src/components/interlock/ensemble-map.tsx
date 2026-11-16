"use client";

import { createContext, useContext, useRef, useState } from "react";
import { ART, BAR, POST_LEFT, POST_RIGHT, RAIL } from "@/components/interlock/gangsa-art";
import { gangsaGuide } from "@/content/landing";

/**
 * The gamelan gong kebyar as a seating plan, every instrument built from the
 * app's own gangsa artwork: its carved gold posts, curled rail and orange
 * frame. The gangsa family is drawn in full colour, as on the hero; the rest
 * of the orchestra is the same carving, in quiet wood tones around it.
 *
 * Two plans of the same orchestra: a wide one, and a tall one for phones so
 * the labels stay readable. Units are the SVG's own.
 */

type Look = { on: boolean };

/** The gangsa's own colours, and the quiet ones for everything else. */
const paint = (on: boolean) =>
  on
    ? {
        post: "#e7b142",
        wood: "#df6d2f",
        bronze: "var(--kuning)",
        boss: "#e7b142",
        tooth: "var(--kuning)",
        inner: "var(--merah)",
      }
    : {
        post: "color-mix(in srgb, var(--garis) 45%, var(--surface))",
        wood: "color-mix(in srgb, var(--garis) 85%, var(--surface))",
        bronze: "var(--surface)",
        boss: "color-mix(in srgb, var(--garis) 45%, var(--surface))",
        tooth: "color-mix(in srgb, var(--garis) 45%, var(--surface))",
        inner: "var(--garis)",
      };

/**
 * Widens a path of the art by `dx`: every point right of the centre moves
 * right, so the carved ends keep their shape and only the middle grows.
 */
function stretch(d: string, dx: number) {
  if (dx === 0) return d;
  const tokens = d.match(/[MLCHVZ]|-?\d*\.?\d+/gi) ?? [];
  let command = "";
  let index = 0;
  return tokens
    .map((token) => {
      if (/[A-Z]/i.test(token)) {
        command = token.toUpperCase();
        index = 0;
        return token;
      }
      const value = Number(token);
      const isX = command === "H" || (command !== "V" && index % 2 === 0);
      index++;
      return String(isX && value > ART.centre ? +(value + dx).toFixed(3) : value);
    })
    .join(" ");
}

/** Gold teeth with a red tooth inside: the tumpal along the frame. */
function Tumpal({ from, to, y, on }: { from: number; to: number; y: number } & Look) {
  const c = paint(on);
  const size = 32;
  const count = Math.floor((to - from) / size);
  const start = from + (to - from - count * size) / 2;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = start + i * size;
        return (
          <g key={i}>
            <path d={`M${x} ${y}h${size}l${-size / 2} ${size * 0.62}z`} fill={c.tooth} />
            <path d={`M${x + size / 4} ${y}h${size / 2}l${-size / 4} ${size * 0.31}z`} fill={c.inner} />
          </g>
        );
      })}
    </>
  );
}

/**
 * The carved frame every keyed or kettle instrument shares, `dx` wider than
 * the gangsa, placed at `x, y` and scaled to `w` across.
 */
function Frame({
  x,
  y,
  w,
  dx = 0,
  on,
  children,
}: { x: number; y: number; w: number; dx?: number; children: React.ReactNode } & Look) {
  const c = paint(on);
  const k = w / (ART.width + dx);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={POST_LEFT} fill={c.post} />
      <path d={stretch(POST_RIGHT, dx)} fill={c.post} />
      <rect x={72} y={81} width={329.7 + dx} height={120} fill={c.wood} />
      <path d={stretch(RAIL, dx)} fill={c.wood} />
      <path d={stretch(BAR, dx)} fill={c.wood} />
      <Tumpal from={84} to={390 + dx} y={102} on={on} />
      <rect x={84} y={150} width={306 + dx} height={10} rx={5} fill={c.post} />
      {children}
    </g>
  );
}

/** A keyed instrument: the gangsa, or the larger jegogan and calung. */
function Keys({
  x,
  y,
  w,
  keys,
  dx = 0,
  on,
}: { x: number; y: number; w: number; keys: number; dx?: number } & Look) {
  const c = paint(on);
  const left = 82.5;
  const gap = keys > 6 ? 4 : 8;
  const key = (309 + dx - gap * (keys - 1)) / keys;
  return (
    <Frame x={x} y={y} w={w} dx={dx} on={on}>
      {Array.from({ length: keys }, (_, i) => (
        <rect
          key={i}
          x={left + i * (key + gap)}
          y={35.5}
          width={key}
          height={31}
          rx={3}
          fill={c.bronze}
          stroke={on ? undefined : "var(--garis)"}
          strokeWidth={on ? undefined : 3}
        />
      ))}
    </Frame>
  );
}

/** Kettle gongs in a row on the same carved rack: reyong and trompong. */
function Pots({ x, y, w, pots, dx }: { x: number; y: number; w: number; pots: number; dx: number }) {
  const c = paint(false);
  const step = (309 + dx) / pots;
  return (
    <Frame x={x} y={y} w={w} dx={dx} on={false}>
      {Array.from({ length: pots }, (_, i) => {
        const cx = 82.5 + step * (i + 0.5);
        return (
          <g key={i}>
            <ellipse cx={cx} cy={46} rx={step / 2 - 4} ry={15} fill={c.bronze} stroke="var(--garis)" strokeWidth={3} />
            <circle cx={cx} cy={33} r={8} fill={c.boss} stroke="var(--garis)" strokeWidth={3} />
          </g>
        );
      })}
    </Frame>
  );
}

/** The hanging gongs: the same posts, taller, under the curled rail as a beam. */
function Gongs({ x, y, w }: { x: number; y: number; w: number }) {
  const c = paint(false);
  const k = w / ART.width;
  const gongs = [
    { cx: 186, cy: 182, r: 80 },
    { cx: 334, cy: 170, r: 56 },
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <g transform="scale(1 1.4)">
        <path d={POST_LEFT} fill={c.post} />
        <path d={POST_RIGHT} fill={c.post} />
      </g>
      <path d={RAIL} fill={c.wood} transform="translate(0 -6)" />
      {gongs.map((g) => (
        <g key={g.cx}>
          <line x1={g.cx} x2={g.cx} y1={70} y2={g.cy - g.r} stroke="var(--garis)" strokeWidth={5} />
          <circle cx={g.cx} cy={g.cy} r={g.r} fill={c.bronze} stroke="var(--garis)" strokeWidth={4} />
          <circle cx={g.cx} cy={g.cy} r={g.r * 0.66} fill="none" stroke="var(--garis)" strokeWidth={3} />
          <circle cx={g.cx} cy={g.cy} r={g.r * 0.26} fill={c.boss} stroke="var(--garis)" strokeWidth={4} />
        </g>
      ))}
    </g>
  );
}

/** A two-headed drum, laced along its body. */
function Kendang({ x, y, w }: { x: number; y: number; w: number }) {
  const c = paint(false);
  const k = w / 200;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M18 8 Q100 -10 182 8 V72 Q100 90 18 72 Z" fill={c.wood} />
      <path
        d="M30 6 L48 74 L66 2 L84 78 L102 0 L120 78 L138 2 L156 76 L172 6"
        fill="none"
        stroke={c.post}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <ellipse cx={18} cy={40} rx={14} ry={32} fill={c.post} stroke="var(--garis)" strokeWidth={4} />
      <ellipse cx={182} cy={40} rx={12} ry={32} fill={c.post} stroke="var(--garis)" strokeWidth={4} />
    </g>
  );
}

/** Ceng-ceng: small cymbals face up on a carved base, two more in hand. */
function Cengceng({ x, y, w }: { x: number; y: number; w: number }) {
  const c = paint(false);
  const k = w / 200;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M10 52 Q10 30 40 30 H170 Q190 30 194 44 L198 52 V70 Q198 78 190 78 H18 Q10 78 10 70 Z" fill={c.wood} />
      <Tumpal from={24} to={184} y={56} on={false} />
      {[48, 84, 120, 156].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={26} rx={17} ry={7} fill={c.bronze} stroke="var(--garis)" strokeWidth={3} />
          <circle cx={cx} cy={21} r={4} fill={c.boss} stroke="var(--garis)" strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

/** The bamboo flute, its nodes and holes. */
function Suling({ x, y, w }: { x: number; y: number; w: number }) {
  const c = paint(false);
  const k = w / 200;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={0} y={0} width={200} height={18} rx={9} fill={c.post} stroke="var(--garis)" strokeWidth={3} />
      {[40, 150].map((nx) => (
        <rect key={nx} x={nx} y={0} width={6} height={18} fill="var(--garis)" />
      ))}
      {[70, 88, 106, 124].map((hx) => (
        <circle key={hx} cx={hx} cy={9} r={3.5} fill="var(--garis)" />
      ))}
    </g>
  );
}

function Label({ x, y, on = false, children }: { x: number; y: number; on?: boolean; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={on ? 18 : 15.5}
      fontWeight={on ? 700 : 600}
      fill={on ? "var(--ireng)" : "var(--description)"}
    >
      {children}
    </text>
  );
}

/** The dashed ring round the gangsa, and its red tab. */
function Family({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={26}
        fill="var(--surface)"
        stroke="var(--merah)"
        strokeWidth={2.5}
        strokeDasharray="9 7"
      />
      <rect x={x + 16} y={y - 16} width={166} height={34} rx={17} fill="var(--merah)" />
      <text x={x + 99} y={y + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--surface)">
        {gangsaGuide.family}
      </text>
    </g>
  );
}

/** A row of the same instrument, evenly spaced. */
function Row({
  x,
  y,
  w,
  gap,
  count,
  keys,
  dx,
  on,
}: { x: number; y: number; w: number; gap: number; count: number; keys: number; dx?: number } & Look) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Keys key={i} x={x + i * (w + gap)} y={y} w={w} keys={keys} dx={dx} on={on} />
      ))}
    </>
  );
}

type Part = keyof typeof gangsaGuide.parts;
type Box = { x: number; y: number; w: number; h: number };

/** Which part is pointed at, and how a group reports it. */
const Pointing = createContext<{
  active: Part | null;
  point: (part: Part | null, target?: Element) => void;
}>({ active: null, point: () => {} });

/**
 * One instrument group: its drawing and label, over a hit box that covers the
 * whole group, so the pointer doesn't fall through the gaps between rows.
 * Hover, focus and tap all show its part.
 */
function Group({ part, box, children }: { part: Part; box: Box; children: React.ReactNode }) {
  const { active, point } = useContext(Pointing);
  const { name, gloss } = gangsaGuide.parts[part];
  const on = active === part;
  // Taps move focus too, after the tap is handled: only keyboard focus counts.
  const keyboard = useRef(false);
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${name}. ${gloss}`}
      aria-pressed={on}
      className="cursor-pointer outline-none"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") point(part, event.currentTarget);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") point(null);
      }}
      // A tap toggles; a mouse click keeps what hovering already shows.
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") point(on ? null : part, event.currentTarget);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && on) {
          event.stopPropagation();
          event.preventDefault();
          point(null);
        }
      }}
      // Keyboard focus only: a tap focuses too, and is handled above.
      onFocus={(event) => {
        keyboard.current = event.currentTarget.matches(":focus-visible");
        if (keyboard.current) point(part, event.currentTarget);
      }}
      onBlur={() => {
        if (keyboard.current) point(null);
        keyboard.current = false;
      }}
    >
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={16}
        fill={on ? "var(--kuning)" : "transparent"}
        fillOpacity={on ? 0.22 : 0}
        stroke={on ? "var(--kuning)" : "none"}
        strokeWidth={2}
      />
      {children}
    </g>
  );
}

const ARIA =
  "A seating plan of the gamelan gong kebyar, with the gangsa family highlighted. Choose an instrument to hear what it plays.";

/** The jegogan and calung: fewer, wider keys on a narrower frame. */
const LOW = -80;

function Wide() {
  return (
    <svg viewBox="0 0 960 482" role="group" aria-label={ARIA} className="hidden w-full font-sans sm:block">
      <Family x={16} y={26} w={604} h={316} />
      <Group part="ugal" box={{ x: 236, y: 50, w: 168, h: 100 }}>
        <Keys x={246} y={58} w={148} keys={10} on />
        <Label x={320} y={142} on>Ugal</Label>
      </Group>
      <Group part="pemade" box={{ x: 36, y: 152, w: 568, h: 88 }}>
        <Row x={46} y={160} w={124} gap={14} count={4} keys={10} on />
        <Label x={318} y={232} on>Pemadé ×4</Label>
      </Group>
      <Group part="kantilan" box={{ x: 48, y: 242, w: 544, h: 88 }}>
        <Row x={58} y={248} w={112} gap={22} count={4} keys={10} on />
        <Label x={318} y={322} on>Kantilan ×4</Label>
      </Group>

      <Group part="jegogan" box={{ x: 640, y: 16, w: 300, h: 102 }}>
        <Row x={650} y={24} w={130} gap={18} count={2} keys={5} dx={LOW} on={false} />
        <Label x={798} y={110}>Jegogan ×2</Label>
      </Group>
      <Group part="calung" box={{ x: 656, y: 120, w: 284, h: 84 }}>
        <Row x={668} y={124} w={106} gap={48} count={2} keys={5} dx={LOW} on={false} />
        <Label x={798} y={196}>Calung ×2</Label>
      </Group>
      <Group part="gong" box={{ x: 680, y: 206, w: 244, h: 166 }}>
        <Gongs x={696} y={214} w={210} />
        <Label x={801} y={364}>Gong and kempur</Label>
      </Group>

      <Group part="trompong" box={{ x: 16, y: 378, w: 266, h: 96 }}>
        <Pots x={24} y={386} w={250} pots={10} dx={330} />
        <Label x={149} y={466}>Trompong</Label>
      </Group>
      <Group part="reyong" box={{ x: 288, y: 378, w: 324, h: 96 }}>
        <Pots x={296} y={386} w={308} pots={12} dx={520} />
        <Label x={450} y={466}>Reyong</Label>
      </Group>
      <Group part="kendang" box={{ x: 618, y: 392, w: 168, h: 82 }}>
        <Kendang x={628} y={408} w={70} />
        <Kendang x={706} y={408} w={70} />
        <Label x={702} y={466}>Kendang ×2</Label>
      </Group>
      <Group part="cengceng" box={{ x: 788, y: 392, w: 84, h: 82 }}>
        <Cengceng x={796} y={410} w={66} />
        <Label x={829} y={466}>Ceng-ceng</Label>
      </Group>
      <Group part="suling" box={{ x: 874, y: 392, w: 76, h: 82 }}>
        <Suling x={876} y={426} w={70} />
        <Label x={911} y={466}>Suling</Label>
      </Group>
    </svg>
  );
}

function Tall() {
  return (
    <svg viewBox="0 0 400 720" role="group" aria-label={ARIA} className="w-full font-sans sm:hidden">
      <Family x={8} y={22} w={384} h={292} />
      <Group part="ugal" box={{ x: 128, y: 44, w: 144, h: 94 }}>
        <Keys x={138} y={52} w={124} keys={10} on />
        <Label x={200} y={128} on>Ugal</Label>
      </Group>
      <Group part="pemade" box={{ x: 12, y: 140, w: 376, h: 68 }}>
        <Row x={18} y={146} w={84} gap={8} count={4} keys={10} on />
        <Label x={200} y={200} on>Pemadé ×4</Label>
      </Group>
      <Group part="kantilan" box={{ x: 16, y: 218, w: 368, h: 70 }}>
        <Row x={24} y={226} w={78} gap={12} count={4} keys={10} on />
        <Label x={200} y={280} on>Kantilan ×4</Label>
      </Group>

      <Group part="jegogan" box={{ x: 8, y: 342, w: 196, h: 82 }}>
        <Row x={14} y={352} w={88} gap={8} count={2} keys={5} dx={LOW} on={false} />
        <Label x={106} y={416}>Jegogan ×2</Label>
      </Group>
      <Group part="calung" box={{ x: 206, y: 342, w: 186, h: 82 }}>
        <Row x={214} y={358} w={80} gap={10} count={2} keys={5} dx={LOW} on={false} />
        <Label x={299} y={416}>Calung ×2</Label>
      </Group>

      <Group part="reyong" box={{ x: 4, y: 440, w: 212, h: 70 }}>
        <Pots x={12} y={448} w={196} pots={12} dx={520} />
        <Label x={110} y={502}>Reyong</Label>
      </Group>
      <Group part="gong" box={{ x: 218, y: 436, w: 178, h: 162 }}>
        <Gongs x={226} y={444} w={164} />
        <Label x={308} y={590}>Gong and kempur</Label>
      </Group>
      <Group part="trompong" box={{ x: 4, y: 520, w: 212, h: 78 }}>
        <Pots x={12} y={528} w={196} pots={10} dx={330} />
        <Label x={110} y={590}>Trompong</Label>
      </Group>

      <Group part="kendang" box={{ x: 8, y: 616, w: 152, h: 84 }}>
        <Kendang x={16} y={628} w={64} />
        <Kendang x={88} y={628} w={64} />
        <Label x={84} y={692}>Kendang ×2</Label>
      </Group>
      <Group part="cengceng" box={{ x: 170, y: 616, w: 96, h: 84 }}>
        <Cengceng x={186} y={630} w={64} />
        <Label x={218} y={692}>Ceng-ceng</Label>
      </Group>
      <Group part="suling" box={{ x: 278, y: 616, w: 114, h: 84 }}>
        <Suling x={290} y={646} w={90} />
        <Label x={335} y={692}>Suling</Label>
      </Group>
    </svg>
  );
}

/** Where the tooltip sits: centred over its group, or under it near the top. */
type Tip = { part: Part; x: number; top: number; bottom: number; below: boolean };

export function EnsembleMap() {
  const stage = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const point = (part: Part | null, target?: Element) => {
    const box = stage.current?.getBoundingClientRect();
    if (!part || !target || !box) {
      setTip(null);
      return;
    }
    // The hit box, not the drawing: the same edges whatever is inside.
    const r = (target.firstElementChild ?? target).getBoundingClientRect();
    setTip({
      part,
      x: r.left + r.width / 2 - box.left,
      top: r.top - box.top,
      bottom: r.bottom - box.top,
      below: r.top - box.top < 110,
    });
  };

  const shown = tip ? gangsaGuide.parts[tip.part] : null;

  return (
    <Pointing.Provider value={{ active: tip?.part ?? null, point }}>
      <div
        ref={stage}
        className="relative"
        // A tap anywhere off the instruments puts the tooltip away.
        onPointerUp={(event) => {
          if (!(event.target as Element).closest("[role=button]")) point(null);
        }}
      >
        <Wide />
        <Tall />
        {tip && shown ? (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 w-60 rounded-2xl bg-ireng px-4 py-3 text-left text-putih shadow-lg"
            style={{
              left: `clamp(0px, calc(${tip.x}px - 7.5rem), calc(100% - 15rem))`,
              top: tip.below ? tip.bottom + 8 : tip.top - 8,
              transform: tip.below ? undefined : "translateY(-100%)",
            }}
          >
            <p className="flex items-baseline justify-between gap-2 text-[1rem] font-semibold">
              {shown.name}
              {"count" in shown ? (
                <span className="text-[0.8125rem] font-semibold text-putih/60">{shown.count}</span>
              ) : null}
            </p>
            <p className="mt-0.5 text-[0.875rem] leading-snug text-putih/80">{shown.gloss}</p>
          </div>
        ) : null}
      </div>
    </Pointing.Provider>
  );
}
