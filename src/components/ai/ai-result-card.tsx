"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AiRequest } from "@/types";

function FormattedResponse({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed text-white">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-brand-accent">•</span>
              <span>{trimmed.replace(/^[-•]\s*/, "")}</span>
            </div>
          );
        }
        if (/^#{1,3}\s/.test(trimmed)) {
          return (
            <p key={i} className="pt-2 font-semibold text-white">
              {trimmed.replace(/^#{1,3}\s*/, "")}
            </p>
          );
        }
        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}

export function AiResultCard({ request }: { request: AiRequest }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!request.response) return;
    await navigator.clipboard.writeText(request.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (request.status === "failed") {
    return (
      <Card className="border-red-500/20">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">Request failed</p>
            <p className="mt-1 text-xs text-brand-textSecondary">
              {request.error_message || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!request.response) return null;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-textSecondary/70">
          {request.request_type}
        </span>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <FormattedResponse text={request.response} />
    </Card>
  );
}
