"use client";

import { Play, Send, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LANGUAGES_DATA } from "@/data/languages";
import { SupportedLanguage } from "@/types/common";

interface EditorToolbarProps {
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isRunning: boolean;
  isSubmitted: boolean;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function EditorToolbar({
  selectedLanguage,
  onSelectLanguage,
  isRunning,
  isSubmitted,
  onRun,
  onSubmit,
  onReset,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 bg-surface border-b border-border-subtle">
      {/* Language Selector Dropdown & Reset */}
      <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
        <div className="relative inline-flex items-center flex-1 sm:flex-initial">
          <select
            value={selectedLanguage.id}
            onChange={(e) => {
              const found = LANGUAGES_DATA.find((l) => l.id === e.target.value);
              if (found) onSelectLanguage(found);
            }}
            aria-label="Select programming language"
            className="w-full sm:w-auto appearance-none bg-elevated border border-border-subtle text-primary font-mono text-xs rounded-control pl-3 pr-8 py-2 sm:py-1.5 focus:outline-none focus:border-accent-primary cursor-pointer transition-colors"
          >
            {LANGUAGES_DATA.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name} ({lang.version})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={onReset}
          aria-label="Reset code to default snippet"
          title="Reset code"
          className="p-2 sm:p-1.5 text-text-muted hover:text-primary rounded-control hover:bg-elevated transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Editor Actions: 2 responsive full-width touch buttons on mobile, inline on desktop */}
      <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="secondary"
          size="sm"
          isLoading={isRunning && !isSubmitted}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          onClick={onRun}
          className="w-full sm:w-auto justify-center"
        >
          Run Code
        </Button>

        <Button
          variant="primary"
          size="sm"
          isLoading={isRunning && isSubmitted}
          leftIcon={<Send className="w-3.5 h-3.5" />}
          onClick={onSubmit}
          className="w-full sm:w-auto justify-center shadow-glow"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
