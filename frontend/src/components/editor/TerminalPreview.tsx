"use client";

import { useState } from "react";
import { CheckCircle2, Clock, HardDrive, Terminal as TerminalIcon, ShieldCheck, Zap, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface ExecutionResult {
  status: "idle" | "running" | "accepted" | "error";
  verdict: string;
  runtime: number; // ms
  memory: number; // MB
  testCasesPassed: number;
  totalTestCases: number;
  output: string;
  submittedAt?: string;
}

interface TerminalPreviewProps {
  result: ExecutionResult;
  languageName: string;
}

export function TerminalPreview({ result, languageName }: TerminalPreviewProps) {
  const [selectedCase, setSelectedCase] = useState<number>(1);

  const testCases = [
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      expected: "[0,1]",
      actual: "[0,1]",
      status: "Passed",
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      expected: "[1,2]",
      actual: "[1,2]",
      status: "Passed",
    },
    {
      id: 3,
      input: "nums = [3,3], target = 6",
      expected: "[0,1]",
      actual: "[0,1]",
      status: "Passed",
    },
  ];

  return (
    <div className="bg-surface border-t border-border-subtle p-4 font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle mb-3">
        <div className="flex items-center gap-2 text-text-secondary">
          <TerminalIcon className="w-4 h-4 text-accent-primary" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">Judge Console</span>
          <span className="px-1.5 py-0.2 rounded bg-elevated border border-border-subtle text-[10px] text-emerald-400">
            Isolated Sandbox
          </span>
        </div>
        <div className="text-[11px] text-text-muted flex items-center gap-3">
          <span className="hidden sm:inline">Engine: <strong className="text-primary font-bold">Linux x86_64</strong></span>
          <span>Target: <strong className="text-primary">{languageName}</strong></span>
        </div>
      </div>

      {/* Terminal Content States */}
      {result.status === "idle" && (
        <div className="text-text-muted py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span>Ready. Click &ldquo;Run Code&rdquo; or &ldquo;Submit&rdquo; to test solution against judge suite...</span>
          </div>
          <span className="text-[11px] text-text-muted/70 font-bold">Awaiting Execution</span>
        </div>
      )}

      {result.status === "running" && (
        <div className="py-3 flex items-center gap-3 text-text-secondary">
          <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <span>Compiling solution with <code className="text-accent-primary">{languageName}</code> & executing 35 sandboxed test suites...</span>
        </div>
      )}

      {result.status === "accepted" && (
        <div className="space-y-3">
          {/* Verdict Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-control bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-emerald-400 font-extrabold text-sm block leading-none">
                  Accepted ✓
                </span>
                <span className="text-[10px] text-text-muted">
                  Beats 96.8% of competitive submissions
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-text-secondary bg-surface/80 px-2.5 py-1 rounded border border-border-subtle">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Runtime: <strong className="text-primary">{result.runtime} ms</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary bg-surface/80 px-2.5 py-1 rounded border border-border-subtle">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span>Memory: <strong className="text-primary">{result.memory} MB</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary bg-surface/80 px-2.5 py-1 rounded border border-border-subtle">
                <Cpu className="w-3.5 h-3.5 text-accent-primary" />
                <span>Complexity: <strong className="text-emerald-400">O(N)</strong></span>
              </div>
            </div>
          </div>

          {/* Test Case Inspector Tabs */}
          <div className="bg-elevated rounded-control border border-border-subtle p-3">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-subtle">
              <span className="text-[10px] uppercase tracking-wider text-text-muted mr-1">
                Sample Testcases:
              </span>
              {testCases.map((tc) => (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => setSelectedCase(tc.id)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-mono transition-all",
                    selectedCase === tc.id
                      ? "bg-surface text-primary border border-border-strong font-bold shadow-sm"
                      : "text-text-muted hover:text-primary hover:bg-surface-hover"
                  )}
                >
                  Case {tc.id} <span className="text-emerald-400 font-bold ml-1">✓</span>
                </button>
              ))}
            </div>

            {/* Selected case details */}
            {testCases
              .filter((tc) => tc.id === selectedCase)
              .map((tc) => (
                <div key={tc.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-[10px] w-16 uppercase">Input:</span>
                    <code className="text-text-primary bg-surface px-2 py-0.5 rounded border border-border-subtle">
                      {tc.input}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-[10px] w-16 uppercase">Expected:</span>
                    <code className="text-text-secondary bg-surface px-2 py-0.5 rounded border border-border-subtle">
                      {tc.expected}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-[10px] w-16 uppercase">Output:</span>
                    <code className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {tc.actual}
                    </code>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
