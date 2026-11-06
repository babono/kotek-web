import { AppleIcon } from "@/components/icons/apple";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export function AppStoreButton({
  variant = "secondary",
  size,
  className,
}: VariantProps<typeof buttonVariants> & { className?: string }) {
  return (
    <ButtonLink
      href={siteConfig.appStoreUrl}
      variant={variant}
      size={size}
      // The longest label on the site: tightened to fit the narrowest phones.
      className={cn("max-[359px]:px-4 max-[359px]:text-[1.0625rem]", className)}
    >
      <AppleIcon className="size-5 shrink-0" />
      <span>Download on the App Store</span>
    </ButtonLink>
  );
}
