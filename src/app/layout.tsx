import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { siteConfig } from "@/content/site";
import "./globals.css";
import localFont from "next/font/local";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

/** The app's own display face — used for the titles inside the mockups. */
const dreamOrphans = localFont({
  variable: "--font-dream-orphans",
  display: "swap",
  src: [
    {
      path: "./fonts/Dream-Orphans.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Dream-Orphans-It.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Dream-Orphans-Bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Dream-Orphans-Bd-It.otf",
      weight: "700",
      style: "italic",
    },
  ],
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
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${dreamOrphans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Without JS the scroll reveals never fire, so show everything up front. */}
        <noscript>
          <style>{`.reveal,.reveal-stagger>*{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
