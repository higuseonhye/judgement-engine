import type { InterviewRecord, JudgmentResult, PmfScore } from "./types";
import { validateRecords } from "./validate";

/**
 * Judgment Engine - Rule-based analysis of interview records.
 * No AI models. Simple aggregations and text pattern extraction.
 *
 * @param input - Array of interview records (or raw unknown data; will be validated)
 * @returns Analysis result. Invalid records are filtered out.
 */
export function analyze(input: InterviewRecord[] | unknown): JudgmentResult {
  const { records, invalidCount } = Array.isArray(input)
    ? validateRecords(input)
    : { records: [] as InterviewRecord[], invalidCount: 0 };

  const total = records.length;
  if (total === 0) {
    const emptyInsight =
      invalidCount > 0
        ? `No valid interview data. ${invalidCount} record(s) were invalid and skipped.`
        : "No interview data to analyze.";
    return {
      total_interviews: 0,
      problem_rate: 0,
      payment_rate: 0,
      pmf_score: "weak" as PmfScore,
      insights: [emptyInsight],
    };
  }

  const problemCount = records.filter((r) => r.problem_exists).length;
  const paymentCount = records.filter((r) => r.willing_to_pay).length;

  const problem_rate = problemCount / total;
  const payment_rate = paymentCount / total;

  const pmf_score = getPmfScore(payment_rate);
  const insights = generateInsights(records, payment_rate, invalidCount);

  return {
    total_interviews: total,
    problem_rate,
    payment_rate,
    pmf_score,
    insights,
  };
}

function getPmfScore(payment_rate: number): PmfScore {
  if (payment_rate >= 0.4) return "strong";
  if (payment_rate >= 0.2) return "medium";
  return "weak";
}

function generateInsights(
  records: InterviewRecord[],
  payment_rate: number,
  invalidCount: number
): string[] {
  const insights: string[] = [];

  // 1. Problem intensity
  const withProblems = records.filter((r) => r.problem_exists);
  const high = withProblems.filter((r) => r.problem_severity === "high").length;
  const medium = withProblems.filter((r) => r.problem_severity === "medium").length;
  const low = withProblems.filter((r) => r.problem_severity === "low").length;

  if (withProblems.length > 0) {
    const parts: string[] = [];
    if (high > 0) parts.push(`${high} high`);
    if (medium > 0) parts.push(`${medium} medium`);
    if (low > 0) parts.push(`${low} low`);
    insights.push(
      `Problem intensity: ${parts.join(", ")} severity among ${withProblems.length} local experts/partners who reported a problem.`
    );
  } else {
    insights.push("No local experts/partners reported having a problem.");
  }

  // 2. Willingness to pay (economic participation signal)
  const willingCount = records.filter((r) => r.willing_to_pay).length;
  insights.push(
    `${willingCount} of ${records.length} (${(payment_rate * 100).toFixed(0)}%) are willing to pay — strong signal for economic participation.`
  );

  if (invalidCount > 0) {
    insights.push(`${invalidCount} invalid record(s) were skipped during analysis.`);
  }

  // 3–5. Key patterns from notes (simple rule-based extraction)
  const notePatterns = extractNotePatterns(records);
  insights.push(...notePatterns);

  return insights.slice(0, 6); // Cap at 6 insights (allow room for invalid warning)
}

function extractNotePatterns(records: InterviewRecord[]): string[] {
  const patterns: string[] = [];
  const notes = records.map((r) => r.notes).filter((n) => n && n.trim());

  if (notes.length === 0) {
    patterns.push("No notes provided in interview records.");
    return patterns;
  }

  // Keywords relevant to developing-economy / capacity-building context
  const keywords = [
    "capacity", "skill", "training", "access", "market", "income", "opportunity",
    "price", "cost", "budget", "pain", "need", "want", "local", "community"
  ];
  const counts: Record<string, number> = {};
  for (const kw of keywords) {
    counts[kw] = notes.filter((n) => n.toLowerCase().includes(kw)).length;
  }

  const topKeywords = Object.entries(counts)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (topKeywords.length > 0) {
    patterns.push(
      `Common themes: ${topKeywords.map(([k, c]) => `${k} (${c}x)`).join(", ")} — reflects local priorities.`
    );
  }

  // Region diversity if available
  const regions = records.map((r) => r.region).filter(Boolean);
  const uniqueRegions = new Set(regions);
  if (uniqueRegions.size > 1) {
    patterns.push(`Interviews span ${uniqueRegions.size} regions — good geographic coverage.`);
  }

  // Average note length as engagement proxy
  const avgLen = notes.reduce((s, n) => s + n.length, 0) / notes.length;
  if (avgLen > 100) {
    patterns.push("Local experts provided detailed notes — high engagement and buy-in.");
  } else if (avgLen < 30) {
    patterns.push("Notes are brief; consider deeper discovery in future interviews.");
  }

  return patterns;
}
