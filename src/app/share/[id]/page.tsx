import type { Metadata } from "next";
import { AppStoreButton } from "@/components/ui/app-store-button";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Shared kotekan",
  robots: { index: false },
};

/** Where a shared kotekan link lands when the app didn't take it. */
export default async function SharedKotekanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Section id="shared-kotekan">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Shared kotekan"
          title="Someone shared a kotekan with you"
          description="Open it in Kotek to add a copy to your own gangsa. No app yet? Download it first, then open this link again."
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={`kotek://k/${encodeURIComponent(id)}`}>
            Open in Kotek
          </ButtonLink>
          <AppStoreButton />
        </div>
      </Container>
    </Section>
  );
}
