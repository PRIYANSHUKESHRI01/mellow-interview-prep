import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12 sm:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
      {...props}
    >
      {badge && (
        <div className="mb-3">
          <Badge variant="primary" size="md">
            {badge}
          </Badge>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-[1.15]">
        {title}{" "}
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-indigo-400 to-accent-secondary">
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
