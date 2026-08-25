import { FeedbackBoard } from "@/components/feedback/feedback-board";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { feedback } from "@/content/landing";
import { getFeedbackNotes, isNotionConfigured } from "@/lib/notion";

export async function FeedbackSection() {
  // Deliberately awaited here rather than streamed behind <Suspense>: the
  // board and the form share optimistic state, so they live in one client
  // component. Inside a Suspense boundary, the re-render that follows a
  // submit swaps in the fallback and unmounts the form mid-edit — which
  // throws away whatever the visitor typed if the save fails.
  const notes = await getFeedbackNotes();

  return (
    <Section id="feedback">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Feedback wall"
          title={feedback.title}
          description={feedback.description}
        />
        <Reveal className="mt-14">
          <FeedbackBoard notes={notes} canSubmit={isNotionConfigured()} />
        </Reveal>
      </Container>
    </Section>
  );
}
