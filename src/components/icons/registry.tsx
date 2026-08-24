import { BoltIcon } from "@/components/icons/bolt";
import { BuildingIcon } from "@/components/icons/building";
import { ChartIcon } from "@/components/icons/chart";
import { GlobeIcon } from "@/components/icons/globe";
import { MalletIcon } from "@/components/icons/mallet";
import { SparkIcon } from "@/components/icons/spark";
import { UsersIcon } from "@/components/icons/users";
import type { IconName } from "@/content/landing";
import type { IconProps } from "@/components/icons/icon-base";

/**
 * Maps the icon names used in content to components, so copy can stay plain
 * data without importing JSX.
 */
export const iconRegistry: Record<IconName, (props: IconProps) => React.ReactNode> = {
  bolt: BoltIcon,
  building: BuildingIcon,
  chart: ChartIcon,
  globe: GlobeIcon,
  mallet: MalletIcon,
  spark: SparkIcon,
  users: UsersIcon,
};
