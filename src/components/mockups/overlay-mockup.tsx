/**
 * The hero visual: a stylised top-down view of a gangsa as Kotek sees it
 * through the camera, with the guidance overlay drawn on top.
 * Key states follow the app's overlay tokens — idle, approaching, strike, hit.
 */

const KEY_COUNT = 10;
const KEY_WIDTH = 44;
const KEY_GAP = 14;
const TRACK_WIDTH = KEY_COUNT * KEY_WIDTH + (KEY_COUNT - 1) * KEY_GAP;
const START_X = (800 - TRACK_WIDTH) / 2;
const CENTER_Y = 232;

type KeyState = "idle" | "approaching" | "strike" | "hit";

const STATES: Record<number, KeyState> = {
  1: "hit",
  3: "strike",
  6: "approaching",
};

function keyGeometry(index: number) {
  const height = 214 - index * 8;
  return {
    x: START_X + index * (KEY_WIDTH + KEY_GAP),
    y: CENTER_Y - height / 2,
    width: KEY_WIDTH,
    height,
  };
}

export function OverlayMockup() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="h-full w-full"
      role="img"
      aria-label="Kotek's camera view of a gangsa, with the next key to strike highlighted and an approach track along the bottom of the screen."
    >
      <defs>
        <linearGradient id="feed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2b21" />
          <stop offset="100%" stopColor="#241a13" />
        </linearGradient>
        <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7d6129" />
          <stop offset="55%" stopColor="#634b20" />
          <stop offset="100%" stopColor="#4b3919" />
        </linearGradient>
        <linearGradient id="strikeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c86a" />
          <stop offset="100%" stopColor="#b99526" />
        </linearGradient>
        <filter id="strikeGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* camera feed */}
      <rect width="800" height="450" fill="url(#feed)" />

      {/* instrument frame */}
      <rect
        x={START_X - 34}
        y={72}
        width={TRACK_WIDTH + 68}
        height={320}
        rx={22}
        fill="#4a3527"
      />
      <rect
        x={START_X - 20}
        y={86}
        width={TRACK_WIDTH + 40}
        height={292}
        rx={16}
        fill="#332419"
      />

      {/* bronze keys with their overlay state */}
      {Array.from({ length: KEY_COUNT }, (_, i) => {
        const { x, y, width, height } = keyGeometry(i);
        const state = STATES[i] ?? "idle";
        const stroke =
          state === "hit"
            ? "#a8c39a"
            : state === "strike"
              ? "#f0d685"
              : "#c8a989";
        const strokeWidth = state === "idle" ? 1.5 : 3;
        const strokeOpacity = state === "idle" ? 0.3 : 1;
        // "approaching" fills from the bottom up as the note gets closer
        const fillHeight = state === "approaching" ? height * 0.55 : 0;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={9}
              fill="url(#bronze)"
            />
            {state === "strike" ? (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={9}
                fill="url(#strikeFill)"
                filter="url(#strikeGlow)"
              />
            ) : null}
            {fillHeight > 0 ? (
              <rect
                x={x}
                y={y + height - fillHeight}
                width={width}
                height={fillHeight}
                rx={9}
                fill="#b99526"
                opacity={0.6}
              />
            ) : null}
            {state === "hit" ? (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={9}
                fill="#728868"
                opacity={0.6}
              />
            ) : null}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={9}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
            />
          </g>
        );
      })}

      {/* "strike now" callout above the active key */}
      {(() => {
        const { x, y, width } = keyGeometry(3);
        return (
          <g>
            <rect
              x={x + width / 2 - 46}
              y={y - 46}
              width={92}
              height={30}
              rx={15}
              fill="#e8c86a"
            />
            <text
              x={x + width / 2}
              y={y - 26}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#2e2119"
              fontFamily="var(--font-display), sans-serif"
            >
              Strike
            </text>
          </g>
        );
      })()}

      {/* HUD — mode chip and running accuracy */}
      <g>
        <rect
          x="34"
          y="30"
          width="140"
          height="34"
          rx="17"
          fill="#2e2119"
          opacity="0.75"
        />
        <circle cx="54" cy="47" r="5" fill="#b99526" />
        <text
          x="68"
          y="52"
          fontSize="14"
          fill="#e1d9d0"
          fontFamily="var(--font-sans), sans-serif"
        >
          Sangsih · 80 bpm
        </text>
      </g>
      <g>
        <rect
          x="638"
          y="30"
          width="128"
          height="34"
          rx="17"
          fill="#2e2119"
          opacity="0.75"
        />
        <text
          x="658"
          y="52"
          fontSize="14"
          fill="#8fae82"
          fontFamily="var(--font-sans), sans-serif"
        >
          Perfect ×12
        </text>
      </g>

      {/* approach track along the bottom edge */}
      <rect
        x="34"
        y="404"
        width="732"
        height="18"
        rx="9"
        fill="#2e2119"
        opacity="0.7"
      />
      <rect
        x="34"
        y="404"
        width="256"
        height="18"
        rx="9"
        fill="#b99526"
        opacity="0.35"
      />
      {[290, 356, 422, 488, 554, 620, 686].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={413}
          r={i === 0 ? 8 : 5.5}
          fill={i === 0 ? "#e8c86a" : "#c8a989"}
          opacity={i === 0 ? 1 : 0.5 - i * 0.05}
        />
      ))}
      <rect
        x="286"
        y="396"
        width="3"
        height="34"
        rx="1.5"
        fill="#e1d9d0"
        opacity="0.85"
      />
    </svg>
  );
}
