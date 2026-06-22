import {
  FileText,
  Lightbulb,
  Wand2,
  Languages,
  Microscope,
  type LucideIcon,
} from "lucide-react";
import type { AiRequestType } from "@/types";

export const AI_ACTIONS: {
  value: AiRequestType;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "summarize",
    label: "Summarize",
    description: "A short, clear summary of the document",
    icon: FileText,
  },
  {
    value: "insights",
    label: "Key Insights",
    description: "The most important points, as a bulleted list",
    icon: Lightbulb,
  },
  {
    value: "simplify",
    label: "Simplify",
    description: "Rewritten in plain, accessible language",
    icon: Wand2,
  },
  {
    value: "translate",
    label: "Translate",
    description: "Translate to a language of your choice",
    icon: Languages,
  },
  {
    value: "analyze",
    label: "Smart Analysis",
    description: "Purpose, themes, tone, and notable gaps",
    icon: Microscope,
  },
];
