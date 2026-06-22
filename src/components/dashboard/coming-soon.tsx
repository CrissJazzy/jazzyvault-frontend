import { type LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  phase,
}: {
  icon: LucideIcon;
  title: string;
  phase: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 py-24 text-center">
      <Icon className="mb-3 h-9 w-9 text-brand-textSecondary/40" />
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <p className="mt-1 text-sm text-brand-textSecondary/60">
        Coming in {phase}
      </p>
    </div>
  );
}
