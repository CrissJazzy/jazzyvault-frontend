"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, History } from "lucide-react";
import { toast } from "sonner";
import { useRunAiAction } from "@/lib/hooks/use-ai";
import { AiFilePicker } from "@/components/ai/ai-file-picker";
import { AiActionSelector } from "@/components/ai/ai-action-selector";
import { AiResultCard } from "@/components/ai/ai-result-card";
import { AiHistoryList } from "@/components/ai/ai-history-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AiRequest, AiRequestType, VaultFile } from "@/types";

export default function AiToolsPage() {
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [selectedAction, setSelectedAction] = useState<AiRequestType | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [result, setResult] = useState<AiRequest | null>(null);

  const runAction = useRunAiAction();

  const handleRun = async () => {
    if (!selectedFile || !selectedAction) return;

    try {
      const response = await runAction.mutateAsync({
        action: selectedAction,
        fileId: selectedFile.id,
        targetLanguage: selectedAction === "translate" ? targetLanguage : undefined,
      });
      setResult(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "The AI request failed. Please try again.";
      toast.error(message);
    }
  };

  const canRun =
    selectedFile &&
    selectedAction &&
    (selectedAction !== "translate" || targetLanguage.trim().length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Tools</h1>
        <p className="text-sm text-brand-textSecondary">
          Summarize, extract insights, simplify, translate, or analyze your documents
        </p>
      </div>

      <Card className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-medium text-brand-textSecondary">1. Choose a file</p>
          <AiFilePicker selectedFile={selectedFile} onSelect={setSelectedFile} />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-brand-textSecondary">2. Choose an action</p>
          <AiActionSelector selected={selectedAction} onSelect={setSelectedAction} />
        </div>

        {selectedAction === "translate" && (
          <div>
            <p className="mb-2 text-xs font-medium text-brand-textSecondary">3. Target language</p>
            <Input
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              placeholder="e.g. Spanish, French, Yoruba"
              className="max-w-xs"
            />
          </div>
        )}

        <Button
          onClick={handleRun}
          disabled={!canRun}
          isLoading={runAction.isPending}
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          Run
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>

      {result && <AiResultCard request={result} />}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-brand-textSecondary" />
          <h2 className="text-sm font-medium text-white">Request History</h2>
        </div>
        <AiHistoryList />
      </div>
    </div>
  );
}
