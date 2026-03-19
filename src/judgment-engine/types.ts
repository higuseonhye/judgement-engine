export type ProblemSeverity = "high" | "medium" | "low";

/** Role in local economy: expert, sme, informal_worker, etc. */
export type IntervieweeRole = "local_expert" | "sme" | "informal_worker" | "other";

export interface InterviewRecord {
  problem_exists: boolean;
  problem_severity: ProblemSeverity;
  willing_to_pay: boolean;
  notes: string;
  /** Optional: region/country for developing-economy context */
  region?: string;
  /** Optional: interviewee role for capacity-building context */
  role?: IntervieweeRole;
}

export type PmfScore = "strong" | "medium" | "weak";

export interface JudgmentResult {
  total_interviews: number;
  problem_rate: number;
  payment_rate: number;
  pmf_score: PmfScore;
  insights: string[];
}
