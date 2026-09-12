"use client";

import { FileCode, FileText, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  fileName: string;
}

export function EditorTabs({ activeTab, onSelectTab, fileName }: EditorTabsProps) {
  const tabs = [
    { id: "main", name: fileName, icon: FileCode },
    { id: "header", name: "solution.h", icon: Code },
    { id: "testcases", name: "testcases.in", icon: FileText },
  ];

  return (
    <div className="flex items-center overflow-x-auto bg-surface border-b border-border-subtle px-2 pt-1 gap-1 text-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-t-control border-t border-x font-mono transition-colors whitespace-nowrap",
              isActive
                ? "bg-elevated border-border-subtle border-b-transparent text-primary font-medium"
                : "border-transparent text-text-muted hover:text-primary hover:bg-surface-hover"
            )}
          >
            <Icon className="w-3.5 h-3.5 text-accent-primary" />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
