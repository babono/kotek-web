import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

/**
 * Shared shell for the privacy policy and terms. There is no typography
 * plugin, so long-form styles are applied to the raw elements here once,
 * and the pages themselves stay plain markup.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  summary,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Human-readable date, e.g. "6 October 2026". */
  updated: string;
  /** The short version, shown in a card above the full text. */
  summary?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <header className="flex flex-col items-start gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-3xl font-bold text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
            {title}
          </h1>
          <p className="text-sm text-subtle-foreground">Last updated {updated}</p>
        </header>

        {summary ? (
          <div className="mt-10 rounded-card border border-border bg-card p-6 text-sm leading-relaxed sm:p-7 [&_li]:mt-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
            {summary}
          </div>
        ) : null}

        <div className="mt-12 text-[0.9375rem] leading-relaxed text-pretty [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-foreground [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-bold [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&>h2:first-child]:mt-0">
          {children}
        </div>
      </Container>
    </Section>
  );
}
