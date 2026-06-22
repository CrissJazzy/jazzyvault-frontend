"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, RefreshCw, Sparkles, Loader2, X } from "lucide-react";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import { useGlobalSearch } from "@/lib/hooks/use-global-search";
import type { SearchResult } from "@/types";

const TYPE_ICON = {
  file: FileText,
  conversion: RefreshCw,
  ai_request: Sparkles,
} as const;

const TYPE_LABEL = {
  file: "File",
  conversion: "Conversion",
  ai_request: "AI Request",
} as const;

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 300);

  const { data, isLoading } = useGlobalSearch(query);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setInput("");
      setQuery("");
    }
  }, [isOpen]);

  const handleInputChange = (value: string) => {
    setInput(value);
    debouncedSetQuery(value);
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    router.push(result.link);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-brand-textSecondary hover:border-white/20 hover:text-white sm:w-56"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-brand-textSecondary/60 sm:inline">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="glass-card w-full max-w-lg rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3.5">
              <Search className="h-4 w-4 text-brand-textSecondary/60" />
              <input
                autoFocus
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search files, conversions, AI requests…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-brand-textSecondary/40 focus:outline-none"
              />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-brand-textSecondary" />}
              <button onClick={() => setIsOpen(false)} className="text-brand-textSecondary/60 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {query.trim().length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-brand-textSecondary/60">
                  Start typing to search across your files, conversions, and AI requests.
                </p>
              )}

              {query.trim().length > 0 && !isLoading && data?.results.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-brand-textSecondary/60">
                  No results for &quot;{query}&quot;.
                </p>
              )}

              {data?.results.map((result) => {
                const Icon = TYPE_ICON[result.type];
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <Icon className="h-3.5 w-3.5 text-brand-textSecondary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{result.title}</p>
                      <p className="truncate text-xs text-brand-textSecondary/60">
                        {TYPE_LABEL[result.type]} • {result.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
