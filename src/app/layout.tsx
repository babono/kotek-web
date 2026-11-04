import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { siteConfig } from "@/content/site";
import "./globals.css";
import localFont from "next/font/local";

/** The app's display face, the same file the iOS app bundles. */
const katibeh = localFont({
  variable: "--font-katibeh",
  display: "swap",
  src: "./fonts/Katibeh-Regular.ttf",
});

/**
 * Apple devices get SF Pro Rounded from `ui-rounded`, as the app does. Nunito
 * is the nearest rounded face for everyone else, so it is not preloaded.
 */
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fbf6ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${katibeh.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Without JS the scroll reveals never fire, so show everything up front,
            and the demo's controls have nothing to drive. */}
        <noscript>
          <style>{`.reveal,.reveal-stagger>*{opacity:1!important;transform:none!important}[data-needs-js]{visibility:hidden}`}</style>
        </noscript>
        <SmoothScroll />
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
