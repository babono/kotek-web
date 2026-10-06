import type { Metadata } from "next";
import Link from "next/link";
import { SupportForm } from "@/components/support/support-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/content/site";
import { isSupportConfigured } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Kotek. Report a bug, ask a question about setting up your gangsa, or send us a privacy request.",
};

const linkClass =
  "rounded text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

const helpCards = [
  {
    title: "Email us directly",
    body: "Prefer your own mail app? Write to us and we’ll reply from the same address.",
    link: { href: `mailto:${siteConfig.email}`, label: siteConfig.email },
  },
  {
    title: "Quick answers",
    body: "What you need before you start, which instruments work, and whether Kotek suits beginners.",
    link: { href: "/#faq", label: "Read the FAQ" },
  },
  {
    title: "Ideas for the app",
    body: "Want a new pattern or feature? Stick a note on the public wall so other players can see it too.",
    link: { href: "/feedback", label: "Visit the feedback wall" },
  },
] as const;

export default function SupportPage() {
  return (
    <Section id="support">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Support"
          title="How can we help?"
          description="Questions about setting up, something not working, or a request about your data. Send us a message and we’ll get back to you by email."
        />

        <Reveal className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-10">
          <SupportForm canSubmit={isSupportConfigured()} />

          <aside aria-label="Other ways to get help" className="flex flex-col gap-4">
            {helpCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-2 rounded-card border border-border bg-white/60 p-6"
              >
                <h2 className="font-sans text-base font-bold tracking-tight">
                  {card.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <Link href={card.link.href} className={`${linkClass} mt-1 w-fit`}>
                  {card.link.label}
                </Link>
              </div>
            ))}

            <p className="px-1 text-xs leading-relaxed text-subtle-foreground">
              Kotek is made by a small team at the Apple Developer Academy Bali.
              We read every message.
            </p>
          </aside>
        </Reveal>
      </Container>
    </Section>
  );
}
