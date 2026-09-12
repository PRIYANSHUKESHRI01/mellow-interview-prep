"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code2, Terminal } from "lucide-react";
import { Container } from "./Container";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { PROBLEMS_DATA } from "@/data/problems";
import { Problem } from "@/types/problem";
import { getDifficultyStyle } from "@/lib/formatters";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Problem[]>([]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Live filter in search modal
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(PROBLEMS_DATA.slice(0, 5));
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = PROBLEMS_DATA.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
      setSearchResults(filtered.slice(0, 6));
    }
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/85 backdrop-blur-md transition-colors">
        {/* Top subtle gradient hairline */}
        <div className="absolute top-0 inset-x-0 h-px gradient-hairline opacity-75" />
        <Container size="xl">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-control"
            >
              <div className="w-9 h-9 rounded-control bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:scale-105 transition-transform duration-200 shadow-subtle">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-primary leading-none">
                  Code<span className="text-accent-primary">Forge</span>
                </span>
                <span className="text-[10px] font-mono text-text-muted tracking-wider uppercase">
                  Arena &bull; Judge
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav onOpenSearch={() => setSearchOpen(true)} />

            {/* Mobile Navigation Controls */}
            <MobileNav onToggleMenu={() => setMobileMenuOpen(true)} />
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Search Modal (Cmd+K / Ctrl+K) */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick problem search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-card bg-surface border border-border-strong shadow-2xl overflow-hidden animate-slide-down">
            <div className="p-4 border-b border-border-subtle flex items-center gap-3">
              <Terminal className="w-5 h-5 text-accent-primary shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search algorithms, data structures, or problem names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-primary placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="px-2 py-0.5 text-[11px] font-mono bg-elevated border border-border-subtle rounded text-text-muted">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted px-3 py-1.5">
                Suggested Problems
              </div>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-muted">
                  No problems found matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                searchResults.map((problem) => {
                  const diffStyle = getDifficultyStyle(problem.difficulty);
                  return (
                    <a
                      key={problem.id}
                      href="#problems"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-control hover:bg-elevated transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            problem.difficulty === "Easy"
                              ? "bg-emerald-400"
                              : problem.difficulty === "Medium"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                        />
                        <span className="text-sm font-medium text-primary group-hover:text-accent-primary transition-colors">
                          {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${diffStyle.badgeClass}`}
                        >
                          {problem.difficulty}
                        </span>
                        <span className="text-xs text-text-muted font-mono">
                          {problem.acceptanceRate}%
                        </span>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
