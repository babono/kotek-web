import feedbackPoster from "../../public/captures/feedback.jpg";
import playPoster from "../../public/captures/play.jpg";
import studioPoster from "../../public/captures/studio.jpg";
import voicePoster from "../../public/captures/voice.jpg";
import timelapsePoster from "../../public/story/timelapse-poster.jpg";

/**
 * All landing page copy lives here so wording changes never require touching
 * a component. Sections import only the slice they render.
 *
 * The page follows one arc: story, then features, then impact. The order and
 * the wording are the team's agreed story; keep sections short, one idea each.
 */

export const hero = {
  /** Split because the word itself opens the explanation of kotekan. */
  title: { word: "Kotekan", rest: "was never meant to be played alone" },
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
  close: "Got it",
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

export const story = {
  eyebrow: "The story",
  title: "Bali keeps its gamelan in people, not pages",
  lead: "Bali is an island rich in culture, and gamelan lives in its everyday life. Children learn it from an early age, at school and in the banjar.",
  taught: "It’s taught by an instructor, mostly by ear and by watching the mallet.",
  proverb: "Meguru kuping, meguru panggul.",
  video: {
    src: "/timelapse.mp4",
    poster: timelapsePoster,
    caption: "Our team learning kotekan at Mekar Bhuana, the way everyone does: by ear, on the floor, beside a teacher.",
  },
  gaps: [
    {
      title: "Learned only at rehearsal",
      body: "Once the session ends, so does the lesson.",
    },
    {
      title: "Never played alone",
      body: "Without your partner, the song falls apart.",
    },
    {
      title: "Nothing written down",
      body: "No sheet, no recording, only the instructor.",
    },
  ],
  turn: {
    title: "When the lesson stops, motivation goes with it",
    body: "At one school we found a full gamelan set with no one to teach it. Without practice between rehearsals, students fall behind, and some let go of gamelan.",
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

/**
 * Each clip is the real app, recorded from a build of it. A simulator has no
 * gangsa, so `play` and `voice` were fed simulated strikes and the app's own
 * bilah recordings through the app's normal paths.
 */
export const designed = {
  title: "Made for gamelan",
  description: "Four pillars that spell GONG, the stroke that completes every cycle.",
  features: [
    {
      id: "play",
      title: "Groove",
      plain: "Play along",
      body: "The other half, in your gangsa’s own voice. A waterfall and a damp cue make practising alone feel like playing with a partner.",
      video: "/captures/play.mp4",
      poster: playPoster,
      label: "The play screen: notes fall onto the gangsa, and each strike is called out as it lands.",
    },
    {
      id: "yours",
      title: "Own",
      plain: "Make it yours",
      body: "Kotek Studio. Every instructor records their own kotekan and shares it with their students.",
      video: "/captures/studio.mp4",
      poster: studioPoster,
      label: "Opening a kotekan from the list in Kotek Studio, adding polos and sangsih strokes, and playing it back.",
    },
    {
      id: "progress",
      title: "Notice",
      plain: "See your progress",
      body: "Sensors on the gangsa feel every real strike. Precise feedback turns each practice into progress you can see.",
      video: "/captures/feedback.mp4",
      poster: feedbackPoster,
      label: "A session’s result, then Where to polish, with Kipli explaining the strokes that slipped.",
      explainer: true,
    },
    {
      id: "alive",
      title: "Guard",
      plain: "Keep it alive",
      body: "Every kotekan recorded is kept in its sanggar’s own sound, for the next generation.",
      video: "/captures/voice.mp4",
      poster: voicePoster,
      label: "Adding a gangsa: recording each bilah’s own sound, one key at a time.",
    },
  ],
} as const;

/** The popup behind Notice. */
export const sensors = {
  cta: "See how the sensors work",
  title: "How the sensors work",
  kipli: "Every strike makes the bilah vibrate. That vibration is what Kotek reads.",
  close: "Got it",
  steps: [
    {
      title: "You strike the bilah",
      body: "It vibrates, the same way it always has.",
    },
    {
      title: "A piezo disc feels it",
      body: "One small disc under each bilah turns that vibration into a signal.",
    },
    {
      title: "Bluetooth tells the app",
      body: "A controller sends your phone which bilah you hit, and when.",
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
  map: {
    image: "/art/place-map.svg",
    alt: "A drawn street map of Kuta and Tuban, in the south of Bali, with the airport below.",
    credit: { label: "© OpenStreetMap", href: "https://www.openstreetmap.org/copyright" },
    /** Must match `bounds` in scripts/build-place-map.mjs. */
    bounds: { north: -8.715, south: -8.765, west: 115.15, east: 115.205 },
    /** What the map opens on: every pin, with room around them. */
    home: { lat: -8.7402, lng: 115.1729 },
    /** Mekar Bhuana is off this map, so choosing it heads that way. */
    towardsDenpasar: { lat: -8.7295, lng: 115.1835 },
  },
  hint: "Tap a pin and I’ll take you there.",
  close: "Back to the whole map",
  groups: [
    { kind: "school", label: "Schools", singular: "School" },
    { kind: "banjar", label: "Banjar", singular: "Banjar" },
    { kind: "sanggar", label: "Sanggar", singular: "Sanggar" },
    { kind: "home", label: "Home base", singular: "Home base" },
  ],
  areas: [
    { name: "Kuta", lat: -8.7362, lng: 115.1712 },
    { name: "Tuban", lat: -8.7428, lng: 115.1748 },
    { name: "Ngurah Rai Airport", lat: -8.7466, lng: 115.1702, wideOnly: true },
  ],
  places: [
    {
      id: "sdn-2-tuban",
      kind: "school",
      name: "SDN 2 Tuban",
      where: "Jalan Taman Griya, Tuban",
      body: "A state primary school, and one of the three schools where we tested Kotek.",
      lat: -8.74007,
      lng: 115.17603,
      labelSide: "left",
    },
    {
      id: "sdn-6-tuban",
      kind: "school",
      name: "SDN 6 Tuban Kuta",
      where: "Jalan Raya Tuban",
      body: "A state primary school, and one of the three schools where we tested Kotek.",
      lat: -8.74074,
      lng: 115.1791,
      labelSide: "right",
    },
    {
      id: "smpn-1-kuta",
      kind: "school",
      name: "SMP Negeri 1 Kuta",
      where: "Jalan Dewi Sartika, Kuta",
      body: "A state junior high, and one of the three schools where we tested Kotek.",
      lat: -8.73869,
      lng: 115.16827,
      labelSide: "right",
    },
    {
      id: "banjar-tuban-griya",
      kind: "banjar",
      name: "Banjar Tuban Griya",
      where: "Tuban",
      body: "One of the two banjar where we tested Kotek, in the conditions it has to work in.",
      lat: -8.74471,
      lng: 115.17987,
      labelSide: "right",
    },
    {
      id: "banjar-segara-kuta",
      kind: "banjar",
      name: "Banjar Segara Kuta",
      where: "Kuta",
      body: "One of the two banjar where we tested Kotek, in the conditions it has to work in.",
      lat: -8.73825,
      lng: 115.16589,
      labelSide: "left",
    },
    {
      id: "academy",
      kind: "home",
      name: "Apple Developer Academy",
      where: "Kuta",
      body: "Where Kotek was built, a few streets from the schools and banjar that shaped it.",
      lat: -8.73732,
      lng: 115.17612,
      labelSide: "right",
    },
  ],
  /** Too far to pin on this map, so it gets a sign pointing the way instead. */
  farPlace: {
    id: "mekar-bhuana",
    kind: "sanggar",
    name: "Mekar Bhuana",
    distance: "14 km",
    where: "Kesiman, Denpasar",
    body: "Our partner sanggar, and where our team learned kotekan: by ear, on the floor, beside a teacher.",
    photo: {
      src: "/mekar-bhuana/photo-centre.png",
      alt: "A circle of players at their gamelan instruments at Mekar Bhuana.",
      width: 1132,
      height: 678,
    },
    link: { href: "https://balimusicanddance.com", label: "Visit Mekar Bhuana" },
  },
  market: {
    eyebrow: "Where it can go",
    title: "Everywhere gamelan lives, kotekan needs two",
    stats: [
      {
        icon: "school",
        value: "3,012",
        label: "primary and junior high schools in Bali",
      },
      {
        icon: "banjar",
        value: "4,432",
        label: "banjar across Bali",
      },
      {
        icon: "sanggar",
        value: "14,000+",
        label: "gangsa seats in Bali’s gong kebyar alone",
        note: "Our estimate: 1,600 sets, nine gangsa each.",
      },
      {
        icon: "world",
        value: "500+",
        label: "gamelan ensembles outside Indonesia",
      },
    ],
    sourcesLabel: "Sources",
    sources: [
      {
        label: "Kemendikdasmen",
        href: "https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas",
      },
      {
        label: "Dinas PMA Bali, via BRIDA Badung",
        href: "https://brida.badungkab.go.id/artikel/52036-banjar-sebagai-coworking-space",
      },
      {
        label: "I Wayan Rai (2008), in BASAbali",
        href: "https://dictionary.basabali.org/Music_Gamelan_Gong_Kebyar",
      },
      {
        label: "Wikipedia",
        href: "https://en.wikipedia.org/wiki/Gangsa",
      },
      {
        label: "Clendinning (2015), Smithsonian",
        href: "https://asia-archive.si.edu/essays/article-clendinning/",
      },
    ],
  },
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

export type PlaceKind = (typeof impact.groups)[number]["kind"];

export const about = {
  eyebrow: "About us",
  title: "The people behind Kotek",
  intro:
    "We’re a team from Apple Developer Academy Bali, building Kotek alongside the people who teach gamelan.",
  team: [
    { name: "Babono", role: "Project Manager" },
    { name: "Steven", role: "IoT Engineer" },
    { name: "Dimas", role: "Product Engineer" },
    { name: "Rhea", role: "Product Engineer" },
    { name: "Hercio", role: "UI/UX Designer" },
    { name: "Farhan", role: "Illustrator" },
    { name: "Ivan", role: "Mentor" },
  ],
  photo: {
    src: "/mekar-bhuana/photo-mekarbhuana.jpg",
    alt: "Members of the Kotek team at Mekar Bhuana, among photos of the workshops.",
  },
  origin: {
    label: "Where we come from",
    name: "Apple Developer Academy Bali",
  },
  partner: {
    label: "Who we learn from",
    name: "Mekar Bhuana",
    href: "https://balimusicanddance.com",
    logo: "/mekar-bhuana/logo-mekarbhuana.svg",
    body: "A gamelan centre in Denpasar that helped us understand how gamelan is truly taught, heard and preserved.",
  },
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
