import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "live";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", dot = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center font-medium tracking-wide transition-colors border select-none";

    const sizeStyles = {
      sm: "text-[11px] px-2 py-0.5 rounded-[6px] gap-1.5",
      md: "text-xs px-2.5 py-1 rounded-[7px] gap-1.5",
    };

    const variantStyles = {
      default: "bg-surface text-text-secondary border-border-subtle",
      primary: "bg-accent-primary/10 text-accent-primary border-accent-primary/25",
      secondary: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/25",
      success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
      warning: "bg-amber-500/10 text-amber-500 border-amber-500/25",
      danger: "bg-rose-500/10 text-rose-500 border-rose-500/25",
      outline: "bg-transparent text-text-secondary border-border-subtle",
      live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              variant === "live" || variant === "success"
                ? "bg-emerald-400 animate-pulse"
                : variant === "warning"
                ? "bg-amber-400"
                : variant === "danger"
                ? "bg-rose-400"
                : "bg-accent-primary"
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
