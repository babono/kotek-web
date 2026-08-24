/**
 * The hero visual: the Gomelan play screen as it looks on the phone — camera
 * feed with the key overlay, the polos/sangsih controls, and the note track
 * running under the playhead. Modelled on the app's own guidance screen.
 */

/** Key outlines as the camera sees them, angled slightly by the mount. */
const KEYS = [
  { x: 132, y: 172, w: 84, h: 244 },
  { x: 232, y: 166, w: 84, h: 252 },
  { x: 332, y: 178, w: 84, h: 238 },
  { x: 432, y: 160, w: 84, h: 258 },
  { x: 532, y: 150, w: 88, h: 272, active: true },
  { x: 636, y: 174, w: 84, h: 242 },
  { x: 736, y: 186, w: 84, h: 228 },
];

/** Interlocking figure: polos on the beat, sangsih in the gaps between. */
const TRACK_START = 96;
const TRACK_STEP = 54;
const ROW_Y = [402, 426, 450, 474];

const NOTES = [
  { slot: 0, row: 1, part: "polos", label: "5" },
  { slot: 1, row: 2, part: "sangsih" },
  { slot: 2, row: 0, part: "polos", label: "6" },
  { slot: 3, row: 2, part: "sangsih" },
  { slot: 4, row: 1, part: "polos", label: "5" },
  { slot: 5, row: 3, part: "sangsih" },
  { slot: 6, row: 1, part: "polos", label: "5" },
  { slot: 7, row: 2, part: "sangsih" },
  { slot: 8, row: 0, part: "polos", label: "6", current: true },
  { slot: 9, row: 2, part: "sangsih" },
  { slot: 10, row: 2, part: "polos", label: "4" },
  { slot: 11, row: 3, part: "sangsih" },
  { slot: 12, row: 1, part: "polos", label: "5" },
  { slot: 13, row: 2, part: "sangsih" },
  { slot: 14, row: 2, part: "polos", label: "4" },
] as const;

const PLAYHEAD_X = TRACK_START + 8 * TRACK_STEP + 22;

export function OverlayMockup() {
  return (
    <svg
      viewBox="0 0 960 540"
      className="h-full w-full"
      role="img"
      aria-label="The Gomelan play screen: a camera view of a gangsa with the next key outlined in cream, a polos and sangsih toggle, and a track of interlocking blue and purple notes running under the playhead."
    >
      <defs>
        <linearGradient id="feed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12100a" />
          <stop offset="100%" stopColor="#080702" />
        </linearGradient>
        <radialGradient id="keyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f6e3ac" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f6e3ac" stopOpacity="0.04" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* live camera feed */}
      <rect width="960" height="540" fill="url(#feed)" />

      {/* the gangsa keys, outlined where the app has mapped them */}
      {KEYS.map((key, i) => (
        <g key={i}>
          {key.active ? (
            <>
              <rect
                x={key.x}
                y={key.y}
                width={key.w}
                height={key.h}
                rx={16}
                fill="url(#keyGlow)"
              />
              <rect
                x={key.x}
                y={key.y}
                width={key.w}
                height={key.h}
                rx={16}
                fill="none"
                stroke="#f6e3ac"
                strokeWidth={3}
                filter="url(#glow)"
              />
            </>
          ) : (
            <rect
              x={key.x}
              y={key.y}
              width={key.w}
              height={key.h}
              rx={16}
              fill="none"
              stroke="#c9a063"
              strokeWidth={1.5}
              strokeOpacity={0.42}
            />
          )}
        </g>
      ))}

      {/* top bar */}
      <rect width="960" height="54" fill="#302822" />
      <rect y="53" width="960" height="1" fill="#c9a063" fillOpacity="0.18" />
      <text
        x="28"
        y="34"
        fill="#c9a063"
        fontSize="15"
        fontWeight="600"
        letterSpacing="2.6"
        fontFamily="var(--font-sans)"
      >
        NGECOG
      </text>
      <text
        x="480"
        y="34"
        fill="#d9b896"
        fillOpacity="0.8"
        fontSize="15"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
      >
        Cycle 2 · 86%
      </text>
      <rect x="832" y="12" width="42" height="30" rx="15" fill="#c9a063" />
      <rect x="845" y="21" width="16" height="12" rx="3" fill="#302822" />
      <rect
        x="886"
        y="12"
        width="42"
        height="30"
        rx="10"
        fill="none"
        stroke="#c9a063"
        strokeOpacity="0.55"
      />
      <rect x="900" y="20" width="4" height="14" rx="1.5" fill="#c9a063" />
      <rect x="910" y="20" width="4" height="14" rx="1.5" fill="#c9a063" />

      {/* translucent control panel over the lower half of the feed */}
      <rect y="318" width="960" height="222" fill="#2a221b" fillOpacity="0.9" />

      {/* role toggle */}
      <rect
        x="96"
        y="336"
        width="196"
        height="40"
        rx="20"
        fill="none"
        stroke="#c9a063"
        strokeOpacity="0.4"
      />
      <rect x="100" y="340" width="94" height="32" rx="16" fill="#c9a063" />
      <text
        x="147"
        y="361"
        fill="#2a221b"
        fontSize="13"
        fontWeight="700"
        letterSpacing="1.4"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
      >
        POLOS
      </text>
      <text
        x="243"
        y="361"
        fill="#d9b896"
        fillOpacity="0.75"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.4"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
      >
        SANGSIH
      </text>

      {/* tempo */}
      <rect
        x="306"
        y="336"
        width="74"
        height="40"
        rx="20"
        fill="none"
        stroke="#c9a063"
        strokeOpacity="0.4"
      />
      <text
        x="343"
        y="361"
        fill="#d9b896"
        fontSize="13"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
      >
        1×
      </text>

      {/* legend */}
      <rect
        x="628"
        y="336"
        width="150"
        height="40"
        rx="20"
        fill="none"
        stroke="#c9a063"
        strokeOpacity="0.3"
      />
      <rect x="646" y="348" width="18" height="16" rx="4" fill="#5fa8d3" />
      <text
        x="674"
        y="361"
        fill="#e8dcc4"
        fontSize="13"
        fontWeight="600"
        fontFamily="var(--font-sans)"
      >
        Polos · you
      </text>
      <rect
        x="790"
        y="336"
        width="128"
        height="40"
        rx="20"
        fill="none"
        stroke="#c9a063"
        strokeOpacity="0.3"
      />
      <rect
        x="808"
        y="348"
        width="18"
        height="16"
        rx="4"
        fill="none"
        stroke="#a97cd1"
        strokeWidth="2"
      />
      <text
        x="836"
        y="361"
        fill="#e8dcc4"
        fillOpacity="0.8"
        fontSize="13"
        fontWeight="600"
        fontFamily="var(--font-sans)"
      >
        Sangsih
      </text>

      {/* note track */}
      <rect x="96" y="392" width="824" height="1" fill="#c9a063" fillOpacity="0.16" />
      {NOTES.map((note) => {
        const x = TRACK_START + note.slot * TRACK_STEP;
        const y = ROW_Y[note.row];
        const isPolos = note.part === "polos";
        return (
          <g key={note.slot}>
            <rect
              x={x}
              y={y}
              width={44}
              height={20}
              rx={5}
              fill={isPolos ? "#5fa8d3" : "#a97cd1"}
              fillOpacity={"current" in note && note.current ? 1 : 0.9}
            />
            {"current" in note && note.current ? (
              <rect
                x={x - 3}
                y={y - 3}
                width={50}
                height={26}
                rx={7}
                fill="none"
                stroke="#f6e3ac"
                strokeWidth={2}
              />
            ) : null}
            {"label" in note && note.label ? (
              <text
                x={x + 22}
                y={y + 15}
                fill="#12100a"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="var(--font-sans)"
              >
                {note.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* playhead */}
      <rect
        x={PLAYHEAD_X}
        y="386"
        width="2"
        height="122"
        fill="#f6e3ac"
        fillOpacity="0.9"
      />

      {/* beat markers */}
      {Array.from({ length: 15 }, (_, i) => {
        const cx = TRACK_START + i * TRACK_STEP + 22;
        const onBeat = i === 8;
        return (
          <circle
            key={i}
            cx={cx}
            cy={518}
            r={onBeat ? 6 : 4}
            fill={onBeat ? "#c9a063" : "none"}
            stroke="#c9a063"
            strokeOpacity={onBeat ? 1 : 0.4}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}
