/**
 * All landing page copy lives here so wording changes never require touching
 * a component. Sections import only the slice they render.
 */
export type IconName =
  | "mallet"
  | "users"
  | "building"
  | "bolt"
  | "spark"
  | "chart"
  | "globe";

export const hero = {
  eyebrow: "For gangsa players",
  title: "Learn real gamelan with an interactive practice partner",
  description:
    "Mount your phone above your gangsa. Kotek guides your strikes, listens to check your timing, and plays the interlocking kotekan part alongside you.",
  secondaryCta: { href: "#features", label: "See how it works" },
  demoVideoUrl: "/hero-video-compress.mp4",
  demoCaption:
    "Mount your phone above the instrument. Kotek shows you which key to strike, and listens to check that you hit it.",
} as const;

export const hitDetection = {
  eyebrow: "Dual-Engine Hit Detection",
  title: "How Kotek verifies strikes in real time",
  description:
    "Physical gamelan produces loud resonance and fast hand damping. Kotek pairs computer vision with acoustic spectrum analysis for zero-latency, error-free strike detection.",
  engines: [
    {
      id: "vision",
      badge: "Vision AI",
      status: "Spatial Tracking",
      title: "Vision AI: Spatial Key Detection",
      description:
        "Uses your phone’s camera to detect physical bilah (keys) and track mallet movement, determining the exact key being struck.",
    },
    {
      id: "audio",
      badge: "Acoustic ML",
      status: "Spectrum Trigger",
      title: "Audio Analyzer: Acoustic Spectrum Trigger",
      description:
        "Trained on the unique harmonic voice spectrum of bronze gangsa keys to detect the precise microsecond trigger and onset of each strike.",
    },
  ],
  fusion: {
    badge: "Sensor Fusion Engine",
    description:
      "Vision identifies the key, while audio detects the exact microsecond hit. Together, they eliminate false triggers with zero perceptible latency.",
  },
} as const;

export const problem = {
  title: "No instructor or partner to play with? No problem",
  description:
    "Gamelan was never meant to be played alone, but finding an instructor or a partner to play with is not easy, and that makes practicing feel almost impossible.",
  cards: [
    {
      title: "Finding a partner to practice daily with is hard",
      body: "Kotekan needs two players interlocking. Coordinating schedules with a teacher or partner means most days, you don’t practice at all.",
    },
    {
      title: "Learning resources are hard to find",
      body: "Notes and patterns are passed down from mouth to mouth. Finding them is tiring and time-consuming, so you waste the time you’d rather spend playing.",
    },
    {
      title: "No one to correct you",
      body: "Don’t let unnoticed mistakes become a habit. Kotek guides you to play with the correct timing and accent.",
    },
  ],
  closing: {
    title: "Kotek helps re-create the learning environment",
    body: "Keep waiting on a partner and a resource, and you will never practice.",
  },
} as const;

export const audiences = {
  title: "Built from the community, for everyone",
  cards: [
    {
      icon: "mallet",
      title: "Learners",
      body: "Improve your playing by making daily practice easier to start.",
    },
    {
      icon: "users",
      title: "Community",
      body: "Create new kotekan patterns and spread them to community members.",
    },
    {
      icon: "building",
      title: "University",
      body: "Get hands on gamelan without waiting for ensemble time or a full instrument set.",
    },
  ],
} as const satisfies {
  title: string;
  cards: readonly { icon: IconName; title: string; body: string }[];
};

export const features = {
  title: "Interactive learning and real-time guidance",
  cards: [
    {
      id: "patterns",
      eyebrow: "Patterns",
      title: "Learn various kotekan patterns",
      body: "Beginner to expert patterns help you improve at your own pace. Step up to a higher difficulty when you are ready.",
      tint: "bg-card",
    },
    {
      id: "roles",
      eyebrow: "Roles",
      title: "Adjust to match your play style",
      body: "Different configurations to match your play style. Choose one of the kotekan roles, then let Kotek play the other to create a harmonious interlocking pattern.",
      tint: "bg-accent-muted/25",
    },
    {
      id: "feedback",
      eyebrow: "Feedback",
      title: "Track your improvement",
      body: "Behind the scenes, a machine learning model detects your key hits and outputs a score that lets you track your improvement.",
      tint: "bg-card-strong",
    },
  ],
} as const;

export const benefits = {
  title: "Built to preserve gamelan knowledge",
  cards: [
    {
      icon: "bolt",
      title: "Get you to practice immediately",
      body: "Turn hours of hunting for resources and matching schedules into a practice space that’s ready when you are.",
    },
    {
      icon: "spark",
      title: "Make the learning process fun",
      body: "An interactive interface and game-like cues make playing gamelan exciting.",
    },
    {
      icon: "chart",
      title: "Track skill improvement over time",
      body: "Every session is scored, so the progress you can’t feel day to day becomes something you can see.",
    },
    {
      icon: "globe",
      title: "Promote the culture and grow the community",
      body: "Keep the culture alive by getting people to play without hassle, and help communities flourish at the same time.",
    },
  ],
} as const satisfies {
  title: string;
  cards: readonly { icon: IconName; title: string; body: string }[];
};

export const feedback = {
  title: "Your feedback is valuable to our team",
  description:
    "Tell us what would make practice easier, what confused you, or what you want to play next. Every note lands on the board.",
} as const;

export const closingCta = {
  title: "Mari ber-gangsa",
  description:
    "Make your learning interactive and fun. Start your gamelan journey with Kotek.",
} as const;

export const mekarBhuana = {
  eyebrow: "Community Collaboration",
  title: "Rooted in tradition with Mekar Bhuana",
  tagline: "To blossom around the world",
  description:
    "That is what Mekar Bhuana means, and it is the hope behind it: that Bali’s oldest music and dance become known again, at home and beyond it. In developing Kotek, we worked alongside Mekar Bhuana to understand how gamelan is truly taught, heard, and preserved.",
  video: {
    src: "/timelapse.mp4",
    caption:
      "How we understand the process of learning gamelan at the first place — observing traditional practice, hand damping, and the natural flow of kotekan.",
  },
  audio: {
    src: "/mekar-bhuana/workshop-gangsa.m4a",
    title: "Workshop session recording",
    description: "Live gangsa rehearsal recorded at Mekar Bhuana",
  },
  pillars: [
    {
      title: "The Centre",
      description:
        "A family-run centre in Denpasar that documents, reconstructs and repatriates endangered classical gamelan. Vaughan Hatch founded it in 2000 around an antique Semara Pagulingan he restored, having found how few classical ensembles were ever recorded. Putu Evie Suyadnyani, a Legong dancer, brought the dance in 2004.",
      image: "/mekar-bhuana/photo-founder.png",
      alt: "Vaughan Hatch and Putu Evie Suyadnyani, founders of Mekar Bhuana",
    },
    {
      title: "The Collection",
      description:
        "Twenty-seven gamelan sets: twenty-two in Bali, five at Mekar Bhuana Aotearoa in New Zealand. Among them a Semara Patangian in the old key order that exists nowhere else outside Bali, and Semara Kirang, an Angklung set from Lombok restored in 2019.",
      image: "/mekar-bhuana/photo-collection.png",
      alt: "Antique gamelan instruments in the Mekar Bhuana collection",
    },
    {
      title: "Visiting & Workshops",
      description:
        "Lessons, workshops and cultural immersion, led by English-speaking experts including a native-speaking ethnomusicologist. The centre is a family home, so there are no walk-ins — book by email two weeks ahead.",
      image: "/mekar-bhuana/photo-centre.png",
      alt: "Mekar Bhuana centre and workshop space in Denpasar",
    },
  ],
  cta: {
    href: "https://balimusicanddance.com",
    label: "Visit Mekar Bhuana",
    domain: "balimusicanddance.com",
  },
} as const;

