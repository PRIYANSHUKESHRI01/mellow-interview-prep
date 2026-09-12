"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "secondary";
  className?: string;
}

const TONE: Record<NonNullable<StatTileProps["tone"]>, { icon: string; hint: string }> = {
  primary: { icon: "bg-accent-primary/10 text-accent-primary border-accent-primary/20", hint: "text-accent-primary" },
  secondary: {
    icon: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
    hint: "text-accent-secondary",
  },
  success: { icon: "bg-status-success/10 text-status-success border-status-success/20", hint: "text-status-success" },
  warning: { icon: "bg-status-warning/10 text-status-warning border-status-warning/20", hint: "text-status-warning" },
  danger: { icon: "bg-status-danger/10 text-status-danger border-status-danger/20", hint: "text-status-danger" },
};

export function StatTile({ label, value, suffix, icon: Icon, hint, tone = "primary", className }: StatTileProps) {
  const t = TONE[tone];

  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-panel bg-surface border border-border-subtle shadow-subtle hover:border-border-strong transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider leading-tight">
          {label}
        </span>
        <div className={cn("w-8 h-8 rounded-control border flex items-center justify-center shrink-0", t.icon)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-[26px] font-black text-primary tracking-tight font-mono leading-none">
          {value}
        </span>
        {suffix && <span className="text-xs text-text-muted font-medium">{suffix}</span>}
      </div>
      {hint && <p className={cn("mt-1.5 text-[11px] font-medium", t.hint)}>{hint}</p>}
    </div>
  );
}
