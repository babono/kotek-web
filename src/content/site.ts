export const siteConfig = {
  name: "Kotek",
  tagline: "Learn to play gamelan on your phone",
  description:
    "Kotek turns your phone into a kotekan practice partner. Point it at a real gangsa and get real-time guidance on which key to strike and when. No instructor or second player required.",
  /** TestFlight beta. Swap for the App Store listing once the app ships. */
  appStoreUrl: "https://testflight.apple.com/join/AzSMs356",
  email: "hello@kotek.app",
  url: "https://kotek.app",
} as const;

export const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#community", label: "Community" },
  { href: "#faq", label: "FAQ" },
] as const;

export const footerGroups = [
  {
    heading: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#faq", label: "FAQ" },
      { href: "#download", label: "Download" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: "#community", label: "Who it’s for" },
      { href: `mailto:${siteConfig.email}`, label: "Contact us" },
    ],
  },
] as const;
