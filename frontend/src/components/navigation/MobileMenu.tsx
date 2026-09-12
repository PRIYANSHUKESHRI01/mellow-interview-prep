"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Search, Sparkles, LogIn, Code2 } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-surface border-l border-border-strong p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-down">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-control bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-primary">
                Code<span className="text-accent-primary">Forge</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-control text-text-muted hover:text-primary hover:bg-elevated transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-control bg-elevated border border-border-subtle text-text-muted text-sm text-left"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4" />
                <span>Search problems...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border-subtle rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const linkClassName =
                "flex items-center justify-between min-h-[46px] px-4 py-3 text-base font-semibold text-secondary hover:text-primary hover:bg-elevated rounded-control transition-colors active:scale-[0.99] touch-manipulation";
              const content = (
                <>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                      {link.badge}
                    </span>
                  )}
                </>
              );

              return link.href.startsWith("/") ? (
                <Link key={link.label} href={link.href} onClick={onClose} className={linkClassName}>
                  {content}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={onClose} className={linkClassName}>
                  {content}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 mt-6 border-t border-border-subtle flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">Theme</span>
            <ThemeToggle showLabels />
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-2.5 rounded-btn border border-border-subtle hover:border-border-strong text-xs font-semibold text-center text-text-secondary hover:text-primary bg-surface transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="w-full py-2.5 rounded-btn bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-bold text-center transition-all shadow-subtle flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
