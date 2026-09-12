export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  acceptanceRate: number; // percentage (e.g. 74.2)
  solved: boolean;
  totalSubmissions: number;
  description?: string;
  sampleInput?: string;
  sampleOutput?: string;
}

export type ProblemFilter = "All" | Difficulty;
