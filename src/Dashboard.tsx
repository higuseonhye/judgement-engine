import { useState, useCallback, useMemo } from "react";
import { analyze, validateRecords } from "./judgment-engine";
import type { InterviewRecord, IntervieweeRole } from "./judgment-engine";
import { SAMPLE_DATA } from "./data/sampleData";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useI18n } from "./i18n/useI18n";
import { exportAsJson, exportAsCsv } from "./utils/export";
import "./Dashboard.css";

type DataSource = "sample" | "upload";

export function Dashboard() {
  const { t, locale, setLocale } = useI18n();
  const [dataSource, setDataSource] = useState<DataSource>("sample");
  const [uploadedData, setUploadedData] = useState<InterviewRecord[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");
  const [exportToast, setExportToast] = useState(false);

  const baseRecords = useMemo(() => {
    if (dataSource === "sample") return SAMPLE_DATA;
    return uploadedData ?? [];
  }, [dataSource, uploadedData]);

  const records = useMemo(() => {
    return baseRecords.filter((r) => {
      if (filterRegion && r.region !== filterRegion) return false;
      if (filterRole && r.role !== filterRole) return false;
      return true;
    });
  }, [baseRecords, filterRegion, filterRole]);

  const regions = useMemo(
    () => [...new Set(baseRecords.map((r) => r.region).filter(Boolean))] as string[],
    [baseRecords]
  );
  const roles: IntervieweeRole[] = ["local_expert", "sme", "informal_worker", "other"];

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

  const handleExportJson = useCallback(() => {
    exportAsJson(records, result);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2000);
  }, [records, result]);

  const handleExportCsv = useCallback(() => {
    exportAsCsv(records);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2000);
  }, [records]);

  const problemPct = (result.problem_rate * 100).toFixed(1);
  const paymentPct = (result.payment_rate * 100).toFixed(1);

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-row">
            <h1 className="dashboard-title">{t.title}</h1>
            <div className="locale-switcher">
              <button
                type="button"
                className={`locale-btn ${locale === "en" ? "locale-active" : ""}`}
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
              >
                EN
              </button>
              <button
                type="button"
                className={`locale-btn ${locale === "ko" ? "locale-active" : ""}`}
                onClick={() => setLocale("ko")}
                aria-pressed={locale === "ko"}
              >
                KO
              </button>
            </div>
          </div>
          <p className="dashboard-tagline">{t.tagline}</p>
        </header>

        <section className="dashboard-actions">
          <div className="data-source-tabs">
            <button
              type="button"
              className={`tab ${dataSource === "sample" ? "tab-active" : ""}`}
              onClick={() => setDataSource("sample")}
              aria-pressed={dataSource === "sample"}
            >
              {t.sampleData}
            </button>
            <button
              type="button"
              className={`tab ${dataSource === "upload" ? "tab-active" : ""}`}
              onClick={() => setDataSource("upload")}
              aria-pressed={dataSource === "upload"}
            >
              {t.uploadJson}
            </button>
          </div>
          <label className="file-upload">
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              aria-label="Upload interview data JSON file"
            />
            <span className="file-upload-label">{t.chooseFile}</span>
          </label>
          {uploadError && (
            <p className="upload-error" role="alert">
              {uploadError}
            </p>
          )}
        </section>

        {showUploadPrompt && (
          <p className="upload-prompt">
            {t.uploadPrompt} <code>{t.uploadPromptFields}</code>
          </p>
        )}

        {records.length > 0 && (
          <>
            <section className="dashboard-filters">
              <span className="filter-label">{t.filterBy}</span>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                aria-label="Filter by region"
              >
                <option value="">{t.allRegions}</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                aria-label="Filter by role"
              >
                <option value="">{t.allRoles}</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="export-buttons">
                <button type="button" className="export-btn" onClick={handleExportJson}>
                  {t.exportJson}
                </button>
                <button type="button" className="export-btn" onClick={handleExportCsv}>
                  {t.exportCsv}
                </button>
              </div>
            </section>
            {exportToast && (
              <p className="export-toast" role="status">
                {t.exportSuccess}
              </p>
            )}
          </>
        )}

        <section className="dashboard-section" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="section-title">
            {t.summary}
          </h2>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">{t.localExperts}</span>
              <span className="summary-value">{result.total_interviews}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">{t.problemRate}</span>
              <span className="summary-value">{problemPct}%</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">{t.paymentRate}</span>
              <span className="summary-value">{paymentPct}%</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">{t.pmfScore}</span>
              <span className={`summary-value pmf-${result.pmf_score}`}>{result.pmf_score}</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="insights-heading">
          <h2 id="insights-heading" className="section-title">
            {t.insights}
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
