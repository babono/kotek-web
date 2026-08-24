import { Panel } from "@/components/mockups/panel";

const BARS = [42, 55, 48, 66, 61, 74, 70, 83, 79, 92];

const JUDGEMENTS = [
  { label: "Perfect", value: "48" },
  { label: "Good", value: "9" },
  { label: "Late", value: "3" },
  { label: "Miss", value: "1" },
];

export function ProgressMockup() {
  return (
    <Panel label="A results screen showing 92 percent accuracy and a bar chart of improving session scores.">
      <div className="mb-5 flex items-end justify-between">
        <span className="flex flex-col gap-1">
          <span className="text-xs font-medium tracking-wider text-subtle-foreground uppercase">
            Accuracy
          </span>
          <span className="font-display text-3xl font-bold text-inverse-foreground tabular-nums">
            92%
          </span>
        </span>
        <span className="rounded-full bg-success/20 px-3 py-1.5 text-xs font-medium text-success tabular-nums">
          +14% this week
        </span>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {BARS.map((height, i) => (
          <span
            key={i}
            style={{ height: `${height}%` }}
            className={`flex-1 rounded-t-sm ${
              i === BARS.length - 1 ? "bg-primary" : "bg-inverse-foreground/15"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-inverse-foreground/10 pt-4 text-xs">
        {JUDGEMENTS.map((judgement) => (
          <span key={judgement.label} className="flex flex-col gap-1">
            <span className="text-subtle-foreground">{judgement.label}</span>
            <span className="text-sm font-semibold text-inverse-foreground tabular-nums">
              {judgement.value}
            </span>
          </span>
        ))}
      </div>
    </Panel>
  );
}
