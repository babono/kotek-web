import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { NavLogo } from "@/components/layout/nav-logo";
import { navLinks, siteConfig } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <NavLogo />
          <Image
            src="/art/wordmark-kotek-red.svg"
            alt=""
            width={159}
            height={37}
            className="h-5 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[0.9375rem] font-semibold text-muted-foreground transition-colors hover:bg-krem hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ButtonLink href={siteConfig.appStoreUrl} variant="secondary" size="compact">
          Get the app
        </ButtonLink>
      </Container>
    </header>
  );
}
