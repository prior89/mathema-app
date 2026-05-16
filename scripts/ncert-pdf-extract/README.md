# NCERT PDF → NormalizedProblem extractor

End-to-end pipeline that turns the 6 NCERT Maths PDFs (Class 7–12, NCF-SE
2023 syllabus) into `NormalizedProblem[]` JSON files consumable by the
`JsonBulkSourceAdapter` in `server/src/modules/content-ingest`.

```
PDF  ─►  mathpix_pdf.py  ─►  .mmd  ─►  extract_from_mmd.py  ─►  grade-N.problems.json
                                                                    │
                                       (Grade 9 only is narrative ─►│  extract_grade9_llm.py
                                        and uses an LLM step)       ▼
                                                              grade-9.problems.json
```

All scripts are pure Python with no LLM dependency for grades 7/8/10/11/12.
Grade 9 (Ganita Manjari) is a narrative-style book without explicit
`EXERCISE` blocks, so it uses a one-time LLM pass to identify inline
student-evaluatable questions.

---

## Layout

```
scripts/ncert-pdf-extract/
├── README.md                       ← this file
├── extract.py                      ← legacy: PDF text → JSON (PyMuPDF, heuristic)
├── extract_from_mmd.py             ← current: .mmd → JSON (regex + LaTeX-aware)
├── extract_grade9_llm.py           ← LLM-based extractor for Ganita Manjari
├── mathpix_pdf.py                  ← PDF → .mmd via MathPix API
├── dry-run-stats.py                ← summary stats over output/*.json
└── output/
    ├── mmd/                        ← Mathpix Markdown for each grade
    ├── from_mmd/                   ← canonical: grade-{7..12}.problems.json
    ├── from_mmd_llm/grade-9.problems.json
    └── grade-{7..12}.{problems,examples,chapters,report}.json   ← legacy PDF-text run
```

The `server/scripts/import-ncert.ts` CLI picks `from_mmd/` for grades 7, 8,
10, 11, 12 and `from_mmd_llm/` for grade 9.

---

## Step 1 — PDF to Mathpix Markdown (.mmd)

```bash
set MATHPIX_APP_ID=<your app id>
set MATHPIX_APP_KEY=<your app key>

python scripts/ncert-pdf-extract/mathpix_pdf.py \
    --pdf "C:/Users/User/Downloads/Grade_8_Mathematics_Latest.pdf" \
    --output scripts/ncert-pdf-extract/output/mmd
```

- Output: `output/mmd/Grade_8_Mathematics_Latest.mmd`
- Inline math wrapped in `\( … \)`, display math in `\[ … \]`,
  headings (`\section*{…}`) and lists preserved.
- Async API — uploads, polls `/v3/pdf/{id}` until `status=completed`.
- **Pricing (verified 2026-05):** ~$0.005/page pay-as-you-go after
  1,000 free pages/month. 6 NCERT PDFs ≈ **2,099 pages** → **$5.5–$11**
  for the first full run (subsequent runs are free until the monthly quota
  refills).
- Failure modes: `401` (bad creds), `402` (out of quota), `413` (>512 MB
  PDF — not relevant here).

---

## Step 2 — .mmd to NormalizedProblem JSON

```bash
python scripts/ncert-pdf-extract/extract_from_mmd.py \
    --mmd scripts/ncert-pdf-extract/output/mmd/Grade_8_Mathematics_Latest.mmd \
    --grade 8 \
    --output scripts/ncert-pdf-extract/output/from_mmd
```

- No LLM, no network calls.
- Detects chapters via combined heuristic (`\section*{Chapter N}` +
  numbered `\section*{N.M Title}` patterns — recovers chapter boundaries
  the PDF text loses).
- Detects exercises via `\section*{EXERCISE N.M}` and `Figure it Out` /
  `Try This` / `Math Talk` (Ganita Prakash dialects).
- Splits numbered enumerations (`1. `, `1)`) into problems; ignores rows
  shorter than the noise threshold or containing zero letters.
- Emits `grade-N.{problems,examples,chapters,report}.json`. The `.report.json`
  is a single-object summary with the counts shown in the table below.

---

## Step 3 — Grade 9 narrative-style extraction (LLM)

Ganita Manjari (Grade 9, NCF-SE 2023) embeds questions inside chapter
prose instead of using `EXERCISE` blocks — regex extraction recovers only
6 of an expected ~140 problems. The dedicated LLM extractor finds the rest.

```bash
# OpenAI (recommended for cost):
set OPENAI_API_KEY=<your_openai_key>
python scripts/ncert-pdf-extract/extract_grade9_llm.py \
    --provider openai --model gpt-4o-mini \
    --mmd scripts/ncert-pdf-extract/output/mmd/Grade_9_Mathematics_Latest.mmd \
    --grade 9 \
    --output scripts/ncert-pdf-extract/output/from_mmd_llm

# Anthropic (fallback):
set ANTHROPIC_API_KEY=<your_anthropic_key>
python scripts/ncert-pdf-extract/extract_grade9_llm.py \
    --provider anthropic \
    --mmd scripts/ncert-pdf-extract/output/mmd/Grade_9_Mathematics_Latest.mmd \
    --grade 9 \
    --output scripts/ncert-pdf-extract/output/from_mmd_llm
```

**Cost (Grade 9, 8 chapters, ~95K input + ~20K output tokens, no caching):**

| Provider / Model         | Cost   |
|--------------------------|-------:|
| openai gpt-4o-mini       | $0.026 |
| openai gpt-5-mini        | $0.064 |
| anthropic claude-haiku-4-5 | $0.195 |

Actual run on 2026-05-15: **138 problems extracted for $0.022** using
`gpt-4o-mini`.

---

## Extraction results (snapshot, 2026-05-15)

| Grade | Source PDF                | Chapters | Problems | Examples | Output dir          |
|-------|---------------------------|---------:|---------:|---------:|---------------------|
| 7     | Ganita Prakash            |        8 |      498 |       79 | `output/from_mmd/`  |
| 8     | Math VIII                 |       13 |      195 |      107 | `output/from_mmd/`  |
| 9     | Ganita Manjari (narrative)|        8 |      138 |       75 | `output/from_mmd_llm/` |
| 10    | Math X                    |       14 |      263 |      136 | `output/from_mmd/`  |
| 11    | Math XI (Part I)          |       14 |      378 |      234 | `output/from_mmd/`  |
| 12    | Math XII (Part I)         |       13 |      697 |      311 | `output/from_mmd/`  |
| **Σ** |                           |   **70** | **2,169**|  **942** |                     |

Re-running `dry-run-stats.py` over `output/from_mmd/` (+ Grade 9 from
`from_mmd_llm/`) reproduces these numbers without touching the database.

---

## End-to-end cost

| Stage                     | Cost (one full run)        |
|---------------------------|----------------------------|
| MathPix OCR (2,099 pages) | $0 – $11 (free quota first) |
| Grade 9 LLM extraction    | $0.022                     |
| `npm run import:ncert` (LLM draft, gpt-4o-mini, 2,169 problems) | ~$2.30 |
| **Total**                 | **≈ $2.30 – $13.30**        |

---

## Legacy artifacts

`output/grade-{7..12}.problems.json` (no `from_mmd/` prefix) was produced
by an earlier `extract.py` PyMuPDF text run. Kept for diff/audit but
**not** used by `import-ncert.ts`. Safe to delete after the first
successful import.
