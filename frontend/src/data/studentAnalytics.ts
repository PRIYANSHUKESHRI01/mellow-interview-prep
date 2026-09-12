// Richer student-side mock data powering the candidate dashboard, practice
// arena, and performance report. Identity/stat basics still live in
// mockDashboardData.ts (STUDENT_PROFILE, STUDENT_SUBMISSIONS) — this file adds
// the analytical layer on top.

export interface RatingPoint {
  contest: string;
  date: string;
  rating: number;
  change: number;
  rank: number;
  solved: number;
  total: number;
}

export interface TopicMastery {
  topic: string;
  solved: number;
  total: number;
  accuracy: number;
  trend: "up" | "down" | "flat";
}

export interface UpcomingEvent {
  id: string;
  title: string;
  type: "Campus Drive" | "Rated Contest" | "Mock Test";
  organizer: string;
  startsInMinutes: number;
  durationMins: number;
  problems: number;
  mandatory: boolean;
  registered: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  totalProblems: number;
  solvedProblems: number;
  estimatedHours: number;
  tag: string;
  accent: "indigo" | "cyan" | "emerald" | "amber" | "rose";
}

export interface VerdictStat {
  verdict: string;
  count: number;
  tone: "success" | "danger" | "warning" | "muted";
}

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface CompanyTarget {
  company: string;
  logo: string;
  cutoffRating: number;
  role: string;
  ctc: string;
  status: "Eligible" | "Close" | "Not Yet";
}

export interface DailyChallenge {
  code: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  points: number;
  solvedByToday: number;
  expiresInHours: number;
}

export interface SkillInsight {
  kind: "strength" | "focus";
  title: string;
  detail: string;
}

export interface ContestResult {
  id: string;
  name: string;
  date: string;
  rank: number;
  participants: number;
  solved: number;
  total: number;
  ratingChange: number;
  percentile: number;
}

export interface WeeklyGoal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
}

// -------------------------------------------------------------
// Rating progression — 18 rated rounds, 1204 → 1945
// -------------------------------------------------------------
export const RATING_HISTORY: RatingPoint[] = [
  { contest: "Weekly #08", date: "14 Jan", rating: 1204, change: 0, rank: 8420, solved: 2, total: 4 },
  { contest: "Weekly #09", date: "21 Jan", rating: 1268, change: 64, rank: 6110, solved: 2, total: 4 },
  { contest: "Div 2 #03", date: "02 Feb", rating: 1331, change: 63, rank: 4880, solved: 3, total: 5 },
  { contest: "Weekly #11", date: "11 Feb", rating: 1298, change: -33, rank: 7240, solved: 2, total: 4 },
  { contest: "Weekly #12", date: "18 Feb", rating: 1389, change: 91, rank: 3410, solved: 3, total: 4 },
  { contest: "Grand Prix #01", date: "01 Mar", rating: 1452, change: 63, rank: 2870, solved: 3, total: 6 },
  { contest: "Weekly #14", date: "10 Mar", rating: 1509, change: 57, rank: 2240, solved: 3, total: 4 },
  { contest: "Div 2 #05", date: "22 Mar", rating: 1478, change: -31, rank: 3190, solved: 2, total: 5 },
  { contest: "Weekly #16", date: "05 Apr", rating: 1560, change: 82, rank: 1780, solved: 4, total: 4 },
  { contest: "Weekly #17", date: "14 Apr", rating: 1622, change: 62, rank: 1420, solved: 3, total: 4 },
  { contest: "Grand Prix #02", date: "28 Apr", rating: 1671, change: 49, rank: 1190, solved: 4, total: 6 },
  { contest: "Weekly #19", date: "12 May", rating: 1648, change: -23, rank: 1460, solved: 3, total: 4 },
  { contest: "Div 1 #02", date: "26 May", rating: 1724, change: 76, rank: 880, solved: 3, total: 5 },
  { contest: "Weekly #21", date: "09 Jun", rating: 1790, change: 66, rank: 640, solved: 4, total: 4 },
  { contest: "Grand Prix #03", date: "23 Jun", rating: 1838, change: 48, rank: 520, solved: 4, total: 6 },
  { contest: "Weekly #22", date: "14 Jul", rating: 1812, change: -26, rank: 710, solved: 3, total: 4 },
  { contest: "Div 1 #04", date: "11 Aug", rating: 1897, change: 85, rank: 402, solved: 4, total: 5 },
  { contest: "Weekly #24", date: "01 Sep", rating: 1945, change: 48, rank: 342, solved: 4, total: 4 },
];

export const CONTEST_RESULTS: ContestResult[] = [
  { id: "c-24", name: "CodeForge Weekly #24", date: "01 Sep 2026", rank: 342, participants: 18420, solved: 4, total: 4, ratingChange: 48, percentile: 98.1 },
  { id: "c-23", name: "Div 1 Round #04", date: "11 Aug 2026", rank: 402, participants: 9860, solved: 4, total: 5, ratingChange: 85, percentile: 95.9 },
  { id: "c-22", name: "CodeForge Weekly #22", date: "14 Jul 2026", rank: 710, participants: 17240, solved: 3, total: 4, ratingChange: -26, percentile: 95.9 },
  { id: "c-21", name: "Grand Prix #03", date: "23 Jun 2026", rank: 520, participants: 12180, solved: 4, total: 6, ratingChange: 48, percentile: 95.7 },
  { id: "c-20", name: "CodeForge Weekly #21", date: "09 Jun 2026", rank: 640, participants: 16890, solved: 4, total: 4, ratingChange: 66, percentile: 96.2 },
  { id: "c-19", name: "Div 1 Round #02", date: "26 May 2026", rank: 880, participants: 9240, solved: 3, total: 5, ratingChange: 76, percentile: 90.5 },
];

// -------------------------------------------------------------
// Topic mastery
// -------------------------------------------------------------
export const TOPIC_MASTERY: TopicMastery[] = [
  { topic: "Arrays & Hashing", solved: 128, total: 140, accuracy: 91, trend: "up" },
  { topic: "Two Pointers & Sliding Window", solved: 74, total: 86, accuracy: 88, trend: "up" },
  { topic: "Binary Search", solved: 58, total: 72, accuracy: 84, trend: "flat" },
  { topic: "Trees & BST", solved: 96, total: 124, accuracy: 79, trend: "up" },
  { topic: "Graphs & Traversal", solved: 71, total: 118, accuracy: 68, trend: "up" },
  { topic: "Dynamic Programming", solved: 52, total: 146, accuracy: 54, trend: "down" },
  { topic: "Greedy & Sorting", solved: 88, total: 104, accuracy: 86, trend: "flat" },
  { topic: "Segment Trees & BIT", solved: 21, total: 68, accuracy: 41, trend: "down" },
  { topic: "Math & Number Theory", solved: 63, total: 94, accuracy: 72, trend: "flat" },
  { topic: "Strings", solved: 82, total: 98, accuracy: 83, trend: "up" },
];

export const SKILL_INSIGHTS: SkillInsight[] = [
  {
    kind: "strength",
    title: "Arrays & Hashing is your anchor",
    detail: "91% accuracy across 128 problems — you clear these in half the median time.",
  },
  {
    kind: "strength",
    title: "Contest consistency is improving",
    detail: "Positive rating delta in 5 of your last 6 rated rounds (+297 net).",
  },
  {
    kind: "focus",
    title: "Dynamic Programming is your biggest gap",
    detail: "54% accuracy and only 52/146 solved. Most Google SDE-1 rounds include one DP problem.",
  },
  {
    kind: "focus",
    title: "Segment Trees need a first pass",
    detail: "21/68 solved. This blocks the Hard bracket in Div 1 rounds.",
  },
];

// -------------------------------------------------------------
// Verdict distribution (last 200 submissions)
// -------------------------------------------------------------
export const VERDICT_STATS: VerdictStat[] = [
  { verdict: "Accepted", count: 124, tone: "success" },
  { verdict: "Wrong Answer", count: 41, tone: "danger" },
  { verdict: "Time Limit Exceeded", count: 23, tone: "warning" },
  { verdict: "Runtime Error", count: 12, tone: "muted" },
];

export const LANGUAGE_USAGE = [
  { language: "C++20", share: 62, problems: 424 },
  { language: "Python 3.12", share: 24, problems: 164 },
  { language: "Java 21", share: 11, problems: 75 },
  { language: "Go 1.22", share: 3, problems: 21 },
];

// -------------------------------------------------------------
// Upcoming schedule (minutes are relative, driven live by countdown)
// -------------------------------------------------------------
export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "ev-01",
    title: "Google SDE-1 On-Campus Assessment",
    type: "Campus Drive",
    organizer: "Apex TPO Cell × Google",
    startsInMinutes: 1042,
    durationMins: 90,
    problems: 3,
    mandatory: true,
    registered: true,
  },
  {
    id: "ev-02",
    title: "CodeForge Weekly Challenge #25",
    type: "Rated Contest",
    organizer: "CodeForge Global",
    startsInMinutes: 3180,
    durationMins: 120,
    problems: 4,
    mandatory: false,
    registered: true,
  },
  {
    id: "ev-03",
    title: "Microsoft Prep Mock Round",
    type: "Mock Test",
    organizer: "Apex Placement Cell",
    startsInMinutes: 5760,
    durationMins: 120,
    problems: 4,
    mandatory: false,
    registered: false,
  },
];

export const DAILY_CHALLENGE: DailyChallenge = {
  code: "CF-1042",
  title: "Dynamic Tree Diameter with Edge Updates",
  difficulty: "Hard",
  tags: ["Trees", "Heavy-Light Decomposition", "Segment Tree"],
  points: 120,
  solvedByToday: 1284,
  expiresInHours: 7,
};

// -------------------------------------------------------------
// Practice tracks
// -------------------------------------------------------------
export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "lp-dsa",
    title: "DSA Foundations Sheet",
    description: "The canonical 150-problem ladder covering every interview pattern.",
    icon: "Layers",
    totalProblems: 150,
    solvedProblems: 138,
    estimatedHours: 60,
    tag: "Core",
    accent: "indigo",
  },
  {
    id: "lp-dp",
    title: "Dynamic Programming Intensive",
    description: "From 1D memoisation to digit DP and bitmask states.",
    icon: "Binary",
    totalProblems: 80,
    solvedProblems: 29,
    estimatedHours: 45,
    tag: "Your weak spot",
    accent: "rose",
  },
  {
    id: "lp-faang",
    title: "FAANG Interview Track",
    description: "Company-tagged sets from Google, Microsoft, Amazon and Adobe rounds.",
    icon: "Building2",
    totalProblems: 120,
    solvedProblems: 74,
    estimatedHours: 50,
    tag: "Placement",
    accent: "cyan",
  },
  {
    id: "lp-graph",
    title: "Graph Algorithms Mastery",
    description: "Traversals, shortest paths, flows, and connectivity structures.",
    icon: "Share2",
    totalProblems: 95,
    solvedProblems: 61,
    estimatedHours: 38,
    tag: "In progress",
    accent: "emerald",
  },
  {
    id: "lp-speed",
    title: "Contest Speed Drills",
    description: "Timed sprints that train implementation speed under contest pressure.",
    icon: "Timer",
    totalProblems: 60,
    solvedProblems: 22,
    estimatedHours: 20,
    tag: "Contest prep",
    accent: "amber",
  },
  {
    id: "lp-cs",
    title: "CS Fundamentals Rapid Fire",
    description: "OS, DBMS, networks and OOP questions asked in campus rounds.",
    icon: "Cpu",
    totalProblems: 200,
    solvedProblems: 184,
    estimatedHours: 25,
    tag: "Almost done",
    accent: "indigo",
  },
];

export const COMPANY_TARGETS: CompanyTarget[] = [
  { company: "Google", logo: "🔵", cutoffRating: 1850, role: "SDE-1", ctc: "₹34 - 42 LPA", status: "Eligible" },
  { company: "Microsoft", logo: "🟦", cutoffRating: 1750, role: "SE Trainee", ctc: "₹28 - 36 LPA", status: "Eligible" },
  { company: "Adobe", logo: "🔴", cutoffRating: 1700, role: "MTS-1", ctc: "₹26 - 32 LPA", status: "Eligible" },
  { company: "Amazon (AWS)", logo: "🟠", cutoffRating: 1650, role: "Cloud SDE", ctc: "₹22 - 28 LPA", status: "Eligible" },
  { company: "Jane Street", logo: "⚫", cutoffRating: 2200, role: "Quant Dev", ctc: "₹60+ LPA", status: "Not Yet" },
  { company: "Rubrik", logo: "🟣", cutoffRating: 2000, role: "SDE-1", ctc: "₹44 LPA", status: "Close" },
];

export const WEEKLY_GOALS: WeeklyGoal[] = [
  { id: "g-1", label: "Problems solved", current: 17, target: 21, unit: "problems" },
  { id: "g-2", label: "Hard problems", current: 3, target: 5, unit: "hard" },
  { id: "g-3", label: "Contest participation", current: 1, target: 1, unit: "contest" },
  { id: "g-4", label: "Focus hours", current: 9.5, target: 12, unit: "hours" },
];

export const BOOKMARKED_PROBLEMS = [
  { code: "CF-884", title: "Minimum Cost to Merge K Sorted Arrays", difficulty: "Medium" as const, tag: "Heap", attempts: 3 },
  { code: "CF-921", title: "Count Distinct Palindromic Subsequences", difficulty: "Hard" as const, tag: "DP", attempts: 5 },
  { code: "CF-655", title: "Shortest Path in Weighted DAG", difficulty: "Medium" as const, tag: "Graphs", attempts: 2 },
];

// -------------------------------------------------------------
// Activity heatmap — deterministic pseudo-random so server and client
// render identically (no hydration mismatch) while still looking organic.
// -------------------------------------------------------------
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildActivity(): ActivityDay[][] {
  const rand = seededRandom(20260912);
  const anchor = new Date("2026-09-12T00:00:00Z");
  const weeks: ActivityDay[][] = [];
  const totalWeeks = 52;

  for (let w = 0; w < totalWeeks; w += 1) {
    const week: ActivityDay[] = [];
    for (let d = 0; d < 7; d += 1) {
      const daysAgo = (totalWeeks - 1 - w) * 7 + (6 - d);
      const date = new Date(anchor.getTime() - daysAgo * 86400000);
      const isWeekend = d === 0 || d === 6;
      // Recent 34 days are the active streak — always non-zero.
      const inStreak = daysAgo < 34;
      const roll = rand();
      let count: number;

      if (inStreak) {
        count = 2 + Math.floor(roll * 9);
      } else if (isWeekend) {
        count = roll < 0.45 ? 0 : Math.floor(roll * 5);
      } else {
        count = roll < 0.22 ? 0 : Math.floor(roll * 8);
      }

      const level: ActivityDay["level"] =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4;

      week.push({
        date: date.toISOString().slice(0, 10),
        count,
        level,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

export const ACTIVITY_WEEKS: ActivityDay[][] = buildActivity();

export const TOTAL_SUBMISSIONS_YEAR = ACTIVITY_WEEKS.flat().reduce((sum, d) => sum + d.count, 0);

export const ACTIVE_DAYS_YEAR = ACTIVITY_WEEKS.flat().filter((d) => d.count > 0).length;
