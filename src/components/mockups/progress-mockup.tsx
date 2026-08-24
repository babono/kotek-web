import { Panel } from "@/components/mockups/panel";

/** Best eight cycles in a row — the run that sets a record. */
const CYCLES = [58, 64, 61, 72, 78, 74, 85, 92];

const CHART_W = 420;
const CHART_H = 56;

function pointFor(value: number, i: number) {
  const x = (i / (CYCLES.length - 1)) * CHART_W;
  const y = CHART_H - (value / 100) * CHART_H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
}

export function ProgressMockup() {
  const points = CYCLES.map(pointFor);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <Panel label="The app's result screen: 92.4 percent accuracy, 3 mistakes, a rising performance line over 8 cycles, and a Ksatria gangsa grade.">
      <div className="flex items-start justify-between">
        <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-app-tan/60 uppercase">
          Result
        </p>
        <p className="text-[0.65rem] text-app-brass">Ngecog · Polos · 1×</p>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-app-tan/60 uppercase">
            Accuracy
          </p>
          <p className="font-serif text-4xl leading-none text-app-cream tabular-nums">
            92.4%
          </p>
          <p className="mt-1 text-[0.65rem] text-app-tan/50">
            Your best is 88.1%
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-app-tan/60 uppercase">
            Mistakes
          </p>
          <p className="font-serif text-3xl leading-none text-app-cream tabular-nums">
            3
          </p>
        </div>
      </div>

      {/* performance across the run */}
      <svg
        viewBox={`0 -4 ${CHART_W} ${CHART_H + 12}`}
        className="mt-4 h-14 w-full"
        aria-hidden
      >
        <polyline
          points={`0,${CHART_H} ${line} ${CHART_W},${CHART_H}`}
          fill="#c9a063"
          fillOpacity="0.12"
          stroke="none"
        />
        <polyline
          points={line}
          fill="none"
          stroke="#c9a063"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.5} fill="#f6e3ac" />
        ))}
      </svg>
      <div className="flex justify-between text-[0.6rem] text-app-tan/50">
        <span>8 cycles</span>
        <span className="text-app-brass">best 1–8</span>
      </div>

      {/* the gangsa grade, which only ever goes up */}
      <div className="mt-4 border-t border-app-brass/15 pt-3">
        <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-app-tan/60 uppercase">
          Your gangsa
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-serif text-xl text-app-sangsih">Ksatria</span>
          <span className="text-[0.65rem] text-app-tan/60">
            interlocking at tempo
          </span>
        </p>
        <span className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-app-cream/10">
          <span className="h-full w-2/3 rounded-full bg-app-sangsih" />
        </span>
        <p className="mt-1.5 text-[0.65rem] text-app-tan/50 tabular-nums">
          26.400 notes landed · 13.600 to Brahmana
        </p>
      </div>
    </Panel>
  );
}
