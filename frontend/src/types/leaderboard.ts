export type LeaderboardDivision = "Global" | "Div1" | "Div2" | "College";

export interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  rating: number;
  solvedCount: number;
  score: number;
  country: string;
  countryCode: string;
  avatarUrl: string;
  division: LeaderboardDivision;
  trend: "up" | "down" | "same";
  rankChange?: number;
}
