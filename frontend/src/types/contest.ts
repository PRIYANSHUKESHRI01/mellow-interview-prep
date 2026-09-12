import { Difficulty } from "./problem";

export type ContestStatus = "LIVE" | "UPCOMING" | "ENDED";

export interface ContestProblem {
  code: string;
  title: string;
  difficulty: Difficulty;
  points: number;
  solvedCount: number;
}

export interface ContestLeaderboardItem {
  rank: number;
  handle: string;
  avatar: string;
  score: number;
  penaltyTime: string;
}

export interface Contest {
  id: string;
  title: string;
  number: number;
  slug: string;
  status: ContestStatus;
  startTime: string; // ISO or relative
  endTime: string;
  duration: string;
  participantsCount: number;
  problems: ContestProblem[];
  division: string;
  recentSolvers: ContestLeaderboardItem[];
}
