import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = "center",
  as: Heading = "h2",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  align?: "center" | "left";
  /** Use "h1" when the section is a page's main heading. */
  as?: "h1" | "h2";
}) {
  return (
    <Reveal
      stagger
      className={cn(
        "flex max-w-3xl flex-col gap-3",
        align === "center"
          ? "mx-auto items-center text-center"
          : "items-start text-left",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className="text-6xl leading-[0.88] text-balance sm:text-7xl md:text-[5.5rem]">
        {title}
      </Heading>
      {description ? (
        <p className="text-lg text-muted-foreground text-pretty sm:text-xl">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
