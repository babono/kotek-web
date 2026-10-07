import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { NavLogo } from "@/components/layout/nav-logo";
import { navLinks, siteConfig } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <NavLogo />
          <span
            className="font-display text-lg font-bold text-foreground"
            translate="no"
          >
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ButtonLink href={siteConfig.appStoreUrl} variant="primary" size="sm">
          Get the app
        </ButtonLink>
      </Container>
    </header>
  );
}
