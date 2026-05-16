# Mathēma

AI-powered NCERT math learning app for Indian Class 7-12 students (CBSE / JEE prep).
Monorepo:

- **`server/`** — NestJS + Prisma + PostgreSQL backend (REST `/api/v1/*`)
- **`app/`** — React + Vite + Capacitor mobile-first frontend (sage UI, 5 tabs)

> **Status: pre-beta PoC.** The 5 tabs of the student flow are wired end-to-end
> against a real backend, and the admin content-ingestion pipeline (PDF / HTTP
> API → LLM draft → review → publish) is functional. Production hosting is
> not yet set up — see [Production deployment](#production-deployment-tbd).
> All 6 NCERT Math PDFs (Class 7–12, NCF-SE 2023 syllabus) have been extracted
> into **2,169 NormalizedProblem entries** and are ready for bulk import via
> `npm run import:ncert` — see [NCERT content ingestion](#ncert-content-ingestion-pipeline) below.

---

## Quick start

Requirements: **Node ≥ 20**, **Docker**, **npm ≥ 10**.

```bash
git clone https://github.com/prior89/mathema-app
cd mathema-app

cp .env.example .env          # 1) fill AI_LLM_API_KEY if you want LLM features
docker compose up -d          # 2) postgres + redis containers
npm install                   # 3) installs both workspaces

# 4) run migrations + seed (one-time)
npm run db:migrate
npm run db:seed

# 5) start everything (server :4000 + app :5173 in parallel)
npm run dev
```

Open <http://localhost:5173>. The demo auto-login (`VITE_ENABLE_DEMO_AUTO_LOGIN=true`)
signs in with the seeded `polopot123@gmail.com` account.

---

## What you get

### Student flow (after login)
- **Home** — today's plan, mastery snapshot
- **Learn** — NCERT chapter list (79 ConceptLessons across Class 7-12) → 5-step concept viewer (HOOK → CONCRETE → PICTORIAL → ABSTRACT → WORKED) → practice with 3-step MC (CONCEPT / PROCESS / ANSWER)
- **Notes** — wrong notes with SM-2 spaced repetition
- **Mocks** — 4 exam types (AI Diagnostic / Mini per-unit / Wrong-redo / Real grade-wide), score trajectory, result detail
- **Me** — weekly report (mentor message + time × accuracy + next focus), settings (DPDP consent, data export, account delete)

### Admin flow (`ADMIN_EMAILS` allow-list)
- **Content ingestion** — PDF upload / HTTP API source / JSON bulk → automatic
  text extraction → LLM-generated 3-step MC drafts → human review → publish to Problem
- Source-agnostic SourceAdapter (PDF / HTTP_API / JSON_BULK / CSV)
- Draft editor: inline 3-step + 5-choice + distractor type + rationale, approve/reject/regenerate

---

## Common scripts

```bash
npm run dev            # server + app concurrently
npm run dev:server     # backend only
npm run dev:app        # frontend only

npm run build          # build both
npm run typecheck      # tsc --noEmit on both

npm run db:up          # docker compose up (postgres + redis)
npm run db:down        # docker compose down
npm run db:reset       # ⚠ drop volume + restart (nukes data)
npm run db:migrate     # prisma migrate deploy
npm run db:seed        # prisma db seed
npm run db:studio      # prisma studio GUI

npm run cap:sync       # rebuild + sync to Android (Capacitor)
npm run cap:open       # open Android Studio
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Client (app/)                                               │
│    React 18 · Vite · React Query · Capacitor (Android wrap)  │
│    Sage palette, 5 mobile tabs, /app/admin/* for editors     │
└────────────────────────────┬─────────────────────────────────┘
                             │ REST /api/v1/*
                             ↓
┌──────────────────────────────────────────────────────────────┐
│  Server (server/)                                            │
│    NestJS 10 modules (auth/users/problems/mock-exams/...)    │
│    Prisma 5 → PostgreSQL 16                                  │
│    Redis 7 (cache + rate limit + queue)                      │
│    Anthropic SDK (LLM analysis + content draft)              │
│    BullMQ (LLM analysis queue + DLQ)                         │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│  Infra (docker compose)                                      │
│    postgres:16-alpine · redis:7-alpine                       │
└──────────────────────────────────────────────────────────────┘
```

### Key domain entities

- `User` (STUDENT/TEACHER/PARENT/ADMIN) · `Consent` (DPDP 2023)
- `ConceptLesson` (NCERT 79 chapters · 5 ConceptStep each) → `Problem` (3-step MC, 5 choices)
- `Attempt` (per-step, with `confidence`, `errorCodes`, `stepByStepInput`) → `WrongNote` (SM-2)
- `MockExamResult` · `MasterySnapshot` · `RecommendationLog`
- `ContentIngestJob` + `ContentDraft` (PDF/API → LLM draft → admin review → publish)

### Source-agnostic content ingestion

```
PDF / HTTP_API / JSON_BULK / CSV
      │
      ▼  SourceAdapter (one per type)
NormalizedProblem[]  ← { ncertClass, chapter, exerciseId, text, sourceRef, ... 13 enrichment fields }
      │
      ▼  LlmDraftService (OpenAI or Anthropic, JSON-mode, 5-way parallel)
ContentDraft (PENDING) — strict JSON schema (3 steps × 5 choices, exactly 1 correct each)
      │
      ▼  Admin web UI (/app/admin/drafts/:id)
APPROVED  →  DraftPublisher (transaction, attribution-enforced)
      │
      ▼
Problem + 3 ProblemStep + 15 ProblemChoice  → live to students
```

The `NormalizedProblem` shape carries 13 optional enrichment fields
(`correctAnswer`, `acceptedAnswers`, `difficultyLevel`, `conceptCodes`,
`requiredSkills`, `expectedSolutionSteps`, `hints`, `commonErrorCodes`,
`distractors`, `solutionFinalAnswer`, `solutionSteps`, `solutionExplanation`,
`chapterCode`/`topicCode`) absorbed from the Karvy curriculum format so
adapters with rich source data can preserve their distractor-with-errorCode
mappings instead of having the LLM re-invent them.

---

## NCERT content ingestion pipeline

NCERT publishes Class 7–12 Maths textbooks as PDFs. The pipeline below turns
those into student-ready 3-step MC problems — fully offline-capable except
for the LLM draft step.

```
NCERT PDF (6 files, ~2,099 pages)
      │
      │  scripts/ncert-pdf-extract/mathpix_pdf.py
      ▼   (MathPix OCR · LaTeX-preserving · ~$0.005/page after free quota)
*.mmd  (Mathpix Markdown — \( … \) inline, \[ … \] display)
      │
      │  scripts/ncert-pdf-extract/extract_from_mmd.py
      ▼   (regex section/exercise detection — no LLM)
grade-N.problems.json  (NormalizedProblem[] — 2,031 problems across grades 7/8/10/11/12)
      │
      │  Grade 9 alone uses extract_grade9_llm.py
      ▼   (narrative-style textbook — needs LLM to spot inline questions: 138 problems)
grade-9.problems.json (from_mmd_llm, 138 problems, $0.022 via gpt-4o-mini)
      │
      │  server/scripts/import-ncert.ts (npm run import:ncert)
      ▼   (1 JSON_BULK job per grade, sequential)
ContentIngestJob → JsonBulkSourceAdapter → LlmDraftService (concurrency=5)
      │
      ▼
ContentDraft (PENDING) — awaiting reviewer in /app/admin/drafts
```

### Extraction summary (snapshot, 2026-05-15)

| Grade | Source PDF                | Chapters | Problems | Examples | Extractor          |
|-------|---------------------------|---------:|---------:|---------:|--------------------|
| 7     | Ganita Prakash            |        8 |      498 |       79 | MMD regex          |
| 8     | Math VIII                 |       13 |      195 |      107 | MMD regex          |
| 9     | Ganita Manjari (narrative)|        8 |      138 |       75 | MMD + LLM          |
| 10    | Math X                    |       14 |      263 |      136 | MMD regex          |
| 11    | Math XI (Part I)          |       14 |      378 |      234 | MMD regex          |
| 12    | Math XII (Part I)         |       13 |      697 |      311 | MMD regex          |
| **Σ** |                           |   **70** | **2,169**|  **942** |                    |

See [`scripts/ncert-pdf-extract/README.md`](./scripts/ncert-pdf-extract/README.md)
for the full extraction workflow (env vars, costs, troubleshooting).

### Local import CLI

Once the 6 PDFs have been converted (artifacts are already committed under
`scripts/ncert-pdf-extract/output/`), bulk-import everything into a local
Postgres in one command:

```bash
cd server
docker compose up -d                              # postgres + redis
npx prisma migrate deploy
npm run db:seed                                    # creates admin user (polopot123@gmail.com by default)

# .env must contain at minimum:
#   AI_LLM_PROVIDER=openai      (or "anthropic")
#   AI_LLM_API_KEY=sk-...
#   AI_LLM_MODEL=gpt-4o-mini    (recommended for cost)
#   LLM_DRAFT_CONCURRENCY=5     (optional — defaults to 5)
#   ADMIN_EMAILS=polopot123@gmail.com

npm run import:ncert                               # creates 6 JSON_BULK jobs, sequential
# or, to import AND publish to Problem table in one command:
npm run setup:ncert                                # = import:ncert && publish:bulk
```

The CLI:
- bootstraps the NestJS application context (no HTTP server)
- creates one `ContentIngestJob(JSON_BULK)` per grade and waits for it to
  reach `READY` or `FAILED` before moving on (rate-limit friendly)
- reports `draftsCreated / totalItems` for each grade
- is idempotent — re-running is blocked by `sourceDigest` uniqueness on
  `ContentIngestJob` (delete the row first to re-import)

**Cost estimate at `gpt-4o-mini` ($0.15 in / $0.60 out per Mtok):**
2,169 problems × ~2,800 tokens each ≈ **$2.30 total** for a complete run.

Verified end-to-end (2026-05-16):

| grade | drafts | failed | total | success |
|---|---|---|---|---|
| 7 | 497 | 1 | 498 | 99.8 % |
| 8 | 194 | 1 | 195 | 99.5 % |
| 9 | 133 | 5 | 138 | 96.4 % |
| 10 | 260 | 3 | 263 | 98.9 % |
| 11 | 375 | 3 | 378 | 99.2 % |
| 12 | 681 | 16 | 697 | 97.7 % |
| **total** | **2,140** | **29** | **2,169** | **98.7 %** |

Token usage: 1.59 M in / 1.98 M out → **$1.43** actual (about 38 % under the
estimate because of prompt caching).

### Bulk publish (PENDING → Problem)

Drafts land as `status=PENDING` for human review. To go from "drafts queued"
to "students can solve the problem" without one-by-one approval, use the
bulk publisher:

```bash
cd server
npx ts-node scripts/bulk-publish.ts
```

Same NestJS-standalone pattern as `import:ncert`. 5 workers in parallel,
calls `ContentIngestService.approveDraft(id, adminId, alsoPublish=true)`
for every `PENDING` draft that has a payload and a mapped `conceptLesson`.
`DraftPublisher` enforces NCERT attribution at this step (see next section).

End-to-end on the same corpus:
- 2,140 drafts → **Problem** rows
- 29 `LLM-FAIL` rows stay `PENDING` for manual review
- Total `Problem` count after run: **2,164** (seed 24 + new 2,140)
- Wall-clock: ~5 s on a local Postgres

### License-safe attribution

NCERT textbooks are copyright-protected — derivative works (NCERT problem →
3-step MC with our own distractors) are accepted but only with attribution
preserved. The `DraftPublisher` refuses to publish any `Problem` without a
valid `source` string:

```
NCERT Class 8 Mathematics, Ch.1 Ex.1.1 Q.3 (derived for Mathēma, Reprint 2024-25)
```

Two paths to a valid attribution:
1. **Automatic** — the auto-extract `sourceLabel`
   (e.g. `AUTO · CLASS_8 · Ch1 · Ex1.1 · Q3`) is parsed by
   `buildNcertAttribution()` and a canonical attribution is generated.
2. **Manual override** — the reviewer writes
   `SOURCE: NCERT Class N Mathematics, Ch.X Ex.Y Q.Z (derived for Mathēma, Reprint 2024-25)`
   at the start of `reviewerNote`. Used for cases where the auto label is
   incomplete (e.g. Ganita Prakash "Figure it Out" blocks with no canonical
   exercise number).

Both paths must pass `isAcceptableAttribution()` — checks for a textbook
brand (`NCERT|EBS|CBSE|ICSE`) and a `(derived ...)` tail. See
`server/src/modules/content-ingest/attribution.helper.ts`.

`buildNcertAttribution()` has two precision tiers:
- **full** — class + chapter + exerciseId + qIndex all known →
  `"NCERT Class 10 Mathematics, Ch.1 Ex.1.1 Q.4 (derived for Mathēma, Reprint 2024-25)"`
- **chapter-level** — only class + chapter known (Ganita Manjari Grade 9
  inline narrative activities have no exercise number) →
  `"NCERT Class 9 Mathematics, Ch.1 inline activity (derived for Mathēma, Reprint 2024-25)"`

Both pass `isAcceptableAttribution()`. Only when even chapter is unknown
does publish abort and demand a manual `SOURCE:` override.

---

## Karvy code absorbed

The `feat/karvy-absorb-ncert` branch absorbed the math-checking and
content-shape pieces from the standalone Karvy NCERT prototype so they live
inside the main monorepo:

- **`server/src/infrastructure/math/deterministic-check.service.ts`** —
  TypeScript port (875 LoC) of the Python deterministic checker. Nine
  domain-specific checkers (Remainder Theorem, polynomial substitution,
  coordinate geometry, quadratic roots, linear equations, percentage, ratio
  & proportion, simplification, arithmetic) run in priority order and return
  a `{ method: 'deterministic', answer, confidence, checker, concepts,
  steps }` result whenever a question's structure is recognised — feeding
  the LLM-analysis fallback path with verified answers. Uses `fraction.js`
  for exact rational arithmetic. **35 unit tests + 24 edge-case specs + a
  2-test micro-benchmark** under `server/src/infrastructure/math/`.

- **`server/src/modules/content-ingest/types.ts`** — `NormalizedProblem`
  extended with the 13 Karvy enrichment fields listed above so adapters
  carrying rich source data (curated distractors with error codes, concept
  codes, expected solution steps) can hand them straight through to the
  draft step without a round-trip through the LLM.

No Karvy database schema was absorbed — the existing Prisma schema already
covers the published-Problem shape, and no migrations were generated for
this branch (verify with `prisma migrate status`).

---

## Mobile (Android)

Capacitor wrapper at `app/android/`. App id: `ai.matheo.app`.

```bash
npm run cap:sync       # build + sync
npm run cap:open       # opens Android Studio
```

---

## Production deployment (TBD)

Recommended target topology:
- frontend → **Vercel** (static + SPA)
- backend → **Render** or **Fly.io** (NestJS container — Dockerfile already in `server/`)
- Postgres → **Neon** (managed)
- Redis → **Upstash**
- Secrets via hosting platform env (never commit `.env`)

---

## License

MIT — see `LICENSE`.
