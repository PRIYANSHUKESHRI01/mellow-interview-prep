"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { ThemeMode } from "@/types/common";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

export function ThemeToggle({ className, showLabels = false, compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("codepulse-theme") as ThemeMode | null;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      setTheme("light");
      applyTheme("light");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentSaved = localStorage.getItem("codepulse-theme");
      if (currentSaved === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    const isDark =
      newTheme === "dark" ||
      (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  };

  const handleSelect = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    localStorage.setItem("codepulse-theme", nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-24 rounded-control bg-surface border border-border-subtle animate-pulse",
          className
        )}
      />
    );
  }

  const options: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
    { mode: "light", icon: Sun, label: "Light" },
    { mode: "system", icon: Monitor, label: "System" },
    { mode: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className={cn(
        "inline-flex items-center rounded-control bg-surface border border-border-subtle transition-colors shadow-subtle",
        compact ? "p-0.5 gap-0.5" : "p-1",
        className
      )}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            role="radio"
            aria-checked={isActive}
            aria-label={`${opt.label} theme`}
            title={`${opt.label} theme`}
            type="button"
            onClick={() => handleSelect(opt.mode)}
            className={cn(
              "flex items-center justify-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none touch-manipulation cursor-pointer active:scale-95",
              compact
                ? "h-7 w-7 rounded-[6px] text-xs"
                : "min-h-[32px] px-2.5 py-1.5 rounded-[7px] text-xs font-medium gap-1.5",
              isActive
                ? "bg-elevated text-primary shadow-sm border border-border-strong font-bold"
                : "text-muted hover:text-primary hover:bg-surface-hover"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {!compact && showLabels && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
