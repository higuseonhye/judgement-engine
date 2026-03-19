# Judgment Engine

A rule-based module for analyzing interviews with **local experts and SMEs in developing economies**. Helps validate product-market fit for tools that amplify local capacity and enable economic participation.

## Vision

- Amplify local experts & companies in developing countries
- Enable people in developing economies/slum communities to participate in the economic system
- Build products that do work people want to do — not the work nobody wants

## Input

Interview records with:
- `problem_exists` (boolean)
- `problem_severity` (high/medium/low)
- `willing_to_pay` (boolean)
- `notes` (text)
- `region` (optional)
- `role` (optional: local_expert | sme | informal_worker | other)

## Output

- **total_interviews** – Count of records
- **problem_rate** – % with `problem_exists = true`
- **payment_rate** – % with `willing_to_pay = true`
- **pmf_score** – "strong" (≥40% payment), "medium" (≥20%), "weak" otherwise
- **insights** – 3–5 bullet points (problem intensity, willingness to pay, note patterns, region coverage)

## Usage

```ts
import { analyze } from "./judgment-engine";

const result = analyze(interviewRecords);
```

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 for the dashboard.

## Production

```bash
npm run build      # Output to dist/
npm run preview    # Preview production build
npm run test       # Unit tests
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## Data upload

Upload a JSON file with an array of interview records. Invalid entries are filtered out; the analysis reports how many were skipped.
