import type { ReactNode } from "react";
import type { BadgeTone } from "@/interface/ui.interface";

export interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
}
