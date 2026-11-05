const BILAH = { count: 6, left: 18, top: 46, width: 56, height: 72, gap: 8 };
const DISC_Y = BILAH.top + BILAH.height + 15;
const BUS_Y = 212;
const CONTROLLER = { x: 436, y: 172, width: 118, height: 66 };
const PHONE = { x: 628, y: 58, width: 92, height: 180 };
/** The bilah struck in turn: not in order, as nobody plays in order. */
const ORDER = [3, 1, 4, 2];

const bilahX = (key: number) => BILAH.left + key * (BILAH.width + BILAH.gap);
const centre = (key: number) => bilahX(key) + BILAH.width / 2;

const wire = (key: number) =>
  `M${centre(key)} ${DISC_Y} V${BUS_Y} H${CONTROLLER.x}`;

/** A strike as a piezo sees it: a sharp spike that rings away to nothing. */
const WAVE = { x: 442, y: 74, width: 150, height: 28 };
const wave = Array.from({ length: 151 }, (_, i) => {
  const t = i / 150;
  const y = Math.exp(-t * 5) * Math.sin(t * 58) * WAVE.height;
  return `${i === 0 ? "M" : "L"}${(WAVE.x + t * WAVE.width).toFixed(1)} ${(WAVE.y - y).toFixed(1)}`;
}).join(" ");

/**
 * One strike's journey, from mallet to phone. Everything moving is in here and
 * is CSS (`.sensor-*` in globals.css), replayed by remounting: the popup keys
 * this on the strike, so each one starts clean on another bilah.
 */
export function SensorDiagram({ strike }: { strike: number }) {
  const key = ORDER[strike % ORDER.length];
  const x = centre(key);

  return (
    <svg
      viewBox="0 0 740 252"
      role="img"
      aria-label="A mallet strikes a bilah. The piezo disc under it feels the vibration, and a signal runs along its wire to a controller, which sends it to the phone by Bluetooth."
      className="w-full font-sans"
    >
      {/* The wires, one from each disc. */}
      {Array.from({ length: BILAH.count }, (_, i) => (
        <path
          key={i}
          d={wire(i)}
          fill="none"
          stroke="var(--garis)"
          strokeWidth={1.5}
        />
      ))}
      <path
        d={wire(key)}
        pathLength={1}
        fill="none"
        stroke="var(--merah)"
        strokeWidth={3}
        strokeLinecap="round"
        className="sensor-signal"
      />

      <text x={BILAH.left} y={BUS_Y + 22} fontSize={13} fontWeight={600} fill="var(--description)">
        One piezo disc under each bilah
      </text>

      {/* The bilah on their rail, a disc under each. */}
      <rect x={8} y={74} width={bilahX(BILAH.count - 1) + BILAH.width + 2} height={16} rx={4} fill="#df6d2f" />
      {Array.from({ length: BILAH.count }, (_, i) => (
        <g key={i}>
          <rect
            x={bilahX(i)}
            y={BILAH.top}
            width={BILAH.width}
            height={BILAH.height}
            rx={8}
            fill="var(--kuning)"
          />
          <circle cx={centre(i)} cy={DISC_Y} r={11} fill="#cccccc" stroke="#be8b1c" strokeWidth={3} />
        </g>
      ))}

      {/* The strike. */}
      <rect
        x={bilahX(key)}
        y={BILAH.top}
        width={BILAH.width}
        height={BILAH.height}
        rx={8}
        fill="var(--key-highlight)"
        className="sensor-bilah"
      />
      {[0.4, 0.58].map((delay) => (
        <circle
          key={delay}
          cx={x}
          cy={DISC_Y}
          r={14}
          fill="none"
          stroke="var(--merah)"
          strokeWidth={2}
          className="sensor-ripple"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <image
        href="/art/mallet.svg"
        x={x - 26}
        y={BILAH.top + 18 - 43}
        width={102}
        height={76}
        className="sensor-mallet"
      />

      {/* The vibration, as the disc sees it. */}
      <rect x={WAVE.x - 8} y={30} width={WAVE.width + 16} height={92} rx={12} fill="var(--surface)" />
      <text x={WAVE.x} y={21} fontSize={13} fontWeight={600} fill="var(--description)">
        What the disc feels
      </text>
      <line x1={WAVE.x} x2={WAVE.x + WAVE.width} y1={WAVE.y} y2={WAVE.y} stroke="var(--garis)" />
      <path d={wave} pathLength={1} fill="none" stroke="var(--merah)" strokeWidth={2} className="sensor-wave" />

      {/* The controller. */}
      <rect {...CONTROLLER} rx={14} fill="var(--ireng)" />
      <text
        x={CONTROLLER.x + CONTROLLER.width / 2}
        y={CONTROLLER.y + CONTROLLER.height / 2 + 5}
        textAnchor="middle"
        fontSize={15}
        fontWeight={600}
        fill="var(--putih)"
      >
        Controller
      </text>

      {/* Bluetooth, through the air. */}
      {[0, 1, 2].map((arc) => {
        const cx = CONTROLLER.x + CONTROLLER.width + 4;
        const cy = CONTROLLER.y + CONTROLLER.height / 2;
        const r = 16 + arc * 16;
        return (
          <path
            key={arc}
            d={`M${cx + r * 0.7} ${cy - r * 0.7} A${r} ${r} 0 0 1 ${cx + r * 0.7} ${cy + r * 0.7}`}
            fill="none"
            stroke="var(--sangsih)"
            strokeWidth={3}
            strokeLinecap="round"
            className="sensor-air"
            style={{ animationDelay: `${1.75 + arc * 0.18}s` }}
          />
        );
      })}
      <text x={CONTROLLER.x + CONTROLLER.width + 38} y={CONTROLLER.y + CONTROLLER.height + 12} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--description)">
        Bluetooth
      </text>

      {/* The phone: the bilah that was struck, named. */}
      <rect {...PHONE} rx={15} fill="var(--ireng)" />
      <rect x={PHONE.x + 5} y={PHONE.y + 5} width={PHONE.width - 10} height={PHONE.height - 10} rx={11} fill="var(--putih)" />
      <g className="sensor-hit">
        <text x={PHONE.x + PHONE.width / 2} y={PHONE.y + 66} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--description)">
          Bilah
        </text>
        <text x={PHONE.x + PHONE.width / 2} y={PHONE.y + 104} textAnchor="middle" fontSize={38} fontFamily="var(--font-display)" fill="var(--ireng)">
          {key + 1}
        </text>
        <rect x={PHONE.x + 22} y={PHONE.y + 122} width={PHONE.width - 44} height={10} rx={4} fill="var(--kuning)" />
      </g>
    </svg>
  );
}
