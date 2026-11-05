import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { complement } from "@/content/landing";

export function ComplementSection() {
  return (
    <section className="bg-inverse">
      <div aria-hidden className="tumpal" />
      <Container className="py-20 md:py-28">
        <Reveal
          stagger
          className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center"
        >
          <h2 className="text-[4.25rem] leading-[0.88] text-balance text-putih md:text-[7rem]">
            {complement.title.before}{" "}
            <span className="text-kuning">{complement.title.not}</span>{" "}
            {complement.title.after}
          </h2>
          <p className="max-w-2xl text-xl leading-relaxed text-pretty text-putih/80">
            {complement.body}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
