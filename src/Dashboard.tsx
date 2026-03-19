import { useState, useCallback, useMemo } from "react";
import { analyze, validateRecords } from "./judgment-engine";
import type { InterviewRecord } from "./judgment-engine";
import { SAMPLE_DATA } from "./data/sampleData";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./Dashboard.css";

type DataSource = "sample" | "upload";

export function Dashboard() {
  const [dataSource, setDataSource] = useState<DataSource>("sample");
  const [uploadedData, setUploadedData] = useState<InterviewRecord[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const records = useMemo(() => {
    if (dataSource === "sample") return SAMPLE_DATA;
    return uploadedData ?? [];
  }, [dataSource, uploadedData]);

  const showUploadPrompt = dataSource === "upload" && !uploadedData?.length && !uploadError;

  const result = useMemo(() => analyze(records), [records]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    setUploadedData(null);

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text) as unknown;
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        const { records: validated } = validateRecords(arr);
        if (validated.length === 0 && arr.length > 0) {
          setUploadError("No valid records found in file. Check the JSON format.");
          setUploadedData(null);
        } else {
          setUploadedData(validated);
          setDataSource("upload");
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Invalid JSON file");
        setUploadedData(null);
      }
    };
    reader.onerror = () => setUploadError("Failed to read file");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const problemPct = (result.problem_rate * 100).toFixed(1);
  const paymentPct = (result.payment_rate * 100).toFixed(1);

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Judgment Engine</h1>
          <p className="dashboard-tagline">
            Amplifying local experts &amp; SMEs in developing economies. Enabling economic
            participation — without the work nobody wants to do.
          </p>
        </header>

        <section className="dashboard-actions">
          <div className="data-source-tabs">
            <button
              type="button"
              className={`tab ${dataSource === "sample" ? "tab-active" : ""}`}
              onClick={() => setDataSource("sample")}
              aria-pressed={dataSource === "sample"}
            >
              Sample data
            </button>
            <button
              type="button"
              className={`tab ${dataSource === "upload" ? "tab-active" : ""}`}
              onClick={() => setDataSource("upload")}
              aria-pressed={dataSource === "upload"}
            >
              Upload JSON
            </button>
          </div>
          <label className="file-upload">
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              aria-label="Upload interview data JSON file"
            />
            <span className="file-upload-label">Choose file</span>
          </label>
          {uploadError && (
            <p className="upload-error" role="alert">
              {uploadError}
            </p>
          )}
        </section>

        {showUploadPrompt && (
          <p className="upload-prompt">
            Upload a JSON file with interview records. Each record should have:{" "}
            <code>problem_exists</code>, <code>problem_severity</code>, <code>willing_to_pay</code>,{" "}
            <code>notes</code>.
          </p>
        )}

        <section className="dashboard-section" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="section-title">
            Interview Summary
          </h2>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Local Experts / Partners</span>
              <span className="summary-value">{result.total_interviews}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Problem Rate (need exists)</span>
              <span className="summary-value">{problemPct}%</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Payment Rate (economic participation)</span>
              <span className="summary-value">{paymentPct}%</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">PMF Score</span>
              <span className={`summary-value pmf-${result.pmf_score}`}>{result.pmf_score}</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="insights-heading">
          <h2 id="insights-heading" className="section-title">
            Insights
          </h2>
          <ul className="insights-list">
            {result.insights.map((insight, i) => (
              <li key={i} className="insight-item">
                {insight}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ErrorBoundary>
  );
}
