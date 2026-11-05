/**
 * All landing page copy lives here so wording changes never require touching
 * a component. Sections import only the slice they render.
 *
 * The page follows one arc: story, then features, then impact. The order and
 * the wording are the team's agreed story; keep sections short, one idea each.
 */

export const hero = {
  title: "Kotekan was never meant to be played alone",
  description:
    "Kotek plays the other half on your own gangsa, so practice doesn’t stop when rehearsal ends.",
  primaryCta: { href: "#get-involved", label: "Get involved" },
} as const;

/** The app's "How kotekan works" guide, in its own words. */
export const interlock = {
  title: "How kotekan works",
  definition: "Kotekan is a part of gamelan music, played on the gangsa.",
  kipli:
    "One melody, split between two players. Together they sound like one fast line.",
  failed: "I can’t play sound here. Try again in a moment.",
  stop: "Stop",
  cards: [
    {
      id: "polos",
      title: "Polos",
      gloss: "Plays on the beat. The steady half.",
      hear: "Hear polos",
    },
    {
      id: "sangsih",
      title: "Sangsih",
      gloss: "Plays off the beat. Fills the gaps.",
      hear: "Hear sangsih",
    },
    {
      id: "together",
      title: "Together",
      gloss: "Locked in, they make one line.",
      hear: "Hear together",
    },
  ],
} as const;

export type InterlockCard = (typeof interlock.cards)[number]["id"];

export const inside = {
  eyebrow: "Inside Kotek",
  title: "Three screens from our app",
  screens: [
    {
      id: "play",
      label: "Play",
      caption: "Kotek plays the other half while the waterfall shows what’s next.",
      image: "/screens/play.jpg",
      alt: "The Kotek play screen: notes falling in lanes onto a drawn gangsa.",
    },
    {
      id: "studio",
      label: "Kotek Studio",
      caption: "Every instructor records their own kotekan and shares it with their students.",
      image: "/screens/studio.jpg",
      alt: "Kotek Studio: a piano roll of polos notes above a drawn gangsa.",
    },
    {
      id: "feedback",
      label: "Feedback",
      caption: "Sensors catch every strike and show where you slipped.",
      image: "/screens/feedback.jpg",
      alt: "Where to polish: three strokes marked on the roll, and Kipli explaining that bilah 8 came a little early in 4 of 7 cycles.",
    },
  ],
} as const;

export const story = {
  eyebrow: "The story",
  title: "Gamelan lives in people, not books",
  lead: "It’s learned by ear and by watching the teacher’s mallet.",
  proverb: "Meguru kuping, meguru panggul.",
  body: "Gamelan is everywhere in Bali, and young people want to learn. But in the banjar and schools we visited, we saw how few people there are to teach it.",
  video: {
    src: "/timelapse.mp4",
    poster: "/story/timelapse-poster.jpg",
    caption: "Our team learning kotekan at Mekar Bhuana, the way everyone does: by ear, on the floor, beside a teacher.",
  },
  gaps: [
    {
      title: "Taught only at rehearsal.",
      body: "Between sessions, there’s no one to learn from.",
    },
    {
      title: "Nothing written down.",
      body: "Kotekan lives in the instructor’s memory.",
    },
    {
      title: "Kotekan needs two.",
      body: "Alone, you can only practise half.",
    },
  ],
  turn: {
    title: "A full gamelan set, and no one to teach it.",
    body: "That’s what we found at one school. Without practice between rehearsals, students fall behind, and some let go of gamelan.",
  },
} as const;

export const howItWorks = {
  eyebrow: "How Kotek works",
  title: "Three steps",
  steps: [
    {
      number: "01",
      title: "Record.",
      body: "The instructor plays their kotekan once, on their own gangsa.",
    },
    {
      number: "02",
      title: "Practise.",
      body: "Kotek plays the other half while the waterfall shows what’s next.",
    },
    {
      number: "03",
      title: "Improve.",
      body: "Sensors catch every strike and show where you slipped.",
    },
  ],
} as const;

export const complement = {
  title: { before: "Kotek does", not: "not", after: "replace the instructor" },
  body: "It carries their teaching home, the same way gamelan has always been taught: by ear and by watching.",
} as const;

export const designed = {
  title: "Designed for gamelan",
  features: [
    {
      id: "engage",
      title: "Designed to engage",
      body: "The other half, in your gangsa’s own voice. A waterfall and a damp cue make practising alone feel like playing with a partner.",
      image: "/screens/engage.jpg",
      alt: "The Learn screen: a kotekan taught step by step on the waterfall, with Kipli guiding.",
    },
    {
      id: "expression",
      title: "Designed for expression",
      body: "Kotek Studio. Every instructor records their own kotekan and shares it with their students.",
      image: "/screens/expression.jpg",
      alt: "Choosing a kotekan, with a tab for the ones you made yourself.",
    },
    {
      id: "ignite",
      title: "Designed to ignite",
      body: "Sensors on the gangsa feel every real strike. Precise feedback turns each practice into progress you can see.",
      image: "/screens/ignite.jpg",
      alt: "A session’s result: “Your hands are learning.”, with cycles, time played and accuracy.",
    },
    {
      id: "last",
      title: "Designed to last",
      body: "Every kotekan recorded is kept in its sanggar’s own sound, for the next generation.",
      image: "/screens/last.jpg",
      alt: "Adding a gangsa in Kotek: recording the sound of each bilah.",
    },
  ],
} as const;

export const realGangsa = {
  eyebrow: "Why a real gangsa?",
  title: "Gamelan apps let you tap a screen. Technique lives in your hands.",
  body: "The mallet, the damping hand, the timing between two players. Kotek works on a real instrument, so you build real technique.",
  photo: {
    src: "/mekar-bhuana/photo-centre.png",
    alt: "A circle of players at their gamelan instruments at Mekar Bhuana.",
  },
  points: ["The mallet", "The damping hand", "The timing between two players"],
} as const;

export const impact = {
  eyebrow: "Where we are",
  title: "Tested with students and instructors",
  places: [
    {
      kind: "Schools",
      names: ["SDN 2 Tuban", "SDN 6 Tuban Kuta", "SMP Negeri 1 Kuta"],
    },
    {
      kind: "Banjar",
      names: ["Banjar Tuban Griya", "Banjar Segara Kuta"],
    },
    {
      kind: "Sanggar",
      names: ["Mekar Bhuana"],
    },
  ],
  status: [
    {
      state: "live",
      label: "On the App Store",
      body: "Kotek v1.",
    },
    {
      state: "building",
      label: "In development",
      body: "v2, with sensors and Kotek Studio.",
    },
    {
      state: "building",
      label: "Still measuring",
      body: "Sensor accuracy in real banjar conditions.",
    },
  ],
} as const;

export const about = {
  eyebrow: "About us",
  title: "Apple Developer Academy Bali, with Mekar Bhuana",
  paragraph:
    "Bali is known around the world for its culture, and gamelan is at its heart. Gamelan isn’t learned from books. It’s passed from teacher to student, by ear and by watching. When we visited banjar and schools, we saw how much students depend on their instructors, and how few instructors there are. One school had a full gamelan set and no one to teach it. Kotek doesn’t replace the teacher. It brings their kotekan home, plays the other half, and gives students a way to keep practising until they’re back at the banjar.",
  photo: {
    src: "/mekar-bhuana/photo-mekarbhuana.jpg",
    alt: "The Kotek team together at Mekar Bhuana, among photos of the workshops.",
  },
  partner: {
    name: "Mekar Bhuana",
    href: "https://balimusicanddance.com",
    logo: "/mekar-bhuana/logo-mekarbhuana.svg",
  },
  team: ["Babono", "Putu", "Dimas", "Rhea", "Hercio", "Farhan"],
} as const;

export const contribute = {
  eyebrow: "Get involved",
  title: "Ways to contribute",
  ways: [
    {
      who: "Instructors",
      what: "Record a kotekan for your students",
      cta: "Write to us",
      subject: "Recording a kotekan with Kotek",
    },
    {
      who: "Schools and sanggar",
      what: "Host a practice session with us",
      cta: "Write to us",
      subject: "Hosting a Kotek practice session",
    },
    {
      who: "Students",
      what: "Try Kotek and tell us what’s missing",
      cta: "Leave a note",
      href: "/feedback",
    },
  ],
} as const;

export const feedback = {
  title: "Your feedback is valuable to our team",
  description:
    "Tell us what would make practice easier, what confused you, or what you want to play next. Every note lands on the board.",
} as const;

export const closingCta = {
  title: "Mari ber-gangsa",
  description: "Start your gamelan journey with Kotek.",
} as const;
