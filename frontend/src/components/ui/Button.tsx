"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.97] touch-manipulation cursor-pointer";

    const sizeStyles = {
      sm: "min-h-[36px] sm:min-h-[32px] h-9 sm:h-8 px-3.5 sm:px-3 text-xs gap-1.5",
      md: "min-h-[44px] sm:min-h-[40px] h-11 sm:h-10 px-4 text-sm gap-2 font-semibold sm:font-medium",
      lg: "min-h-[48px] h-12 sm:h-12 px-5 sm:px-6 text-sm sm:text-base gap-2.5 font-bold sm:font-semibold",
    };

    const variantStyles = {
      primary:
        "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-sm hover:shadow-glow active:bg-accent-primary-hover/90",
      secondary:
        "bg-surface text-primary border border-border-strong hover:bg-surface-hover hover:border-text-secondary active:bg-surface",
      ghost:
        "text-text-secondary hover:text-primary hover:bg-surface-hover active:bg-surface",
      outline:
        "border border-border-subtle text-primary hover:border-accent-primary hover:text-accent-primary bg-transparent",
      danger:
        "bg-status-danger text-white hover:bg-red-600 shadow-sm active:bg-red-700",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
