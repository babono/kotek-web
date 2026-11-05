import { ScreenSwitcher } from "@/components/sections/screen-switcher";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { inside } from "@/content/landing";

export function InsideSection() {
  return (
    <Section id="inside" className="bg-krem">
      <Container>
        <SectionHeading eyebrow={inside.eyebrow} title={inside.title} />
        <Reveal className="mt-10">
          <ScreenSwitcher screens={inside.screens} />
        </Reveal>
      </Container>
    </Section>
  );
}
