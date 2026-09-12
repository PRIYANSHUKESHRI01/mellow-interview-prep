"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  icon: ReactNode;
  variant?: "default" | "ghost" | "outline" | "primary";
  size?: "sm" | "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, "aria-label": ariaLabel, icon, variant = "ghost", size = "md", disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: "w-8 h-8",
      md: "w-9 h-9",
      lg: "w-11 h-11",
    };

    const variantStyles = {
      default: "bg-surface border border-border-subtle text-text-secondary hover:text-primary hover:bg-surface-hover",
      ghost: "text-text-secondary hover:text-primary hover:bg-surface-hover active:bg-surface",
      outline: "border border-border-subtle text-text-secondary hover:text-primary hover:border-border-strong",
      primary: "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-sm",
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-control transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
