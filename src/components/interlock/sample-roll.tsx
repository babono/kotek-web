import { kotekanSample, type Voice } from "@/content/kotekan";

const COLOUR: Record<Voice, string> = {
  polos: "var(--merah)",
  sangsih: "var(--sangsih)",
};

const rows = [7, 6, 5, 4];
const columns = kotekanSample.polos.length;
const CELL = 24;
/** Room round the edge for the gold ring. */
const MARGIN = 7;
const SIDE = CELL * 0.78;

const strokes = Array.from({ length: columns }, (_, slot) => {
  const voice: Voice = slot % 2 === 0 ? "polos" : "sangsih";
  const key = kotekanSample[voice][slot] as number;
  return {
    slot,
    voice,
    x: MARGIN + (slot + 0.5) * CELL,
    y: MARGIN + (rows.indexOf(key) + 0.5) * CELL,
  };
});

/**
 * `KotekanSampleRoll` from the app's "How kotekan works" guide: the sample on
 * its bilah, low to high up the side, time left to right. The card's half is
 * solid and the other a dashed ghost in its own colour, so the gaps one half
 * leaves are seen being filled by the other. Together joins the strokes with a
 * thread, the one line they make. The slot sounding is ringed in gold.
 */
export function SampleRoll({
  voices,
  slot,
}: {
  voices: readonly Voice[];
  slot: number | null;
}) {
  const width = MARGIN * 2 + columns * CELL;
  const height = MARGIN * 2 + rows.length * CELL;
  const together = voices.length > 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-hidden>
      {rows.map((_, row) => {
        const y = MARGIN + (row + 0.5) * CELL;
        return (
          <line
            key={row}
            x1={MARGIN}
            x2={width - MARGIN}
            y1={y}
            y2={y}
            stroke="var(--garis)"
          />
        );
      })}

      {together ? (
        <polyline
          points={strokes.map((s) => `${s.x},${s.y}`).join(" ")}
          fill="none"
          stroke="var(--ireng)"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      ) : null}

      {strokes.map((stroke) => {
        const solid = voices.includes(stroke.voice);
        const box = {
          x: stroke.x - SIDE / 2,
          y: stroke.y - SIDE / 2,
          width: SIDE,
          height: SIDE,
          rx: SIDE * 0.22,
        };
        return (
          <g key={stroke.slot}>
            {solid ? (
              <rect {...box} fill={COLOUR[stroke.voice]} />
            ) : (
              <rect
                {...box}
                fill={COLOUR[stroke.voice]}
                fillOpacity={0.08}
                stroke={COLOUR[stroke.voice]}
                strokeOpacity={0.55}
                strokeWidth={1.2}
                strokeDasharray="3 2"
              />
            )}
            {stroke.slot === slot && solid ? (
              <rect
                x={box.x - 3}
                y={box.y - 3}
                width={SIDE + 6}
                height={SIDE + 6}
                rx={SIDE * 0.3}
                fill="none"
                stroke="var(--kuning)"
                strokeWidth={2.5}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
