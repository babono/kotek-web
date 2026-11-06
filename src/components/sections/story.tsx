import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LoopingVideo } from "@/components/ui/looping-video";
import { MiniRoll } from "@/components/ui/mini-roll";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { story } from "@/content/landing";

/** One rehearsal, then a week of nobody to ask. */
function RehearsalWeek() {
  return (
    <div aria-hidden className="grid h-20 grid-cols-7 items-center gap-1.5">
      {Array.from({ length: 7 }, (_, day) => (
        <span
          key={day}
          className={
            day === 0
              ? "h-full rounded-md bg-merah"
              : "h-full rounded-md border-[1.5px] border-dashed border-garis"
          }
        />
      ))}
    </div>
  );
}

const gapVisuals = [
  <RehearsalWeek key="week" />,
  <MiniRoll key="half" sangsih="sangsih-ghost" />,
  <MiniRoll key="unwritten" polos="ghost" sangsih="ghost" />,
];

export function StorySection() {
  return (
    <Section id="story">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <Reveal stagger className="flex flex-col items-start gap-[1.1875rem]">
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 className="text-heading leading-[0.92] text-balance md:text-[4.375rem]">
              {story.title}
            </h2>
            <p className="text-lg leading-snug text-pretty">{story.lead}</p>
            <p className="text-lg leading-snug text-pretty">{story.taught}</p>
            <blockquote
              lang="ban"
              className="border-l-4 border-kuning pl-4 font-display text-[1.875rem] leading-[1.1] text-balance text-foreground"
            >
              {story.proverb}
            </blockquote>
          </Reveal>

          <Reveal>
            <figure className="flex flex-col gap-3">
              <LoopingVideo
                src={story.video.src}
                poster={story.video.poster}
                label={story.video.caption}
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="aspect-video w-full rounded-card bg-krem"
              />
              <figcaption className="text-sm text-pretty text-muted-foreground">
                {story.video.caption}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal stagger className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
          {story.gaps.map((gap, i) => (
            <article
              key={gap.title}
              className="flex flex-col gap-5 rounded-card border-[1.5px] border-garis/60 bg-surface p-6"
            >
              {gapVisuals[i]}
              <div>
                <h3 className="text-[2rem] leading-none md:text-[2.25rem]">{gap.title}</h3>
                <p className="mt-1 text-[1.0625rem] text-pretty">{gap.body}</p>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal
          stagger
          className="mx-auto mt-20 flex max-w-4xl flex-col items-center gap-5 text-center md:mt-24"
        >
          <Image src="/art/kipli-sad.svg" alt="" width={84} height={72} className="h-[4.5rem] w-auto" />
          <p className="font-display text-heading leading-[0.92] text-balance text-foreground md:text-[5rem]">
            {story.turn.title}
          </p>
          <p className="max-w-2xl text-lg leading-relaxed text-pretty">
            {story.turn.body}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
