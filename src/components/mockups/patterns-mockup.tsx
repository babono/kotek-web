import { Panel } from "@/components/mockups/panel";

const PATTERNS = [
  { name: "Gilak Baleganjur", level: "Beginner", keys: "5 keys", tone: "success" },
  { name: "Kotekan Telu", level: "Intermediate", keys: "7 keys", tone: "primary" },
  { name: "Kebyar Ding", level: "Expert", keys: "10 keys", tone: "accent" },
] as const;

const TONE_CLASSES = {
  success: "bg-success/25 text-success",
  primary: "bg-primary/25 text-primary-hover",
  accent: "bg-accent/25 text-accent-muted",
} as const;

export function PatternsMockup() {
  return (
    <Panel label="A list of kotekan patterns in the app, from beginner to expert.">
      <p className="mb-4 text-xs font-medium tracking-wider text-subtle-foreground uppercase">
        Pattern library
      </p>
      <ul className="flex flex-col gap-2.5">
        {PATTERNS.map((pattern, i) => (
          <li
            key={pattern.name}
            className={`flex items-center justify-between rounded-xl px-4 py-3.5 ${
              i === 1
                ? "bg-primary/20 ring-1 ring-primary/50"
                : "bg-inverse-foreground/5"
            }`}
          >
            <span className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-sm font-semibold text-inverse-foreground">
                {pattern.name}
              </span>
              <span className="text-xs text-subtle-foreground">{pattern.keys}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-medium ${TONE_CLASSES[pattern.tone]}`}
            >
              {pattern.level}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
