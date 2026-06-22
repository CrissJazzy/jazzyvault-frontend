"use client";

import { Calendar } from "lucide-react";

export function DateRangePicker({
  dateFrom,
  dateTo,
  onChange,
}: {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-brand-textSecondary/60" />
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onChange(e.target.value, dateTo)}
        className="h-10 rounded-lg border border-input bg-white/5 px-2.5 text-sm text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary [color-scheme:dark]"
        aria-label="From date"
      />
      <span className="text-xs text-brand-textSecondary/60">to</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onChange(dateFrom, e.target.value)}
        className="h-10 rounded-lg border border-input bg-white/5 px-2.5 text-sm text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary [color-scheme:dark]"
        aria-label="To date"
      />
      {(dateFrom || dateTo) && (
        <button
          onClick={() => onChange("", "")}
          className="text-xs text-brand-textSecondary/60 hover:text-white"
        >
          Clear
        </button>
      )}
    </div>
  );
}
