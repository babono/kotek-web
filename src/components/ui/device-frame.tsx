import type { StaticImageData } from "next/image";
import { LoopingVideo } from "@/components/ui/looping-video";

/** A landscape iPhone: solid, like everything else in the app. No glass. */
export function DeviceFrame({
  video,
  poster,
  label,
}: {
  video: string;
  poster: StaticImageData;
  label: string;
}) {
  return (
    <div className="tactile rounded-[6%/12%] bg-ireng p-[1.1%] [--base:var(--garis)] [--depth:5px]">
      <LoopingVideo
        src={video}
        poster={poster}
        label={label}
        className="block aspect-[1200/626] w-full rounded-[5%/10%] bg-putih"
      />
    </div>
  );
}
