import type { InterviewRecord } from "../judgment-engine";

/** Sample interviews: local experts/SMEs in developing economies */
export const SAMPLE_DATA: InterviewRecord[] = [
  {
    problem_exists: true,
    problem_severity: "high",
    willing_to_pay: true,
    notes:
      "No access to formal market. Need tools to reach buyers. Willing to pay if it brings income. Local community needs this.",
    region: "East Africa",
    role: "local_expert",
  },
  {
    problem_exists: true,
    problem_severity: "high",
    willing_to_pay: true,
    notes:
      "Capacity building is critical. Training would help us scale. Budget limited but we see the opportunity.",
    region: "Southeast Asia",
    role: "sme",
  },
  {
    problem_exists: true,
    problem_severity: "medium",
    willing_to_pay: true,
    notes:
      "Informal sector needs better access. Skill development and market linkage would change our income.",
    region: "South Asia",
    role: "informal_worker",
  },
  {
    problem_exists: true,
    problem_severity: "medium",
    willing_to_pay: false,
    notes:
      "Good idea but cost is barrier. Free trial would help us test. Community interest is high.",
    region: "East Africa",
    role: "sme",
  },
  {
    problem_exists: true,
    problem_severity: "low",
    willing_to_pay: false,
    notes: "Minor need. Exploring options. Local market is small.",
    region: "Latin America",
    role: "other",
  },
  {
    problem_exists: true,
    problem_severity: "high",
    willing_to_pay: true,
    notes:
      "Pain point is huge. We are excluded from economic system. Need capacity and access. Price not main concern.",
    region: "West Africa",
    role: "local_expert",
  },
];
