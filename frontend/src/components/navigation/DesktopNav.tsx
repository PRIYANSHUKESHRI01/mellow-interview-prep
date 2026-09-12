"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/data/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Sparkles } from "lucide-react";

interface DesktopNavProps {
  onOpenSearch?: () => void;
}

export function DesktopNav({ onOpenSearch }: DesktopNavProps) {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {/* Navigation Links */}
      <nav className="flex items-center gap-1" aria-label="Main Navigation">
        {NAV_LINKS.map((link) => {
          const linkClassName =
            "relative px-3.5 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors rounded-control hover:bg-surface";
          const content = (
            <>
              <span>{link.label}</span>
              {link.badge && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                  {link.badge}
                </span>
              )}
            </>
          );

          return link.href.startsWith("/") ? (
            <Link key={link.label} href={link.href} className={linkClassName}>
              {content}
            </Link>
          ) : (
            <a key={link.label} href={link.href} className={linkClassName}>
              {content}
            </a>
          );
        })}
      </nav>

      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex items-center gap-3 px-3 py-1.5 rounded-control bg-surface border border-border-subtle text-text-muted hover:text-primary hover:border-border-strong text-xs transition-all shadow-subtle"
        aria-label="Search problems and topics"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden xl:inline">Search problems...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-elevated border border-border-subtle rounded text-text-muted">
          ⌘K
        </kbd>
      </button>

      {/* Theme Toggle (Desktop) */}
      <ThemeToggle />

      {/* Auth Actions */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="px-3.5 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors rounded-control hover:bg-surface"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="flex items-center gap-1.5 px-4 py-2 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold transition-all shadow-subtle hover:shadow-glow"
        >
          <span>Get Started</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
