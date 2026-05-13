# Mathēma Server

NestJS 10 + Prisma 5 + PostgreSQL backend for the Mathēma math learning app.
Exposes a REST API under `/api/v1/*` for the React/Vite client in `../app/`.

For repository-wide setup (docker compose, workspaces, scripts), see the
[root README](../README.md). This file documents the server itself.

---

## Running standalone

If you are working on the server in isolation:

```bash
# from repo root — bring up postgres + redis containers
docker compose up -d

# from this directory
npm install                       # workspaces are hoisted, so root install is fine too
cp .env.example .env              # adjust JWT secrets and AI keys as needed
npx prisma migrate deploy
npx prisma db seed
npm run start:dev                 # nest start --watch (port 4000)
```

Health check: `curl http://localhost:4000/api/v1/health/live`

---

## Domain modules (`src/modules/*`)

Each module maps 1:1 to a feature surface in the client. The directory layout
follows the standard NestJS pattern (`*.module.ts`, `*.controller.ts`,
`*.service.ts`, `*.repository.ts`, `dto/`, `entities/`).

| Module             | Responsibility                                                                  |
| ------------------ | ------------------------------------------------------------------------------- |
| `auth`             | JWT access/refresh, registration, password reset, Google sign-in                |
| `users`            | Profile, account deletion, data export                                          |
| `curriculum`       | Units / sub-units / concepts (curriculum graph)                                 |
| `concept-lessons`  | NCERT chapters (79 lessons, 5 steps each)                                       |
| `problems`         | Problem CRUD + 3-step MC delivery                                               |
| `attempts`         | Recording every attempt (per-step), feeds analytics                             |
| `wrong-notes`      | Wrong notes with SM-2 spaced repetition                                         |
| `study-sessions`   | Practice / review sessions, time-on-task                                        |
| `mock-exams`       | AI Diagnostic / Mini / Wrong-redo / Real grade-wide exams + result detail      |
| `mastery`          | Per-unit mastery snapshots and trajectories                                     |
| `activity`         | Streaks, daily/weekly heatmaps                                                  |
| `recommendations`  | Next-problem / next-chapter recommendations with rationale logging              |
| `ai-coach`         | Weekly mentor message (LLM)                                                     |
| `reports`          | Weekly report aggregation                                                       |
| `dashboard`        | Home tab data composition                                                       |
| `analytics`        | Telemetry events, weakness heatmaps                                             |
| `admin`            | Admin allowlist, audit logs, content coverage, distractor insights              |
| `content-ingest`   | PDF / HTTP_API / JSON_BULK source ingestion → LLM draft → review → publish      |
| `push`             | FCM device tokens, notification fan-out                                         |
| `privacy`          | DPDP 2023 consent, policy versioning, data export                               |
| `llm-analysis`     | BullMQ queue for asynchronous LLM analyses + DLQ                                |
| `feedback`         | Feedback from teachers / parents / students                                     |
| `students`         | Teacher / parent views of student progress                                      |
| `diagnostic`       | 4-question onboarding diagnostic                                                |
| `health`           | `/health/live`, `/health/ready` for container probes                            |

---

## Cross-cutting infrastructure (`src/infrastructure/*`)

| Module       | Purpose                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `prisma`     | Global Prisma client + transaction helpers                               |
| `redis`      | Redis client (cache, rate limit, BullMQ broker)                          |
| `ai`         | LLM / Vision / Embedding facade with caching, retry, circuit breaker     |
| `storage`    | Local-disk or S3 file storage (uploaded PDFs, exports)                   |
| `mail`       | SMTP / SendGrid wrapper, no-op stub when unconfigured                    |

---

## Data model

See [`prisma/schema.prisma`](./prisma/schema.prisma) for the single source of
truth. Highlights:

- `User` (STUDENT / TEACHER / PARENT / ADMIN) + `Consent` (DPDP 2023)
- `Unit` → `SubUnit` → `Problem` (with FK to `ConceptLesson`)
- `ConceptLesson` → `ConceptStep` (5 steps per chapter: HOOK / CONCRETE / PICTORIAL / ABSTRACT / WORKED)
- `Problem` → `ProblemStep` (3 steps: CONCEPT / PROCESS / ANSWER) → `ProblemChoice` (5 choices, exactly 1 correct)
- `Attempt` (per-step, includes `confidence`, `errorCodes[]`, `stepByStepInput`)
- `WrongNote` (SM-2 due dates)
- `MockExamResult`, `MasterySnapshot`, `RecommendationLog`
- `ContentIngestJob` + `ContentDraft` (admin content pipeline)

---

## Content ingestion pipeline

Source-agnostic. Adapter pattern lets PDF, HTTP API, JSON bulk, and CSV all
flow through the same downstream stages:

```
SourceAdapter.ingest()
  └─→ NormalizedProblem[] { ncertClass, chapter, exerciseId, text, sourceRef }
        └─→ LlmDraftService — strict JSON schema (3 steps × 5 choices, 1 correct)
              └─→ ContentDraft (PENDING)
                    └─→ Admin review (web UI in /app/admin/drafts/:id)
                          └─→ APPROVED + DraftPublisher → Problem (+ 3 ProblemStep + 15 ProblemChoice)
```

Currently registered adapters live in `src/modules/content-ingest/adapters/`:
`pdf-source.adapter.ts`, `http-api-source.adapter.ts`, `json-bulk-source.adapter.ts`.

---

## Tests

```bash
npm test                          # unit
npm run test:e2e                  # end-to-end (separate Jest config)
npm run test:cov                  # with coverage
```

---

## Production deployment

A multi-stage `Dockerfile` is included for container-based hosting (Render,
Fly.io, Cloud Run, Azure Container Apps). The entrypoint runs
`prisma migrate deploy` before starting the server so the database schema is
always in sync.
