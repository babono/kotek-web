import type { RefObject } from "react";
import { wheelSlices } from "@/content/wheel";

/** Extra headroom above the circle for the pointer to sit in. */
const VIEW_W = 320;
const VIEW_H = 362;
const CX = 160;
const CY = 200;
const R = 138;
const SLICE_ANGLE = 360 / wheelSlices.length;

/** Pointer pivots at its head, so the tip swings when a divider knocks it. */
const HEAD_Y = 22;
const HEAD_R = 17;
const TIP_Y = 72;

const TONE_FILL = {
  sticker: "#c8a989",
  candy: "#8fa382",
  keychain: "#b99526",
} as const;

/** Degrees are measured clockwise from 12 o'clock, matching the pointer. */
function pointAt(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [
    +(CX + radius * Math.cos(rad)).toFixed(1),
    +(CY + radius * Math.sin(rad)).toFixed(1),
  ];
}

function wedgePath(start: number, end: number) {
  const [x1, y1] = pointAt(start, R);
  const [x2, y2] = pointAt(end, R);
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;
}

/** Studs around the rim, as on a fairground wheel. */
const STUDS = Array.from({ length: 12 }, (_, i) => pointAt(i * 30 + 15, R + 11));

export function WheelFace({
  wheelRef,
  pointerRef,
}: {
  wheelRef: RefObject<SVGGElement | null>;
  pointerRef: RefObject<SVGGElement | null>;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-full max-h-[34rem] w-full"
      role="img"
      aria-label="Prize wheel with ten wedges: five stickers, four candies and one keychain."
    >
      <defs>
        <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="5"
            floodColor="#2e2119"
            floodOpacity="0.28"
          />
        </filter>
        <clipPath id="wheelHubClip">
          <circle cx={CX} cy={CY} r="34" />
        </clipPath>
      </defs>

      {/* Static rim: stays put so its shadow does not spin with the wheel. */}
      <circle cx={CX} cy={CY} r={R + 18} fill="#2e2119" filter="url(#wheelShadow)" />
      {STUDS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#e1d9d0" opacity="0.45" />
      ))}

      {/* Only this group turns; the pointer above stays put. */}
      <g ref={wheelRef} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={CX} cy={CY} r={R + 1} fill="#faf8f5" />
        {wheelSlices.map((slice, i) => {
          const start = i * SLICE_ANGLE;
          const mid = start + SLICE_ANGLE / 2;
          const [tx, ty] = pointAt(mid, R * 0.62);
          /*
           * Labels run along the radius. At 36 degrees a wedge is far too
           * narrow to fit "Keychain" across it, but there is ample room
           * from the hub out to the rim.
           */
          const flip = mid > 180;
          const spin = mid - 90 + (flip ? 180 : 0);
          return (
            <g key={slice.id}>
              <path
                d={wedgePath(start, start + SLICE_ANGLE)}
                fill={TONE_FILL[slice.tone]}
                stroke="#faf8f5"
                strokeWidth="2"
              />
              <text
                x={tx}
                y={ty}
                fill="#2e2119"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${spin} ${tx} ${ty})`}
                fontFamily="var(--font-sans)"
              >
                {slice.label}
              </text>
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r="34" fill="#2e2119" stroke="#faf8f5" strokeWidth="3" />
        <image
          href="/kotek-logo.png"
          x={CX - 34}
          y={CY - 34}
          width="68"
          height="68"
          clipPath="url(#wheelHubClip)"
          preserveAspectRatio="xMidYMid slice"
        />
        <circle cx={CX} cy={CY} r="34" fill="none" stroke="#faf8f5" strokeWidth="3" />
      </g>

      {/* Pointer: rotates about its head as each divider knocks it aside. */}
      <g
        ref={pointerRef}
        style={{ transformOrigin: `${CX}px ${HEAD_Y}px` }}
      >
        <path
          d={`M ${CX} ${TIP_Y} L ${CX - HEAD_R} ${HEAD_Y} A ${HEAD_R} ${HEAD_R} 0 1 1 ${CX + HEAD_R} ${HEAD_Y} Z`}
          fill="#2e2119"
          filter="url(#wheelShadow)"
        />
        <circle cx={CX} cy={HEAD_Y} r="6.5" fill="#e1d9d0" />
      </g>
    </svg>
  );
}
