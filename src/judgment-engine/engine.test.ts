import { describe, it, expect } from "vitest";
import { analyze } from "./engine";
import type { InterviewRecord } from "./types";

describe("analyze", () => {
  it("returns empty result for empty array", () => {
    const result = analyze([]);
    expect(result.total_interviews).toBe(0);
    expect(result.problem_rate).toBe(0);
    expect(result.payment_rate).toBe(0);
    expect(result.pmf_score).toBe("weak");
    expect(result.insights).toContain("No interview data to analyze.");
  });

  it("returns empty result for non-array input", () => {
    const result = analyze(null);
    expect(result.total_interviews).toBe(0);
  });

  it("calculates problem_rate and payment_rate correctly", () => {
    const records: InterviewRecord[] = [
      { problem_exists: true, problem_severity: "high", willing_to_pay: true, notes: "a" },
      { problem_exists: true, problem_severity: "medium", willing_to_pay: false, notes: "b" },
      { problem_exists: false, problem_severity: "low", willing_to_pay: false, notes: "c" },
    ];
    const result = analyze(records);
    expect(result.total_interviews).toBe(3);
    expect(result.problem_rate).toBeCloseTo(2 / 3);
    expect(result.payment_rate).toBeCloseTo(1 / 3);
  });

  it("returns pmf_score strong when payment_rate >= 0.4", () => {
    const records: InterviewRecord[] = Array(5)
      .fill(null)
      .map(() => ({
        problem_exists: true,
        problem_severity: "high" as const,
        willing_to_pay: true,
        notes: "x",
      }));
    const result = analyze(records);
    expect(result.pmf_score).toBe("strong");
  });

  it("returns pmf_score medium when payment_rate >= 0.2 and < 0.4", () => {
    const records: InterviewRecord[] = [
      { problem_exists: true, problem_severity: "high", willing_to_pay: true, notes: "a" },
      { problem_exists: true, problem_severity: "high", willing_to_pay: false, notes: "b" },
      { problem_exists: true, problem_severity: "high", willing_to_pay: false, notes: "c" },
      { problem_exists: true, problem_severity: "high", willing_to_pay: false, notes: "d" },
      { problem_exists: true, problem_severity: "high", willing_to_pay: false, notes: "e" },
    ];
    const result = analyze(records);
    expect(result.payment_rate).toBe(0.2);
    expect(result.pmf_score).toBe("medium");
  });

  it("returns pmf_score weak when payment_rate < 0.2", () => {
    const records: InterviewRecord[] = Array(10)
      .fill(null)
      .map(() => ({
        problem_exists: true,
        problem_severity: "high" as const,
        willing_to_pay: false,
        notes: "x",
      }));
    const result = analyze(records);
    expect(result.pmf_score).toBe("weak");
  });

  it("filters invalid records and reports invalidCount in insights", () => {
    const input = [
      { problem_exists: true, problem_severity: "high", willing_to_pay: true, notes: "valid" },
      null,
      "invalid",
      { problem_exists: false, problem_severity: "low", willing_to_pay: false, notes: "valid2" },
    ];
    const result = analyze(input);
    expect(result.total_interviews).toBe(2);
    expect(result.insights.some((i) => i.includes("2 invalid"))).toBe(true);
  });

  it("normalizes malformed but recoverable records", () => {
    const input = [
      { problem_exists: "yes", problem_severity: "high", willing_to_pay: 1, notes: "test" },
    ];
    const result = analyze(input);
    expect(result.total_interviews).toBe(1);
    expect(result.problem_rate).toBe(1);
    expect(result.payment_rate).toBe(1);
  });
});
