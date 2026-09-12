"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  /** Minutes from first render until the event starts. */
  minutesFromNow: number;
  className?: string;
  compact?: boolean;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({ minutesFromNow, className, compact = false }: CountdownTimerProps) {
  // Resolve the target once on mount so the ticking is stable across renders
  // (and never runs during SSR, avoiding hydration mismatch).
  const [target, setTarget] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(minutesFromNow * 60);

  useEffect(() => {
    const t = Date.now() + minutesFromNow * 60 * 1000;
    setTarget(t);
    setRemaining(Math.max(0, Math.floor((t - Date.now()) / 1000)));
  }, [minutesFromNow]);

  useEffect(() => {
    if (target === null) return;
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  if (compact) {
    return (
      <span className={cn("font-mono tabular-nums", className)}>
        {days > 0 ? `${days}d ` : ""}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  const blocks = [
    ...(days > 0 ? [{ value: days, unit: "days" }] : []),
    { value: hours, unit: "hrs" },
    { value: minutes, unit: "min" },
    { value: seconds, unit: "sec" },
  ];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {blocks.map((b) => (
        <div
          key={b.unit}
          className="px-2.5 py-1.5 rounded-control bg-elevated border border-border-subtle text-center min-w-[46px]"
        >
          <div className="text-base font-black font-mono tabular-nums text-primary leading-none">{pad(b.value)}</div>
          <div className="text-[9px] uppercase tracking-wider text-text-muted mt-0.5">{b.unit}</div>
        </div>
      ))}
    </div>
  );
}
