# Matheo

AI-powered NCERT math learning app — India-first, expanding to KR / ID / VN / AE.
Class 7-12 (NCF-SE 2023). CBSE / JEE / NEET prep.

> **Naming convention (locked 2026-05-21, do not "fix")**: the brand / display name
> everywhere a user can see is **Matheo** (Play Store, launcher, `<title>`, in-app UI,
> store docs). The internal handle **mathema** survives in identifiers that are
> expensive or impossible to rename — repo name, Azure resources (`mathema-prod-cin`,
> `mathema-backend`, `mathema-kv-*`), npm workspace, ACR images, OIDC federated
> credential subject. These are intentional; renaming them breaks deploys for zero
> user value. "Mathēma" (with macron) is retired — replace with Matheo wherever found
> in user-facing surfaces.

Monorepo:

- **`server/`** — NestJS + Prisma + PostgreSQL + Redis + BullMQ backend (REST `/api/v1/*`)
- **`app/`** — React + Vite + Capacitor (Android `ai.matheo.app`) — student / parent / teacher / admin UI
- **`services/math-helper/`** — Python LangGraph microservice (AI Solver: `/math-helper/solve`, OpenAI)

> **Status: v0.1.0 release candidate — Internal Testing track upload in progress.**
>
> - 🟢 Backend live on Azure Central India (Container Apps + Postgres Flexible + Redis + Key Vault).
> - 🟢 Frontend live on custom domain (`https://app.matheo.verastudy.net`).
> - 🟢 Math-helper sidecar live (internal ingress, called from server).
> - 🟢 Signed Android AAB workflow ready (Capacitor 8 + Play Billing 8.0.0 native plugin).
> - 🟢 Google Play Billing: Subscription Prisma model + Play Developer API v3 server verify + RTDN webhook + Free-tier gates + paywall UI. All wired; **Play Console product verification + Internal Testing track release are the operator's last steps.**
> - 🟡 Pricing: Free chapter learning includes **10** of the 20 mastery problems; a cardless 3-day Premium Preview unlocks the full set without auto-renewal or charge. Premium monthly/yearly subscriptions use Google Play Billing and the regional launch table in `PLAY_PRICING.md` (KR anchor: KRW 9,900/mo, KRW 99,000/yr). Free mastery cap must stay in sync with `FREE_TIER_MASTERY_PROBLEMS` in `server/src/modules/billing/billing.constants.ts` and the FE gate in `ConceptLessonScreen`.
> - 🟡 Family plan: deferred to v1.
> - 🟡 Network hardening (VNet + private endpoints for PG/KV): deferred to a follow-up sprint — currently `publicNetworkAccess: Enabled` with KV `defaultAction: Allow` since ACA shared-pool egress isn't on Microsoft's trusted-services list.
>
> 2,169 NormalizedProblem entries (NCERT Math, 6 PDFs Class 7-12, NCF-SE 2023) ingested and live in production Postgres. Bulk import CLI in `server/scripts/import-ncert.ts` — see [NCERT content ingestion](#ncert-content-ingestion-pipeline) below.

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
signs in with the seeded `polopot123@gmail.com` account (still the seed user; the
production admin allowlist is `VeraStudy01@gmail.com,polopot123@gmail.com`).

### Local development without rebuilding the AAB

Use the AAB only for Play Console release candidates. Normal development runs
from Vite, so React/CSS changes update immediately through HMR.

```bash
# Terminal 1: start Postgres, Redis, Nest, Vite, and math-helper
npm run dev:local

# Terminal 2: optional Android emulator or USB-device live reload
npm run android:dev
```

`android:dev` lists available Android targets, installs one debug build, and
uses `adb reverse` to connect the WebView to `http://127.0.0.1:5173`. After
that initial native install, ordinary web-code changes do not require
`cap sync`, an APK, or an AAB. Rebuild the native app only after changing a
Capacitor plugin, Android manifest/resource, Gradle configuration, or other
native code.

Use `npm run android:list` to check emulator/device target names. A specific
target can be selected non-interactively:

```bash
npm run android:dev -- --target-name Pixel_7a
```

The release Android network policy still blocks cleartext traffic. Only the
Gradle `debug` source set permits HTTP for local live reload.

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
`chapterCode`/`topicCode`) from the rich NCERT JSON ingest format so
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
      │  scripts/ncert-pdf-extract/*.py
      ▼   (MathPix OCR · LaTeX-preserving · ~$0.005/page after free quota)
*.mmd  (MMD — \( … \) inline, \[ … \] display)
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
NCERT Class 8 Mathematics, Ch.1 Ex.1.1 Q.3 (derived for matheo, Reprint 2024-25)
```

Two paths to a valid attribution:
1. **Automatic** — the auto-extract `sourceLabel`
   (e.g. `AUTO · CLASS_8 · Ch1 · Ex1.1 · Q3`) is parsed by
   `buildNcertAttribution()` and a canonical attribution is generated.
2. **Manual override** — the reviewer writes
   `SOURCE: NCERT Class N Mathematics, Ch.X Ex.Y Q.Z (derived for matheo, Reprint 2024-25)`
   at the start of `reviewerNote`. Used for cases where the auto label is
   incomplete (e.g. Ganita Prakash "Figure it Out" blocks with no canonical
   exercise number).

Both paths must pass `isAcceptableAttribution()` — checks for a textbook
brand (`NCERT|EBS|CBSE|ICSE`) and a `(derived ...)` tail. See
`server/src/modules/content-ingest/attribution.helper.ts`.

`buildNcertAttribution()` has two precision tiers:
- **full** — class + chapter + exerciseId + qIndex all known →
  `"NCERT Class 10 Mathematics, Ch.1 Ex.1.1 Q.4 (derived for matheo, Reprint 2024-25)"`
- **chapter-level** — only class + chapter known (Ganita Manjari Grade 9
  inline narrative activities have no exercise number) →
  `"NCERT Class 9 Mathematics, Ch.1 inline activity (derived for matheo, Reprint 2024-25)"`

Both pass `isAcceptableAttribution()`. Only when even chapter is unknown
does publish abort and demand a manual `SOURCE:` override.

---

## NCERT ingest enrichment

The NCERT ingest and AI Solver paths are maintained directly in this
monorepo:

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
  extended with the 13 enrichment fields listed above so adapters
  carrying rich source data (curated distractors with error codes, concept
  codes, expected solution steps) can hand them straight through to the
  draft step without a round-trip through the LLM.

No extra database schema was needed — the existing Prisma schema already
covers the published-Problem shape (verify with `prisma migrate status`).

---

## Mobile (Android)

Capacitor wrapper at `app/android/`. App id: `ai.matheo.app`.

```bash
npm run cap:sync       # build + sync
npm run cap:open       # opens Android Studio
```

---

## Production deployment — Azure Central India

Live topology (RG `mathema-prod-cin`):

| Layer | Resource | Notes |
|---|---|---|
| Frontend | Custom domain (verastudy) | `https://app.matheo.verastudy.net` |
| Backend | Container App `mathema-backend` | NestJS, system-assigned MI pulls from ACR |
| Math-helper | Container App `mathema-math-helper` | Python LangGraph, internal ingress |
| DB | Postgres Flexible Server `mathema-pg-*` | B1ms, 32GB, `publicNetworkAccess: Enabled` (see Status note) |
| Cache | Azure Cache for Redis Basic C0 | `rediss://` (BullMQ + idempotency + quota counters) |
| Secrets | Key Vault `mathema-kv-7ehvzq` | All env vars (DB URL / JWT / OpenAI / Play SA JSON / admin emails) injected via `secretRef` |
| Registry | ACR `mathemaacr*` | `adminUserEnabled: false`, MI-based AcrPull |
| Observability | Log Analytics + Application Insights | Sentry on frontend |

### Deploy

1. Push to `main` runs CI only. Production deploy workflows are manually dispatched:
   - `backend-deploy.yml` (SMTP preflight → Docker build → ACR push → Container App update → smoke test)
   - `frontend-deploy.yml` (Vite build → artifact integrity check → SWA deploy → MIME/content smoke on the Azure and custom hosts)
   - `math-helper-deploy.yml`
   - tag `v*` or workflow_dispatch → `android-release.yml` (signed AAB artifact, 30-day retention)

   Before dispatching `backend-deploy.yml`, configure these GitHub Actions
   secrets with the real mail-provider values: `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`. The workflow
   validates SMTP connectivity/authentication without sending a message, then
   stores the values as Azure Container App secrets and checks every
   `secretRef` binding. Do not place SMTP values in source or workflow YAML.

2. Infra changes — `bash scripts/deploy-network-hardening.sh create` (post-deploy hook keeps PG/KV publicNetworkAccess Enabled until VNet + private endpoint sprint lands).

### Operator runbook
- Backend down: `az containerapp revision restart` + check `az containerapp logs show`.
- KV / PG silently disabled by ARM partial rollback: deploy script's post-deploy hook auto-re-enables, but manual recovery is `az postgres flexible-server update --public-access Enabled` + `az keyvault update --default-action Allow`.
- AAB rebuild: `gh workflow run android-release.yml --ref main`; artifact `matheo-aab` in the run's Artifacts.

### What's NOT deployed yet (operator-driven last mile)
- Play Console verification that `premium_monthly` / `premium_yearly` base plans are active and their regional prices match both `PLAY_PRICING.md` and the app paywall. No Play free-trial or introductory-price offer should be enabled unless deliberately added and disclosed.
- Internal Testing track release of the current AAB.
- GCP Pub/Sub topic + Play Console RTDN linkage (server `/billing/rtdn` endpoint is ready; operator fills `RTDN_AUDIENCE` + `RTDN_SERVICE_ACCOUNT_EMAIL` env vars once Pub/Sub is provisioned).
- FCM credentials (`google-services.json` + ACA env). Push notifications inactive until then.
- Upload the prepared store assets: 512px app icon, 1024×500 feature graphic, and 6 phone screenshots from `store-assets/play-console/`.
- VNet integration + private endpoints (PG / KV / AOAI) — task #27.

---

## License

MIT — see `LICENSE`.
