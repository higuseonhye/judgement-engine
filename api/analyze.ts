import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyze } from "../src/judgment-engine";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;
    const records = Array.isArray(body) ? body : body?.records ?? [];
    const result = analyze(records);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}
