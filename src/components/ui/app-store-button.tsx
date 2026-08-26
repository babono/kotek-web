import { AppleIcon } from "@/components/icons/apple";
import { ButtonLink } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import type { VariantProps } from "class-variance-authority";

export function AppStoreButton({
  variant = "primary",
  className,
}: {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}) {
  return (
    <ButtonLink href={siteConfig.appStoreUrl} variant={variant} className={className}>
      <AppleIcon className="size-5 shrink-0" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[0.65rem] font-normal opacity-70">
          Download on the
        </span>
        <span className="mt-0.5 text-[0.95rem]">App Store</span>
      </span>
    </ButtonLink>
  );
}
