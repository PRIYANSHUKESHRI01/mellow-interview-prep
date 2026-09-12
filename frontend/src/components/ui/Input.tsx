"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  onClear?: () => void;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, onClear, value, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            value={value}
            disabled={disabled}
            className={cn(
              "w-full h-10 rounded-control bg-surface border border-border-subtle px-3.5 text-sm text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              onClear && value && "pr-10",
              error && "border-status-danger focus:border-status-danger focus:ring-status-danger",
              className
            )}
            {...props}
          />
          {onClear && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className="absolute right-3 p-1 rounded hover:bg-surface-hover text-text-muted hover:text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-status-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
