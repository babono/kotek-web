import Image from "next/image";
import { cn } from "@/lib/utils";

/** A landscape iPhone: solid, like everything else in the app. No glass. */
export function DeviceFrame({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "tactile rounded-[6%/13%] bg-ireng p-[1.1%] [--base:var(--garis)] [--depth:5px]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1800}
        height={828}
        sizes={sizes}
        className="block h-auto w-full rounded-[5%/11%]"
      />
    </div>
  );
}
