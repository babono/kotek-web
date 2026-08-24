export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "What do I need before I start?",
    answer:
      "You’ll need a physical instrument to practice on. Kotek is built for playing on a real instrument, because that’s how it can help you build muscle memory and get the feel of it in your hands. You’ll also need a tripod or stand to hold your phone above the instrument, camera pointing down, so both of your hands are free to play.",
  },
  {
    question: "What instrument can I play with this app?",
    answer:
      "Kotek is built around the gangsa of the gong kebyar family, an instrument with bronze keys over bamboo resonators, played with a single mallet while the left hand damps. It ships with a calibrated profile for that instrument, and because every village tunes differently, the app is designed to be calibrated per instrument rather than assuming a standard tuning.",
  },
  {
    question: "Is this app beginner friendly?",
    answer:
      "Yes. Practice mode is the default for first-time players. There’s no score and no fail state: Kotek waits for you to hit the right key before moving on, and you can slow the tempo down until the pattern sits in your hands. Scoring only comes in when you decide you want it.",
  },
  // {
  //   question: "Do I need to calibrate anything first?",
  //   answer:
  //     "Setup takes about fifteen seconds. Frame the instrument in the camera, drag the key outlines so they sit over the real keys, and you’re playing. If your instrument is tuned differently, you can record its key pitches from Settings and Kotek will use those instead.",
  // },
  // {
  //   question: "Does Kotek replace a gamelan teacher?",
  //   answer:
  //     "No, and it isn’t meant to. Kotek exists for the step before a teacher, so you can start on your own schedule, without a sekaa to join, and arrive at a lesson or a rehearsal already comfortable with the instrument.",
  // },
  // {
  //   question: "Which devices does it run on?",
  //   answer:
  //     "iPhone 12 or later on iOS 17 or newer. Kotek does real-time audio analysis on the live camera feed, so it needs the extra headroom those devices provide.",
  // },
];
