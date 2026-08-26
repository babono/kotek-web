export const siteConfig = {
  name: "Kotek",
  tagline: "Learn real gamelan with an interactive practice partner",
  description:
    "Kotek turns your phone into a kotekan practice partner. Mount it above your gangsa and get real-time guidance on which key to strike and when. No instructor or second player required.",
  /** TestFlight beta. Swap for the App Store listing once the app ships. */
  appStoreUrl: "https://testflight.apple.com/join/AzSMs356",
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
      { href: "/#download", label: "TestFlight Beta" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: "/#community", label: "Who it’s for" },
      { href: "/#mekar-bhuana", label: "Mekar Bhuana" },
      { href: "/feedback", label: "Feedback wall" },
      { href: "/spin", label: "Prize wheel" },
      { href: `mailto:${siteConfig.email}`, label: "Contact us" },
    ],
  },
] as const;
