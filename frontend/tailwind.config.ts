import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Declared in full (not via extend) so `xs` sorts before `sm` — extending
    // would append it after 2xl and let xs: utilities override larger
    // breakpoints. Several components already relied on an `xs` breakpoint
    // that was never defined, so they rendered permanently hidden.
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        background: "var(--bg-background)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        "surface-hover": "var(--bg-surface-hover)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "accent-primary": "var(--accent-primary)",
        "accent-primary-hover": "var(--accent-primary-hover)",
        "accent-primary-light": "var(--accent-primary-light)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-secondary-hover": "var(--accent-secondary-hover)",
        "status-success": "var(--status-success)",
        "status-warning": "var(--status-warning)",
        "status-danger": "var(--status-danger)",
      },
      borderRadius: {
        control: "9px",
        btn: "11px",
        card: "18px",
        panel: "24px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "Geist Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
        glow: "0 0 25px -5px var(--accent-primary-light)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.25)",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-down": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-down": "slide-down 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
