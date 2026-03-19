export type Locale = "en" | "ko";

export const translations: Record<
  Locale,
  {
    title: string;
    tagline: string;
    sampleData: string;
    uploadJson: string;
    chooseFile: string;
    uploadPrompt: string;
    uploadPromptFields: string;
    summary: string;
    localExperts: string;
    problemRate: string;
    paymentRate: string;
    pmfScore: string;
    insights: string;
    tryAgain: string;
    errorTitle: string;
    errorMessage: string;
    filterBy: string;
    allRegions: string;
    allRoles: string;
    exportJson: string;
    exportCsv: string;
    exportSuccess: string;
  }
> = {
  en: {
    title: "Judgment Engine",
    tagline:
      "Amplifying local experts & SMEs in developing economies. Enabling economic participation — without the work nobody wants to do.",
    sampleData: "Sample data",
    uploadJson: "Upload JSON",
    chooseFile: "Choose file",
    uploadPrompt: "Upload a JSON file with interview records. Each record should have:",
    uploadPromptFields: "problem_exists, problem_severity, willing_to_pay, notes",
    summary: "Interview Summary",
    localExperts: "Local Experts / Partners",
    problemRate: "Problem Rate (need exists)",
    paymentRate: "Payment Rate (economic participation)",
    pmfScore: "PMF Score",
    insights: "Insights",
    tryAgain: "Try again",
    errorTitle: "Something went wrong",
    errorMessage: "An error occurred. Please try again.",
    filterBy: "Filter by",
    allRegions: "All regions",
    allRoles: "All roles",
    exportJson: "Export JSON",
    exportCsv: "Export CSV",
    exportSuccess: "Exported successfully",
  },
  ko: {
    title: "Judgment Engine",
    tagline:
      "개발도상국 현지 전문가·중소기업 역량 증폭. 경제 참여 확대 — 아무도 하기 싫은 일은 하지 않습니다.",
    sampleData: "샘플 데이터",
    uploadJson: "JSON 업로드",
    chooseFile: "파일 선택",
    uploadPrompt: "인터뷰 기록이 담긴 JSON 파일을 업로드하세요. 각 레코드에는 다음 필드가 필요합니다:",
    uploadPromptFields: "problem_exists, problem_severity, willing_to_pay, notes",
    summary: "인터뷰 요약",
    localExperts: "현지 전문가 / 파트너",
    problemRate: "문제 인식률",
    paymentRate: "지불 의향률 (경제 참여)",
    pmfScore: "PMF 점수",
    insights: "인사이트",
    tryAgain: "다시 시도",
    errorTitle: "오류가 발생했습니다",
    errorMessage: "문제가 발생했습니다. 다시 시도해 주세요.",
    filterBy: "필터",
    allRegions: "전체 지역",
    allRoles: "전체 역할",
    exportJson: "JSON 내보내기",
    exportCsv: "CSV 내보내기",
    exportSuccess: "내보내기 완료",
  },
};
