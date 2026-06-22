"use client";

import { cn } from "@/lib/utils";
import { AI_ACTIONS } from "@/components/ai/ai-actions";
import type { AiRequestType } from "@/types";

export function AiActionSelector({
  selected,
  onSelect,
}: {
  selected: AiRequestType | null;
  onSelect: (action: AiRequestType) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {AI_ACTIONS.map(({ value, label, description, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={cn(
            "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
            selected === value
              ? "border-brand-primary bg-brand-primary/10"
              : "border-white/10 bg-white/[0.02] hover:border-white/20"
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              selected === value ? "bg-brand-gradient" : "bg-white/5"
            )}
          >
            <Icon className={cn("h-4 w-4", selected === value ? "text-white" : "text-brand-textSecondary")} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-brand-textSecondary/70">{description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
