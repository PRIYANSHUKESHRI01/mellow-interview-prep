export type ThemeMode = "light" | "dark" | "system";

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface UserStats {
  rating: number;
  solved: number;
  acceptanceRate: number;
  contestRank: number;
  currentStreak: number;
  maxStreak: number;
  totalSubmissions: number;
  easyCount: number;
  easyTotal: number;
  mediumCount: number;
  mediumTotal: number;
  hardCount: number;
  hardTotal: number;
}

export interface RatingHistoryPoint {
  contestName: string;
  rating: number;
  rank: number;
  date: string;
}

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  organization: string;
  rating: number;
  avatarUrl: string;
}

export interface SupportedLanguage {
  id: string;
  name: string;
  version: string;
  compiler: string;
  speedTier: "Fastest" | "Fast" | "Balanced";
  defaultSnippet: string;
  popularity: string;
}
