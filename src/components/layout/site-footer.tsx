import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerGroups, siteConfig } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-inverse text-inverse-foreground/70">
      <Container className="grid gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Image
              src="/kotek-logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-lg"
            />
            <span
              className="font-display text-lg font-bold text-inverse-foreground"
              translate="no"
            >
              {siteConfig.name}
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed">
            Learn to play gamelan on your phone, before there&rsquo;s a teacher
            or a sekaa to join.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.heading} aria-labelledby={`footer-${group.heading}`}>
            <h2
              id={`footer-${group.heading}`}
              className="font-sans text-sm font-semibold text-inverse-foreground"
            >
              {group.heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="rounded text-sm transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-inverse-foreground/10">
        <Container className="flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p>Made in Bali for the gamelan community.</p>
        </Container>
      </div>
    </footer>
  );
}
