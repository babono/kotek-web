import type { Metadata } from "next";
import { FeedbackSection } from "@/components/sections/feedback";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Tell the Kotek team what would make practice easier, and read what other players have asked for.",
};

export default function FeedbackPage() {
  return <FeedbackSection />;
}
