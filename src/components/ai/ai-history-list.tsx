"use client";

import { useState } from "react";
import { ChevronDown, Inbox, Copy, Check } from "lucide-react";
import { useAiHistory } from "@/lib/hooks/use-ai";
import { AiStatusBadge } from "@/components/ai/ai-status-badge";
import { AI_ACTIONS } from "@/components/ai/ai-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AiRequest } from "@/types";

function ActionLabel({ type }: { type: AiRequest["request_type"] }) {
  const action = AI_ACTIONS.find((a) => a.value === type);
  if (!action) return <span className="capitalize">{type}</span>;
  const Icon = action.icon;
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-brand-textSecondary" />
      {action.label}
    </span>
  );
}

function HistoryRow({ request }: { request: AiRequest }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!request.response) return;
    await navigator.clipboard.writeText(request.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ActionLabel type={request.request_type} />
          <span className="text-xs text-brand-textSecondary/60">
            {new Date(request.created_at).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AiStatusBadge status={request.status} />
          <ChevronDown
            className={cn(
              "h-4 w-4 text-brand-textSecondary/60 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-4 py-3">
          {request.status === "failed" ? (
            <p className="text-xs text-red-400">
              {request.error_message || "This request failed."}
            </p>
          ) : request.response ? (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-brand-textSecondary hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm text-white">
                {request.response}
              </p>
            </div>
          ) : (
            <p className="text-xs text-brand-textSecondary/60">No response yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function AiHistoryList() {
  const { data, isLoading, isError } = useAiHistory(50);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-brand-textSecondary">
        Couldn&apos;t load AI request history. Is the backend running?
      </p>
    );
  }

  if (!data || data.requests.length === 0) {
    return (
      <div className="py-16 text-center">
        <Inbox className="mx-auto mb-2 h-8 w-8 text-brand-textSecondary/40" />
        <p className="text-sm text-brand-textSecondary">
          No AI requests yet. Run one above to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.requests.map((request) => (
        <HistoryRow key={request.id} request={request} />
      ))}
    </div>
  );
}
