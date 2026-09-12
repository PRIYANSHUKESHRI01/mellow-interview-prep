import { UserStats, RatingHistoryPoint, ActivityDay } from "@/types/common";

export interface PlatformStat {
  id: string;
  value: string;
  numericValue: number;
  label: string;
  sublabel: string;
  trend: string;
  trendShort: string;
  trendMicro: string;
  colorScheme: "indigo" | "cyan" | "amber" | "emerald";
}

export const PLATFORM_STATS: PlatformStat[] = [
  {
    id: "problems-solved",
    value: "100K+",
    numericValue: 100000,
    label: "Problems Solved",
    sublabel: "Across all algorithmic categories",
    trend: "+14% this month",
    trendShort: "+14% MoM",
    trendMicro: "+14%",
    colorScheme: "indigo",
  },
  {
    id: "active-developers",
    value: "25K+",
    numericValue: 25000,
    label: "Active Developers",
    sublabel: "Practicing and competing weekly",
    trend: "+2.4K new coders",
    trendShort: "+2.4K Devs",
    trendMicro: "+2.4K",
    colorScheme: "cyan",
  },
  {
    id: "weekly-contests",
    value: "500+",
    numericValue: 500,
    label: "Weekly Contests",
    sublabel: "Organized with official rating updates",
    trend: "Every Saturday & Sunday",
    trendShort: "Every Sat/Sun",
    trendMicro: "Weekend",
    colorScheme: "amber",
  },
  {
    id: "supported-languages",
    value: "20+",
    numericValue: 20,
    label: "Supported Languages",
    sublabel: "With sandboxed low-latency judges",
    trend: "Modern compilers & runtimes",
    trendShort: "20+ Runtimes",
    trendMicro: "20+ Langs",
    colorScheme: "emerald",
  },
];

export const DEMO_USER_STATS: UserStats = {
  rating: 1842,
  solved: 327,
  acceptanceRate: 78.4,
  contestRank: 1284,
  currentStreak: 21,
  maxStreak: 45,
  totalSubmissions: 417,
  easyCount: 145,
  easyTotal: 200,
  mediumCount: 142,
  mediumTotal: 300,
  hardCount: 40,
  hardTotal: 150,
};

export const DEMO_RATING_HISTORY: RatingHistoryPoint[] = [
  { contestName: "Contest #18", rating: 1510, rank: 4120, date: "Jul 1" },
  { contestName: "Contest #19", rating: 1585, rank: 3210, date: "Jul 15" },
  { contestName: "Contest #20", rating: 1640, rank: 2650, date: "Aug 1" },
  { contestName: "Contest #21", rating: 1715, rank: 1980, date: "Aug 15" },
  { contestName: "Contest #22", rating: 1690, rank: 2200, date: "Aug 29" },
  { contestName: "Contest #23", rating: 1780, rank: 1540, date: "Sep 5" },
  { contestName: "Contest #24", rating: 1842, rank: 1284, date: "Sep 11" },
];

// Generate 12 weeks of realistic commit activity
export const DEMO_ACTIVITY_GRID: ActivityDay[] = Array.from({ length: 84 }).map((_, i) => {
  const levels: (0 | 1 | 2 | 3 | 4)[] = [0, 1, 2, 2, 3, 3, 4, 1, 2, 0, 3, 4, 2, 1];
  const level = levels[i % levels.length];
  const counts = [0, 2, 4, 7, 12];
  return {
    date: `Day -${84 - i}`,
    count: counts[level],
    level,
  };
});
