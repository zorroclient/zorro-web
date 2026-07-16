import {
  Globe,
  SlidersHorizontal,
  RefreshCw,
  Gauge,
  type LucideIcon,
} from "lucide-react";

// Marketing feature highlights — shown on the home page and the /lab concept.
export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Globe,
    title: "Runs anywhere",
    description:
      "Lunar, vanilla, Cosmic or any server you play on. One subscription, every setup.",
  },
  {
    icon: SlidersHorizontal,
    title: "Dialed-in control",
    description:
      "20+ modules across combat, movement, and visuals — each tunable down to the detail.",
  },
  {
    icon: RefreshCw,
    title: "Always current",
    description:
      "Auto-updating builds keep you ahead the moment anything changes.",
  },
  {
    icon: Gauge,
    title: "Clean & lightweight",
    description:
      "Engineered to stay smooth and out of your way — no frame drops, no babysitting.",
  },
];
