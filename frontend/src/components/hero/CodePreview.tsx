"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { LANGUAGES_DATA } from "@/data/languages";
import { SupportedLanguage } from "@/types/common";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { EditorTabs } from "@/components/editor/EditorTabs";
import { MonacoPreview } from "@/components/editor/MonacoPreview";
import { TerminalPreview, ExecutionResult } from "@/components/editor/TerminalPreview";
import { Sparkles, Shield, Cpu } from "lucide-react";

export function CodePreview() {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    LANGUAGES_DATA[0] // C++
  );
  const [code, setCode] = useState<string>(LANGUAGES_DATA[0].defaultSnippet);
  const [activeTab, setActiveTab] = useState<string>("main");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    status: "idle",
    verdict: "",
    runtime: 0,
    memory: 0,
    testCasesPassed: 0,
    totalTestCases: 35,
    output: "",
  });

  // Handle language change
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setCode(lang.defaultSnippet);
  };

  // Reset code snippet
  const handleReset = () => {
    setCode(selectedLanguage.defaultSnippet);
    setExecutionResult({
      status: "idle",
      verdict: "",
      runtime: 0,
      memory: 0,
      testCasesPassed: 0,
      totalTestCases: 35,
      output: "",
    });
  };

  // File extension mapping for the tab header
  const getFileExtension = (langId: string) => {
    switch (langId) {
      case "cpp":
        return "main.cpp";
      case "python":
        return "solution.py";
      case "java":
        return "Solution.java";
      case "javascript":
        return "solution.js";
      case "rust":
        return "main.rs";
      default:
        return "main.cpp";
    }
  };

  // Simulate Run Code execution
  const handleRun = () => {
    setIsRunning(true);
    setIsSubmitted(false);

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: "accepted",
        verdict: "Accepted",
        runtime: 42,
        memory: 16.4,
        testCasesPassed: 35,
        totalTestCases: 35,
        output: "[0, 1]\n\nAll 35 sample test suites verified successfully.\nCPU time: 0.042s | Memory usage: 16.4MB",
      });
    }, 700);
  };

  // Simulate Submit Solution execution
  const handleSubmit = () => {
    setIsRunning(true);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: "accepted",
        verdict: "Accepted",
        runtime: 38,
        memory: 15.8,
        testCasesPassed: 35,
        totalTestCases: 35,
        output: "[0, 1]\n\nFinal Judge Verdict: Accepted ✓\nRank: Top 3.2% of submissions for this problem.\nRating delta: +18 points.",
      });

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#6366F1", "#06B6D4", "#10B981"],
        });
      } catch (e) {}
    }, 900);
  };

  return (
    <div
      id="editor-preview"
      className="relative w-full max-w-5xl mx-auto rounded-card lg:rounded-panel bg-surface border border-border-strong shadow-2xl overflow-hidden transition-all duration-300 group hover:border-accent-primary/40"
    >
      {/* Top ambient hairline */}
      <div className="absolute top-0 inset-x-0 h-px gradient-hairline opacity-75" />

      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface/90 backdrop-blur-sm border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block hover:opacity-100 transition-opacity cursor-pointer" title="Close" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block hover:opacity-100 transition-opacity cursor-pointer" title="Minimize" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block hover:opacity-100 transition-opacity cursor-pointer" title="Expand" />
          <span className="ml-2.5 text-xs font-mono text-text-muted hidden sm:inline-flex items-center gap-1.5">
            <span className="text-primary font-bold">CodeForge IDE</span>
            <span className="text-border-strong">&bull;</span>
            <span>Problem #001: Two Sum</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Easy</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono text-text-muted">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-elevated border border-border-subtle text-[11px]">
            <Cpu className="w-3 h-3 text-accent-secondary" />
            g++20 -O3
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-elevated border border-border-subtle text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Judge Ready
          </span>
        </div>
      </div>

      {/* Editor Toolbar (Language selector, Run, Submit) */}
      <EditorToolbar
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleLanguageChange}
        isRunning={isRunning}
        isSubmitted={isSubmitted}
        onRun={handleRun}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {/* Editor Tabs */}
      <EditorTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        fileName={getFileExtension(selectedLanguage.id)}
      />

      {/* Monaco Code Editor */}
      <MonacoPreview
        code={code}
        language={selectedLanguage.id}
        onChange={(val) => setCode(val || "")}
        height="320px"
      />

      {/* Terminal / Judge Output */}
      <TerminalPreview
        result={executionResult}
        languageName={`${selectedLanguage.name} (${selectedLanguage.version})`}
      />
    </div>
  );
}
