"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface MobileNavProps {
  onToggleMenu: () => void;
}

export function MobileNav({ onToggleMenu }: MobileNavProps) {
  return (
    <div className="flex lg:hidden items-center gap-2">
      <ThemeToggle />
      <button
        type="button"
        onClick={onToggleMenu}
        aria-label="Toggle navigation menu"
        className="w-10 h-10 rounded-control bg-surface border border-border-subtle text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-primary flex items-center justify-center touch-manipulation active:scale-95 shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
}
