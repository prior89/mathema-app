# Mathēma

AI-powered NCERT math learning app for Indian Class 7-12 students (CBSE / JEE prep).
Monorepo:

- **`server/`** — NestJS + Prisma + PostgreSQL backend (REST `/api/v1/*`)
- **`app/`** — React + Vite + Capacitor mobile-first frontend (sage UI, 5 tabs)

> **Status: pre-beta PoC.** The 5 tabs of the student flow are wired end-to-end
> against a real backend, and the admin content-ingestion pipeline (PDF / HTTP
> API → LLM draft → review → publish) is functional. Production hosting is
> not yet set up — see [Production deployment](#production-deployment-tbd).
> The Class 9 NCERT PDF was missing from the original source, so 11 chapters
> are currently empty in the seed data.

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
NormalizedProblem[]  ← { ncertClass, chapter, exerciseId, text, sourceRef }
      │
      ▼  LlmDraftService (Anthropic)
ContentDraft (PENDING) — strict JSON schema (3 steps × 5 choices, exactly 1 correct each)
      │
      ▼  Admin web UI (/app/admin/drafts/:id)
APPROVED  →  DraftPublisher (transaction)
      │
      ▼
Problem + 3 ProblemStep + 15 ProblemChoice  → live to students
```

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
