export const siteConfig = {
  name: "Kotek",
  tagline: "Learn real gamelan with an interactive practice partner",
  description:
    "Kotek turns your phone into a kotekan practice partner. Mount it above your gangsa and get real-time guidance on which key to strike and when. No instructor or second player required.",
  /** App Store listing. */
  appStoreUrl: "https://apps.apple.com/app/kotek/id6803080731",
  email: "hello@kotek.app",
  url: "https://kotek.app",
} as const;

export const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
  { href: "/feedback", label: "Feedback" },
] as const;

export const footerGroups = [
  {
    heading: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#download", label: "Download" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: "/#community", label: "Who it’s for" },
      { href: "/#mekar-bhuana", label: "Mekar Bhuana" },
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
