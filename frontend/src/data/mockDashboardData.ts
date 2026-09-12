// Comprehensive mock data store for CodeForge dashboards

export interface SuperAdminStats {
  totalUsers: number;
  usersGrowth: string;
  partnerColleges: number;
  collegesGrowth: string;
  activeContests: number;
  submissionsToday: number;
  submissionsGrowth: string;
  monthlyRevenue: string;
  revenueGrowth: string;
  systemHealth: number; // percentage
  judgeUptime: string;
}

export interface JudgeNode {
  id: string;
  name: string;
  region: string;
  provider: "AWS" | "GCP" | "BareMetal";
  cpuUsage: number;
  memoryUsage: number;
  activeJobs: number;
  maxJobs: number;
  status: "healthy" | "busy" | "degraded";
  latencyMs: number;
}

export interface PartnerCollege {
  id: string;
  name: string;
  shortCode: string;
  logo: string;
  tpoName: string;
  tpoEmail: string;
  activeStudents: number;
  tier: "Academic Enterprise" | "Pro Campus" | "Standard";
  placementRate: number;
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
}

export interface UserManagementRecord {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: "superadmin" | "admin_internal" | "admin_tpo" | "user";
  roleLabel: string;
  institution: string;
  status: "Active" | "Blocked" | "Pending Verification";
  rating: number;
  submissionsCount: number;
  joinedDate: string;
  lastActive: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "Judge System" | "Anti-Cheat" | "Campus Recruitment" | "UI & Beta";
}

// -------------------------------------------------------------
// Mellow Internal Employee Data
// -------------------------------------------------------------
export interface CuratedProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  status: "Published" | "In Review" | "Draft" | "Needs Testcases";
  author: string;
  submissions: number;
  acceptanceRate: string;
  lastUpdated: string;
}

export interface PlagiarismFlag {
  id: string;
  contestName: string;
  problemTitle: string;
  similarityScore: number;
  userA: { name: string; handle: string; college: string; codeSnippet: string };
  userB: { name: string; handle: string; college: string; codeSnippet: string };
  timestamp: string;
  status: "Flagged" | "Disqualified" | "Exonerated" | "Under Review";
}

export interface SupportTicket {
  id: string;
  studentName: string;
  studentHandle: string;
  type: "Judge Timeout" | "Wrong Testcase" | "Rating Discrepancy" | "Campus Drive Issue";
  priority: "Low" | "Medium" | "High" | "Urgent";
  subject: string;
  status: "Open" | "In Progress" | "Resolved";
  timeAgo: string;
}

// -------------------------------------------------------------
// College TPO Data
// -------------------------------------------------------------
export interface CollegeTPOProfile {
  institutionName: string;
  campusLocation: string;
  tpoOfficer: string;
  tpoDesignation: string;
  batchYear: number;
  totalStudents: number;
  placedStudents: number;
  averageRating: number;
  placementPercentage: number;
  highPackageOffers: number; // >20 LPA
  activeDrives: number;
}

export interface CampusDrive {
  id: string;
  companyName: string;
  logo: string;
  role: string;
  ctcRange: string;
  eligibilityCgpa: number;
  minRating: number;
  testDate: string;
  durationMinutes: number;
  registeredCount: number;
  status: "Upcoming" | "Active Now" | "Evaluation" | "Completed";
}

export interface BatchStudent {
  id: string;
  name: string;
  rollNumber: string;
  branch: "CSE" | "IT" | "ECE" | "EE" | "MECH";
  cgpa: number;
  codeForgeRating: number;
  ratingTier: string;
  solvedProblems: number;
  readinessScore: number; // 0 - 100
  placementStatus: "Placed" | "Shortlisted" | "In Assessment" | "Needs Training";
  companyPlaced?: string;
}

export interface DepartmentReadiness {
  branch: string;
  avgDsaScore: number;
  avgSpeedScore: number;
  placedPercentage: number;
  totalEnrolled: number;
}

// -------------------------------------------------------------
// Student / User Data
// -------------------------------------------------------------
export interface StudentProfile {
  name: string;
  handle: string;
  avatar: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: number;
  rating: number;
  rankTitle: string;
  globalRank: number;
  collegeRank: number;
  totalSolved: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  streakDays: number;
  maxStreak: number;
  readinessScore: number;
  readinessBreakdown: {
    dsa: number;
    systemDesign: number;
    csFundamentals: number;
    problemSolvingSpeed: number;
  };
}

export interface StudentSubmission {
  id: string;
  problemTitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  verdict: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error";
  runtimeMs: number;
  memoryMb: number;
  submittedAt: string;
}

export interface StudentAssessment {
  id: string;
  title: string;
  organizer: string;
  type: "Campus Drive" | "College Mock Test" | "Mellow Weekly";
  scheduledTime: string;
  duration: string;
  totalQuestions: number;
  status: "Mandatory" | "Optional" | "Completed";
  badgeColor: string;
}

// =============================================================
// ACTUAL MOCK DATASETS
// =============================================================

export const SUPERADMIN_STATS: SuperAdminStats = {
  totalUsers: 148920,
  usersGrowth: "+18.4%",
  partnerColleges: 94,
  collegesGrowth: "+12 this quarter",
  activeContests: 6,
  submissionsToday: 54310,
  submissionsGrowth: "+24.2%",
  monthlyRevenue: "$68,450",
  revenueGrowth: "+15.8% MoM",
  systemHealth: 99.98,
  judgeUptime: "99.99%",
};

export const JUDGE_NODES: JudgeNode[] = [
  { id: "node-us-east-1", name: "Cluster-Alpha-US1", region: "N. Virginia (AWS)", provider: "AWS", cpuUsage: 48, memoryUsage: 62, activeJobs: 142, maxJobs: 250, status: "healthy", latencyMs: 28 },
  { id: "node-ap-south-1", name: "Cluster-Bravo-IN1", region: "Mumbai (AWS)", provider: "AWS", cpuUsage: 82, memoryUsage: 79, activeJobs: 238, maxJobs: 250, status: "busy", latencyMs: 14 },
  { id: "node-eu-west-1", name: "Cluster-Charlie-EU1", region: "Frankfurt (GCP)", provider: "GCP", cpuUsage: 35, memoryUsage: 45, activeJobs: 88, maxJobs: 250, status: "healthy", latencyMs: 34 },
  { id: "node-ap-southeast-1", name: "Cluster-Delta-SG1", region: "Singapore (BareMetal)", provider: "BareMetal", cpuUsage: 64, memoryUsage: 71, activeJobs: 160, maxJobs: 250, status: "healthy", latencyMs: 22 },
];

export const PARTNER_COLLEGES: PartnerCollege[] = [
  { id: "col-1", name: "Indian Institute of Technology, Bombay", shortCode: "IIT-B", logo: "🏛️", tpoName: "Dr. Vikram Seth", tpoEmail: "vikram.seth@iitb.ac.in", activeStudents: 2840, tier: "Academic Enterprise", placementRate: 94.2, status: "Active", joinedDate: "Jan 2024" },
  { id: "col-2", name: "Birla Institute of Technology and Science, Pilani", shortCode: "BITS", logo: "🎓", tpoName: "Prof. Ananya Roy", tpoEmail: "tpo@pilani.bits.edu", activeStudents: 2190, tier: "Academic Enterprise", placementRate: 91.8, status: "Active", joinedDate: "Mar 2024" },
  { id: "col-3", name: "National Institute of Technology, Trichy", shortCode: "NITT", logo: "🏛️", tpoName: "Dr. K. Ramanathan", tpoEmail: "placement@nitt.edu", activeStudents: 1750, tier: "Pro Campus", placementRate: 88.5, status: "Active", joinedDate: "Jun 2024" },
  { id: "col-4", name: "Apex Institute of Technology & Research", shortCode: "AITR", logo: "⚡", tpoName: "Dr. Rajeshwar Sharma", tpoEmail: "tpo@apex.edu.in", activeStudents: 1450, tier: "Pro Campus", placementRate: 74.0, status: "Active", joinedDate: "Aug 2024" },
  { id: "col-5", name: "Stanford School of Engineering", shortCode: "STAN", logo: "🌲", tpoName: "Sarah Jenkins", tpoEmail: "sjenkins@stanford.edu", activeStudents: 980, tier: "Academic Enterprise", placementRate: 98.6, status: "Active", joinedDate: "Nov 2024" },
  { id: "col-6", name: "Vellore Institute of Technology", shortCode: "VIT", logo: "🏫", tpoName: "Prof. S. Balasubramanian", tpoEmail: "careers@vit.ac.in", activeStudents: 4120, tier: "Academic Enterprise", placementRate: 86.4, status: "Active", joinedDate: "Jan 2025" },
];

export const USER_MANAGEMENT_RECORDS: UserManagementRecord[] = [
  { id: "usr-01", name: "Aryan Varma", handle: "aryan_master", email: "aryan@mellow.ai", role: "superadmin", roleLabel: "Super Admin", institution: "Mellow Core Team", status: "Active", rating: 2450, submissionsCount: 1420, joinedDate: "2023-11-01", lastActive: "Just now" },
  { id: "usr-02", name: "Priya Sundaram", handle: "priya_curator", email: "priya@mellow.ai", role: "admin_internal", roleLabel: "Mellow Staff", institution: "Mellow Problem Editorial", status: "Active", rating: 2180, submissionsCount: 980, joinedDate: "2024-01-15", lastActive: "12m ago" },
  { id: "usr-03", name: "Dr. Rajeshwar Sharma", handle: "tpo_apex", email: "tpo@apex.edu.in", role: "admin_tpo", roleLabel: "College TPO", institution: "Apex Inst of Tech", status: "Active", rating: 1720, submissionsCount: 240, joinedDate: "2024-08-10", lastActive: "2h ago" },
  { id: "usr-04", name: "Alex Chen", handle: "alex_coder", email: "alex.chen@student.apex.edu", role: "user", roleLabel: "Candidate Master", institution: "Apex Inst of Tech", status: "Active", rating: 1945, submissionsCount: 680, joinedDate: "2024-08-15", lastActive: "4m ago" },
  { id: "usr-05", name: "Rohan Kapoor", handle: "rohan_algo", email: "rohan99@gmail.com", role: "user", roleLabel: "Student Coder", institution: "IIT Bombay", status: "Active", rating: 1820, submissionsCount: 420, joinedDate: "2024-03-22", lastActive: "1d ago" },
  { id: "usr-06", name: "Devansh Patel", handle: "shadow_coder", email: "d.patel@cheatproxy.net", role: "user", roleLabel: "Suspicious", institution: "Independent", status: "Blocked", rating: 1990, submissionsCount: 180, joinedDate: "2025-01-04", lastActive: "3d ago (Banned for Plagiarism)" },
  { id: "usr-07", name: "Neha Kulkarni", handle: "neha_ops", email: "neha.k@mellow.ai", role: "admin_internal", roleLabel: "Mellow Staff", institution: "Mellow Trust & Safety", status: "Active", rating: 1960, submissionsCount: 512, joinedDate: "2024-04-10", lastActive: "45m ago" },
];

export const AUDIT_LOGS: AuditLogEntry[] = [
  { id: "log-101", actor: "Aryan Varma (Superadmin)", actorRole: "superadmin", action: "Suspended Account: shadow_coder for multi-account contest collision", target: "User: usr-06", ipAddress: "142.250.190.46", timestamp: "Today, 18:42", severity: "warning" },
  { id: "log-102", actor: "System Sandbox Watcher", actorRole: "system", action: "Cluster-Bravo-IN1 auto-scaled 4 supplementary Docker isolation workers", target: "Judge Infrastructure", ipAddress: "10.0.4.12", timestamp: "Today, 17:15", severity: "info" },
  { id: "log-103", actor: "Priya Sundaram", actorRole: "admin_internal", action: "Published Problem: 'Maximum Flow in Dynamic Railway Network'", target: "Problem Bank #CF-842", ipAddress: "49.37.152.88", timestamp: "Today, 15:30", severity: "info" },
  { id: "log-104", actor: "Dr. Rajeshwar Sharma", actorRole: "admin_tpo", action: "Scheduled Campus Drive: 'Google SDE-1 Assessment Round'", target: "Apex Inst Batch 2026", ipAddress: "115.112.45.19", timestamp: "Today, 14:02", severity: "info" },
  { id: "log-105", actor: "Security Sentinel", actorRole: "security", action: "Blocked 1,420 automated scraping requests from AS16509 IP block", target: "Rate Limiter", ipAddress: "52.88.241.10", timestamp: "Today, 11:20", severity: "critical" },
];

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "ff-1", name: "Sandboxed Memory Limit Strictness (256MB)", description: "Terminates jobs exceeding resident set size immediately without warning grace.", enabled: true, category: "Judge System" },
  { id: "ff-2", name: "Real-time AI Plagiarism Token Cross-Check", description: "Performs AST vector embedding similarity across concurrent submissions during rated contests.", enabled: true, category: "Anti-Cheat" },
  { id: "ff-3", name: "Campus TPO Proctoring Telemetry (Webcam & Tab switch)", description: "Captures focus loss and proctor events during scheduled college recruitment drives.", enabled: true, category: "Campus Recruitment" },
  { id: "ff-4", name: "AI Editorial Assistant in Beta", description: "Generates step-by-step algorithmic hints when student fails 3 consecutive testcases.", enabled: false, category: "UI & Beta" },
  { id: "ff-5", name: "Maintenance Mode (ReadOnly Judge)", description: "Locks code submission queue for planned database migrations.", enabled: false, category: "Judge System" },
];

// -------------------------------------------------------------
// Mellow Internal Mock Data
// -------------------------------------------------------------
export const CURATED_PROBLEMS: CuratedProblem[] = [
  { id: "prb-01", title: "Median of Two Distributed Streams", slug: "median-distributed-streams", difficulty: "Hard", tags: ["Binary Search", "Divide and Conquer"], status: "Published", author: "Priya Sundaram", submissions: 3410, acceptanceRate: "28.4%", lastUpdated: "Yesterday" },
  { id: "prb-02", title: "Valid Route in Constrained Grid", slug: "valid-route-constrained-grid", difficulty: "Medium", tags: ["BFS", "Shortest Path", "Bitmask"], status: "Published", author: "Aryan Varma", submissions: 8940, acceptanceRate: "44.1%", lastUpdated: "2 days ago" },
  { id: "prb-03", title: "Dynamic Tree Diameter with Edge Updates", slug: "dynamic-tree-diameter", difficulty: "Hard", tags: ["Heavy-Light Decomposition", "Segment Tree"], status: "In Review", author: "Neha Kulkarni", submissions: 0, acceptanceRate: "—", lastUpdated: "3 hours ago" },
  { id: "prb-04", title: "Lexicographically Smallest Subsequence", slug: "lexicographical-subsequence", difficulty: "Medium", tags: ["Monotonic Stack", "Greedy"], status: "Needs Testcases", author: "Priya Sundaram", submissions: 0, acceptanceRate: "—", lastUpdated: "5 hours ago" },
  { id: "prb-05", title: "Two Sum: Prefix XOR Variation", slug: "prefix-xor-variation", difficulty: "Easy", tags: ["Hash Table", "Bit Manipulation"], status: "Published", author: "Aryan Varma", submissions: 18450, acceptanceRate: "62.8%", lastUpdated: "3 days ago" },
];

export const PLAGIARISM_FLAGS: PlagiarismFlag[] = [
  {
    id: "plg-401",
    contestName: "CodeForge Weekly Challenge #24",
    problemTitle: "Dynamic Tree Diameter with Edge Updates",
    similarityScore: 96.4,
    userA: {
      name: "Rohit Verma",
      handle: "rohit_v_99",
      college: "Apex Institute of Tech",
      codeSnippet: `vector<int> adj[MAXN];\nvoid dfs(int u, int p, int d) {\n  dist[u] = d;\n  for(auto v : adj[u]) if(v != p) dfs(v, u, d+1);\n}`,
    },
    userB: {
      name: "Samir K.",
      handle: "samir_dev",
      college: "Apex Institute of Tech",
      codeSnippet: `vector<int> g[MAXN];\nvoid explore(int node, int par, int depth) {\n  dist[node] = depth;\n  for(auto nxt : g[node]) if(nxt != par) explore(nxt, node, depth+1);\n}`,
    },
    timestamp: "18 mins ago",
    status: "Flagged",
  },
  {
    id: "plg-402",
    contestName: "Div 2 Bi-Weekly #12",
    problemTitle: "Valid Route in Constrained Grid",
    similarityScore: 92.1,
    userA: {
      name: "Karan Johar",
      handle: "karan_algo",
      college: "NIT Trichy",
      codeSnippet: `int solve(vector<vector<int>>& grid) {\n  queue<pair<int,int>> q;\n  q.push({0,0});\n  while(!q.empty()) { ... }\n}`,
    },
    userB: {
      name: "Anil R.",
      handle: "anil_code",
      college: "Independent",
      codeSnippet: `int calculate(vector<vector<int>>& g) {\n  queue<pair<int,int>> queue_nodes;\n  queue_nodes.push({0,0});\n  while(!queue_nodes.empty()) { ... }\n}`,
    },
    timestamp: "1 hour ago",
    status: "Under Review",
  },
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: "TCK-882", studentName: "Rohan Kapoor", studentHandle: "rohan_algo", type: "Wrong Testcase", priority: "High", subject: "Problem #CF-842 Testcase 14 has output exceeding 64-bit signed int", status: "In Progress", timeAgo: "22 mins ago" },
  { id: "TCK-881", studentName: "Divya Nair", studentHandle: "divya_n", type: "Judge Timeout", priority: "Medium", subject: "C++20 submission queued for >45 seconds during contest start", status: "Resolved", timeAgo: "1 hour ago" },
  { id: "TCK-880", studentName: "Dr. Sharma (TPO)", studentHandle: "tpo_apex", type: "Campus Drive Issue", priority: "Urgent", subject: "Need custom CSV export for students scoring >= 80% on Microsoft Mock Test", status: "Open", timeAgo: "3 hours ago" },
];

// -------------------------------------------------------------
// College TPO Mock Data (Apex Institute of Technology)
// -------------------------------------------------------------
export const COLLEGE_TPO_PROFILE: CollegeTPOProfile = {
  institutionName: "Apex Institute of Technology & Research",
  campusLocation: "Bangalore, India",
  tpoOfficer: "Dr. Rajeshwar Sharma",
  tpoDesignation: "Head of Training & Corporate Relations",
  batchYear: 2026,
  totalStudents: 1450,
  placedStudents: 986,
  averageRating: 1684,
  placementPercentage: 68.0,
  highPackageOffers: 142,
  activeDrives: 4,
};

export const CAMPUS_DRIVES: CampusDrive[] = [
  { id: "drv-01", companyName: "Google India", logo: "🌐", role: "Software Development Engineer - I (Full Time)", ctcRange: "₹34 - 42 LPA", eligibilityCgpa: 8.0, minRating: 1750, testDate: "Tomorrow, 10:00 AM", durationMinutes: 90, registeredCount: 248, status: "Active Now" },
  { id: "drv-02", companyName: "Microsoft", logo: "🪟", role: "Software Engineer Trainee (Batch 2026)", ctcRange: "₹28 - 36 LPA", eligibilityCgpa: 7.5, minRating: 1600, testDate: "14 Sep 2026, 02:00 PM", durationMinutes: 120, registeredCount: 412, status: "Upcoming" },
  { id: "drv-03", companyName: "Amazon Web Services", logo: "📦", role: "Cloud Support & Systems Associate", ctcRange: "₹22 - 28 LPA", eligibilityCgpa: 7.0, minRating: 1500, testDate: "18 Sep 2026, 11:00 AM", durationMinutes: 75, registeredCount: 520, status: "Upcoming" },
  { id: "drv-04", companyName: "TCS Digital / Prime", logo: "🏢", role: "Digital Systems Architect (Pan-College)", ctcRange: "₹9 - 14 LPA", eligibilityCgpa: 6.5, minRating: 1350, testDate: "08 Sep 2026 (Finished)", durationMinutes: 90, registeredCount: 910, status: "Completed" },
];

export const BATCH_STUDENTS: BatchStudent[] = [
  { id: "std-01", name: "Alex Chen", rollNumber: "2022CSE014", branch: "CSE", cgpa: 9.32, codeForgeRating: 1945, ratingTier: "Candidate Master", solvedProblems: 680, readinessScore: 94, placementStatus: "Shortlisted", companyPlaced: "Google India (Shortlist)" },
  { id: "std-02", name: "Sneha Reddy", rollNumber: "2022CSE088", branch: "CSE", cgpa: 9.14, codeForgeRating: 1880, ratingTier: "Expert", solvedProblems: 540, readinessScore: 91, placementStatus: "Placed", companyPlaced: "Microsoft (₹32 LPA)" },
  { id: "std-03", name: "Kartik Mehta", rollNumber: "2022IT045", branch: "IT", cgpa: 8.84, codeForgeRating: 1760, ratingTier: "Expert", solvedProblems: 410, readinessScore: 84, placementStatus: "In Assessment" },
  { id: "std-04", name: "Tanvi Saxena", rollNumber: "2022ECE021", branch: "ECE", cgpa: 8.92, codeForgeRating: 1640, ratingTier: "Specialist", solvedProblems: 320, readinessScore: 78, placementStatus: "In Assessment" },
  { id: "std-05", name: "Rahul Deshmukh", rollNumber: "2022CSE105", branch: "CSE", cgpa: 7.62, codeForgeRating: 1410, ratingTier: "Apprentice", solvedProblems: 190, readinessScore: 56, placementStatus: "Needs Training" },
  { id: "std-06", name: "Ananya Iyer", rollNumber: "2022IT012", branch: "IT", cgpa: 9.45, codeForgeRating: 1910, ratingTier: "Candidate Master", solvedProblems: 620, readinessScore: 93, placementStatus: "Placed", companyPlaced: "Adobe Systems (₹29 LPA)" },
  { id: "std-07", name: "Vikram Malhotra", rollNumber: "2022EE034", branch: "EE", cgpa: 7.20, codeForgeRating: 1320, ratingTier: "Apprentice", solvedProblems: 140, readinessScore: 48, placementStatus: "Needs Training" },
];

export const DEPARTMENT_READINESS: DepartmentReadiness[] = [
  { branch: "Computer Science (CSE)", avgDsaScore: 88, avgSpeedScore: 84, placedPercentage: 82.5, totalEnrolled: 620 },
  { branch: "Information Tech (IT)", avgDsaScore: 82, avgSpeedScore: 79, placedPercentage: 74.0, totalEnrolled: 380 },
  { branch: "Electronics (ECE)", avgDsaScore: 71, avgSpeedScore: 68, placedPercentage: 58.2, totalEnrolled: 290 },
  { branch: "Electrical (EE)", avgDsaScore: 62, avgSpeedScore: 59, placedPercentage: 45.0, totalEnrolled: 160 },
];

// -------------------------------------------------------------
// Student / User Mock Data (Alex Chen)
// -------------------------------------------------------------
export const STUDENT_PROFILE: StudentProfile = {
  name: "Alex Chen",
  handle: "alex_coder",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  email: "alex.chen@student.apex.edu",
  college: "Apex Institute of Technology",
  branch: "Computer Science & Engineering",
  graduationYear: 2026,
  rating: 1945,
  rankTitle: "Candidate Master",
  globalRank: 342,
  collegeRank: 3,
  totalSolved: 684,
  easySolved: 280,
  easyTotal: 450,
  mediumSolved: 312,
  mediumTotal: 720,
  hardSolved: 92,
  hardTotal: 340,
  streakDays: 34,
  maxStreak: 61,
  readinessScore: 92,
  readinessBreakdown: {
    dsa: 95,
    systemDesign: 84,
    csFundamentals: 92,
    problemSolvingSpeed: 89,
  },
};

export const STUDENT_SUBMISSIONS: StudentSubmission[] = [
  { id: "sub-901", problemTitle: "Median of Two Distributed Streams", difficulty: "Hard", language: "C++20", verdict: "Accepted", runtimeMs: 14, memoryMb: 12.4, submittedAt: "18 mins ago" },
  { id: "sub-902", problemTitle: "Valid Route in Constrained Grid", difficulty: "Medium", language: "Python 3.12", verdict: "Accepted", runtimeMs: 68, memoryMb: 24.1, submittedAt: "2 hours ago" },
  { id: "sub-903", problemTitle: "Dynamic Tree Diameter with Edge Updates", difficulty: "Hard", language: "C++20", verdict: "Time Limit Exceeded", runtimeMs: 2004, memoryMb: 48.0, submittedAt: "5 hours ago" },
  { id: "sub-904", problemTitle: "Lexicographically Smallest Subsequence", difficulty: "Medium", language: "Java 21", verdict: "Wrong Answer", runtimeMs: 94, memoryMb: 36.2, submittedAt: "Yesterday" },
  { id: "sub-905", problemTitle: "Two Sum: Prefix XOR Variation", difficulty: "Easy", language: "C++20", verdict: "Accepted", runtimeMs: 4, memoryMb: 8.2, submittedAt: "Yesterday" },
  { id: "sub-906", problemTitle: "Longest Valid Parentheses Chain", difficulty: "Hard", language: "C++20", verdict: "Accepted", runtimeMs: 8, memoryMb: 10.5, submittedAt: "2 days ago" },
];

export const STUDENT_ASSESSMENTS: StudentAssessment[] = [
  { id: "asm-01", title: "Google SDE-1 On-Campus Placement Test", organizer: "Apex TPO Cell x Google", type: "Campus Drive", scheduledTime: "Tomorrow at 10:00 AM", duration: "90 Mins", totalQuestions: 3, status: "Mandatory", badgeColor: "bg-status-danger/15 text-status-danger border-status-danger/30" },
  { id: "asm-02", title: "Microsoft Coding Assessment Prep Mock", organizer: "Apex Placement Cell", type: "College Mock Test", scheduledTime: "Sunday, 4:00 PM", duration: "120 Mins", totalQuestions: 4, status: "Optional", badgeColor: "bg-accent-primary/15 text-accent-primary border-accent-primary/30" },
  { id: "asm-03", title: "CodeForge Weekly Challenge #25", organizer: "CodeForge Global", type: "Mellow Weekly", scheduledTime: "Saturday, 8:00 PM", duration: "120 Mins", totalQuestions: 4, status: "Optional", badgeColor: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30" },
];
