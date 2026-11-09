export const siteConfig = {
  name: "Kotek",
  tagline: "Kotekan, taught beyond the rehearsal",
  /** The footer’s closing line, the same as the pitch’s. */
  footerLine: "Practise more. Play better. Pass it on.",
  description:
    "Kotek carries a teacher’s kotekan to every student’s own gangsa. Groove with the other half, own your kotekan, notice every strike, and guard your sanggar’s sound for the next generation.",
  /** App Store listing. */
  appStoreUrl: "https://apps.apple.com/app/kotek/id6803080731",
  email: "hello@kotek.app",
  url: "https://kotek.app",
} as const;

/** The page's three chapters, then the questions. */
export const navLinks = [
  { href: "/#story", label: "Story" },
  { href: "/#features", label: "Features" },
  { href: "/#impact", label: "Impact" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const footerGroups = [
  {
    heading: "Kotek",
    links: [
      { href: "/#story", label: "Story" },
      { href: "/#features", label: "Features" },
      { href: "/#impact", label: "Impact" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: "/#get-involved", label: "Get involved" },
      { href: "/feedback", label: "Feedback wall" },
      { href: "/spin", label: "Prize wheel" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/support", label: "Support" },
      { href: `mailto:${siteConfig.email}`, label: "Contact us" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
] as const;
