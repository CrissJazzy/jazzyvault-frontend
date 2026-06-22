"use client";

import { ConversionHistoryTable } from "@/components/dashboard/conversion-history-table";

export default function ConversionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Conversion History</h1>
        <p className="text-sm text-brand-textSecondary">
          Search, filter, and re-download your past conversions. Start a new
          one from <span className="text-brand-accent">My Files</span>.
        </p>
      </div>

      <ConversionHistoryTable />
    </div>
  );
}
