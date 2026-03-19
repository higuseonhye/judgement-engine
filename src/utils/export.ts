import type { InterviewRecord, JudgmentResult } from "../judgment-engine";

export function exportAsJson(records: InterviewRecord[], result: JudgmentResult): void {
  const blob = new Blob(
    [JSON.stringify({ records, analysis: result }, null, 2)],
    { type: "application/json" }
  );
  downloadBlob(blob, "judgment-engine-export.json");
}

export function exportAsCsv(records: InterviewRecord[]): void {
  const headers = ["problem_exists", "problem_severity", "willing_to_pay", "notes", "region", "role"];
  const rows = records.map((r) =>
    [
      r.problem_exists,
      r.problem_severity,
      r.willing_to_pay,
      escapeCsv(r.notes),
      r.region ?? "",
      r.role ?? "",
    ].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, "judgment-engine-export.csv");
}

function escapeCsv(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
