import type { InterviewRecord, IntervieweeRole, ProblemSeverity } from "./types";

const VALID_SEVERITIES: ProblemSeverity[] = ["high", "medium", "low"];

/**
 * Validates and normalizes a single interview record.
 * Returns null if the record is invalid and cannot be recovered.
 */
export function validateRecord(raw: unknown): InterviewRecord | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;

  const problem_exists = Boolean(obj.problem_exists);
  const willing_to_pay = Boolean(obj.willing_to_pay);

  const rawSeverity = obj.problem_severity;
  const problem_severity: ProblemSeverity =
    typeof rawSeverity === "string" && VALID_SEVERITIES.includes(rawSeverity as ProblemSeverity)
      ? (rawSeverity as ProblemSeverity)
      : "low";

  const notes = typeof obj.notes === "string" ? String(obj.notes).slice(0, 10_000) : "";

  const region =
    typeof obj.region === "string" && obj.region.trim()
      ? obj.region.trim().slice(0, 100)
      : undefined;

  const validRoles: IntervieweeRole[] = ["local_expert", "sme", "informal_worker", "other"];
  const role =
    typeof obj.role === "string" && validRoles.includes(obj.role as IntervieweeRole)
      ? (obj.role as IntervieweeRole)
      : undefined;

  return {
    problem_exists,
    problem_severity,
    willing_to_pay,
    notes,
    ...(region && { region }),
    ...(role && { role }),
  };
}

/**
 * Validates an array of records. Filters out invalid entries.
 */
export function validateRecords(raw: unknown): { records: InterviewRecord[]; invalidCount: number } {
  if (!Array.isArray(raw)) return { records: [], invalidCount: 0 };

  const records: InterviewRecord[] = [];
  let invalidCount = 0;

  for (const item of raw) {
    const validated = validateRecord(item);
    if (validated) {
      records.push(validated);
    } else {
      invalidCount++;
    }
  }

  return { records, invalidCount };
}
