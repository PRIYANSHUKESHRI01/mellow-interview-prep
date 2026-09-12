export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Fine grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40" />

      {/* Subtle radial glow from top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-accent-primary/10 via-accent-secondary/5 to-transparent blur-3xl opacity-70 dark:opacity-50" />

      {/* Side subtle ambient color patches */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-accent-primary/5 blur-3xl" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 rounded-full bg-accent-secondary/5 blur-3xl" />

      {/* Bottom fade mask to blend smoothly into page content */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
