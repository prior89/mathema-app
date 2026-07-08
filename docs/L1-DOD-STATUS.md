# L1 Definition of Done — Internal Testing GO

**Last updated:** 2026-07-09  
**Related:** `PLAY_INTERNAL_TESTING_CHECKLIST.md`, `PLAY_BILLING_GATES.md`, `docs/L1-OPERATOR-RUNBOOK.md`

## Success criteria (all six)

| # | Criterion | Evidence | Owner | Status |
|---|-----------|----------|-------|--------|
| 1 | G0 smoke required + L1 extensions PASS | `bash scripts/smoke-prod.sh …` log (12 steps; 8–9 optional) | Agent / Operator | ✅ 2026-07-09 post-deploy — **10 pass / 0 fail / 2 skip**. Prod `gitSha=83e592c` (PR #65). Catalog empty NOTE (Curriculum seed gap, non-blocking). |
| 2 | Billing G1 automated ready | `npm run billing:preflight` exit 0 **and** `GET /admin/billing/readiness` → `g1.ready: true` | Agent / Operator | 🟡 preflight ✅; prod `billingUiEnabled=true` ✅; **g1.ready** blocked — admin login 401 with demo password (need real admin password in `~/.matheo-smoke-creds` as `SMOKE_ADMIN_EMAIL` / `SMOKE_ADMIN_PASSWORD`). |
| 3 | AAB on Internal testing track | Play Console version code published | Operator | 🟡 AAB file ready locally `dist-releases/l1-aab-83e592c/app-release.aab` (run [28971643679](https://github.com/prior89/mathema-app/actions/runs/28971643679), SHA256 in UPLOAD.txt) — **Play upload still operator**. |
| 4 | G2 min: purchase + restore | License tester notes | Operator | ⬜ |
| 5 | Device core loop | Register → learn → practice → wrong-note → (optional) solve → paywall | Operator | ⬜ (web SWA live; device after Internal install) |
| 6 | Code/docs alignment | Free mastery **10** FE+BE+README+PLAY_PRICING; dual billing flags documented | Agent | ✅ merged #65 |

**GO rule:** 1–2 + 6 are code/ops-automatable. 3–5 require Play Console + device. Do **not** treat `g2.ready: true` alone as G2 complete (it only means RTDN inbox clear).

## Dual billing flags (easy misconfig)

Paywall UI requires **both**:

| Flag | Where | Meaning |
|------|--------|---------|
| `BILLING_UI_ENABLED=true` | Server runtime env | `/billing/status` reports UI on |
| `VITE_BILLING_ENABLED=true` | App **build** (AAB / SWA) | Client bundle allows paywall |

If only one is true, testers will not see paywall.

## Free mastery cap

| Layer | Value | File |
|-------|-------|------|
| Server | `10` | `server/src/modules/billing/billing.constants.ts` → `FREE_TIER_MASTERY_PROBLEMS` |
| Client gate | `10` | `app/src/components/main/ConceptLessonScreen.tsx` → `FREE_MASTERY_PROBLEMS` |
| Docs | 10 of 20 | `README.md`, `PLAY_PRICING.md` |

## Smoke steps (12)

| # | Check | Required? |
|---|--------|-----------|
| 1–7 | live, version, login, catalog, lesson, mastery, problems | **Yes** (if JWT) |
| 8 | admin console | Optional |
| 9 | ACA 5xx logs | Optional (`az`) |
| 10 | wrong-notes | **Yes** if JWT |
| 11 | SMTP via forgot-password | **Yes** (503 mail_not_configured = FAIL) |
| 12 | math-helper text solve | **Yes** if JWT (403 quota = PASS) |

Photo OCR + guardian **inbox** delivery remain **manual G3**.

## Code shipped toward L1/L2 (this effort)

- Tutorial bottom-sheet + “시작할게요” → `/app/learn`
- Mastery FE 5→10 + docs
- Smoke 10–12 extensions
- Paywall outcome copy + `paywall.view` / `paywall.cta` / `paywall.gate_hit` events

## Blocked without operator

- Play product prices, license testers, RTDN test notification
- AAB upload to Internal track
- Real money / license purchase E2E
- Production secret verification (SMTP/FCM keys in Key Vault)
