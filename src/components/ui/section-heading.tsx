import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = "center",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      stagger
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center"
          ? "mx-auto items-center text-center"
          : "items-start text-left",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl font-bold text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className="text-base text-muted-foreground text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
