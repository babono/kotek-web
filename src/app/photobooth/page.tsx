import type { Metadata } from "next";
import { PhotoBooth } from "@/components/photobooth/photo-booth";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { photoboothCopy } from "@/content/photobooth";

export const metadata: Metadata = {
  title: "Photobooth",
  description:
    "Take a picture in a Kotek frame: the pura gate, the play screen, Kipli, or a three-shot strip.",
};

export default function PhotoboothPage() {
  return (
    <section id="photobooth" className="py-10 sm:py-14">
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-1.5">
          <Eyebrow>{photoboothCopy.eyebrow}</Eyebrow>
          <h1 className="text-5xl leading-[0.9] text-balance sm:text-6xl">{photoboothCopy.title}</h1>
          <p className="mt-2 text-[1.0625rem] text-pretty">{photoboothCopy.intro}</p>
        </div>
        <PhotoBooth />
      </Container>
    </section>
  );
}
