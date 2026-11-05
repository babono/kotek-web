import type { StaticImageData } from "next/image";
import { LoopingVideo } from "@/components/ui/looping-video";

/**
 * A landscape iPad: a thick, even bezel about 6% of its short side, generous
 * outer corners and tight screen corners, with the camera on the long-side
 * bezel. All in percentages, so it keeps its proportions at any size. Solid,
 * like everything else in the app: no glass.
 */
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
    <div className="tactile relative rounded-[4.6%/6.8%] bg-ireng p-[3.8%] [--base:var(--garis)] [--depth:5px]">
      <span
        aria-hidden
        className="absolute top-1/2 left-[1.7%] aspect-square w-[0.8%] -translate-y-1/2 rounded-full bg-[#3a4154]"
      />
      <LoopingVideo
        src={video}
        poster={poster}
        label={label}
        className="block aspect-[1218/800] w-full rounded-[1.4%/2.1%] bg-putih"
      />
    </div>
  );
}
