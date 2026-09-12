import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Divider({
  className,
  orientation = "horizontal",
  label,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-px h-full bg-border-subtle shrink-0", className)}
      />
    );
  }

  if (label) {
    return (
      <div className={cn("relative flex py-4 items-center w-full", className)}>
        <div className="flex-grow border-t border-border-subtle" />
        <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-text-muted font-mono font-medium">
          {label}
        </span>
        <div className="flex-grow border-t border-border-subtle" />
      </div>
    );
  }

  return (
    <hr
      className={cn("w-full border-0 border-t border-border-subtle my-6", className)}
      {...props}
    />
  );
}
