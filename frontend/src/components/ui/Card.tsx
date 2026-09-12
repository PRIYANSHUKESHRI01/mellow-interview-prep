import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated" | "interactive" | "featured";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", glow = false, children, ...props }, ref) => {
    const baseStyles =
      "relative rounded-card transition-all duration-200 overflow-hidden";

    const variantStyles = {
      default:
        "bg-surface border border-border-subtle shadow-sm",
      elevated:
        "bg-elevated border border-border-strong shadow-card",
      interactive:
        "bg-surface border border-border-subtle hover:border-border-strong hover:bg-surface-hover hover:-translate-y-0.5 shadow-sm hover:shadow-card cursor-pointer",
      featured:
        "bg-surface border border-accent-primary/40 shadow-glow relative",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          glow && "shadow-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
