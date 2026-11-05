import { AppleIcon } from "@/components/icons/apple";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
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
      className={className}
    >
      <AppleIcon className="size-5 shrink-0" />
      <span>Download on the App Store</span>
    </ButtonLink>
  );
}
