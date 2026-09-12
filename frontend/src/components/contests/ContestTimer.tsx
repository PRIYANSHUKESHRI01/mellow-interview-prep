"use client";

import { useState, useEffect } from "react";
import { formatTimeRemaining } from "@/lib/formatters";

interface ContestTimerProps {
  initialSeconds?: number;
  onFinish?: () => void;
}

export function ContestTimer({ initialSeconds = 6138 }: ContestTimerProps) {
  // Default to 01h 42m 18s (6138 seconds)
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const { hours, minutes, seconds } = formatTimeRemaining(timeLeft);

  return (
    <div className="inline-flex items-center gap-1.5 font-mono">
      <div className="flex flex-col items-center">
        <span className="px-2 py-1 rounded bg-elevated border border-border-subtle text-primary text-sm font-bold">
          {hours}
        </span>
        <span className="text-[9px] text-text-muted mt-0.5">HRS</span>
      </div>
      <span className="text-text-muted font-bold text-sm mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="px-2 py-1 rounded bg-elevated border border-border-subtle text-primary text-sm font-bold">
          {minutes}
        </span>
        <span className="text-[9px] text-text-muted mt-0.5">MIN</span>
      </div>
      <span className="text-text-muted font-bold text-sm mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="px-2 py-1 rounded bg-elevated border border-border-subtle text-accent-primary text-sm font-bold">
          {seconds}
        </span>
        <span className="text-[9px] text-text-muted mt-0.5">SEC</span>
      </div>
    </div>
  );
}
