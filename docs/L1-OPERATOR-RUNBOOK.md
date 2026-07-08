# L1 Operator Runbook — Play Internal Testing

**Audience:** human with Play Console + device access  
**Code checklist (full detail):** `PLAY_INTERNAL_TESTING_CHECKLIST.md`, `PLAY_BILLING_GATES.md`  
**DoD tracker:** `docs/L1-DOD-STATUS.md`

This runbook is the **minimum path** to Internal Testing GO. Do not invent parallel docs—link and check.

---

## 0. Before you start

- [x] Latest `main` deployed (backend ACA + frontend SWA) — **2026-07-09**, `gitSha=83e592c` (PR #65)
- [x] AAB built — artifact run `28971643679` (local copy: `dist-releases/l1-aab-83e592c/app-release.aab`)
- [x] Dual flags (prod observed):
  - Server `billingUiEnabled=true` via `GET /billing/status` (smoke user, 2026-07-09)
  - AAB/SWA build injects `VITE_BILLING_ENABLED` from GH secret `BILLING_UI_ENABLED`

---

## 1. Automated gates (can be agent-assisted)

```bash
# From repo root with server/.env or env injected
npm run billing:preflight

# Smoke (learner account that can login; guest fallback if unverified)
bash scripts/smoke-prod.sh <BACKEND_URL> <EMAIL> <PASSWORD> [ADMIN_EMAIL] [ADMIN_PASSWORD]

# Learner billing UI probe (no admin needed)
node scripts/check-billing-status.mjs

# Admin readiness (needs ADMIN password matching ADMIN_EMAILS allowlist)
node scripts/check-billing-readiness.mjs
# or:
curl -s -H "Authorization: Bearer $ADMIN_JWT" \
  "$BACKEND_URL/api/v1/admin/billing/readiness"
# Expect: "g1": { "ready": true, ... }
```

| Check | Pass | Record |
|-------|------|--------|
| preflight exit 0 | ✅ | 2026-07-09 local `server/.env` |
| smoke fail_count = 0 | ✅ | 2026-07-09 — 10 pass / 0 fail / 2 skip @ `83e592c` |
| `billingUiEnabled` true | ✅ | 2026-07-09 `/billing/status` |
| g1.ready true | ⬜ | needs admin password (demo pass ≠ prod admin) |

**Warning:** `g2.ready: true` only means RTDN inbox ORPHAN/RETRYABLE empty. It does **not** mean license-tester purchase E2E passed.

---

## 2. Play Console (manual) — **you are here**

### AAB ready to upload

| Field | Value |
|-------|--------|
| Path | `dist-releases/l1-aab-83e592c/app-release.aab` |
| Re-download | `gh run download 28971643679 -n matheo-aab -D dist-releases/l1-aab-83e592c` |
| SHA256 | `AD74A2113EA18C43F00871285EC098285914D71A8E1AE2820EC7D3972B479B58` |
| Size | 8 528 918 bytes |
| Notes | See `dist-releases/l1-aab-83e592c/UPLOAD.txt` |

| # | Task | Pass |
|---|------|------|
| 2.1 | Subscriptions `premium_monthly` / `premium_yearly` Active; prices = `PLAY_PRICING.md` | ⬜ |
| 2.2 | License testing: ≥2 Google accounts | ⬜ |
| 2.3 | RTDN → Pub/Sub → `POST /api/v1/billing/rtdn` | ⬜ |
| 2.4 | Send **test notification** → inbox PROCESSED (admin or logs) | ⬜ |
| 2.5 | Data Safety / Privacy / Terms URLs match live domain | ⬜ |
| 2.6 | Internal testing: upload AAB above, publish, invite testers | ⬜ |

---

## 3. G2 minimum (device, license tester)

Install from **Play Internal testing** (not sideload-only) while signed into a license tester account.

| # | Scenario | Pass |
|---|----------|------|
| 3.1 | New monthly purchase → Premium gates open | ⬜ |
| 3.2 | Restore purchases → entitlement restored | ⬜ |
| 3.3 | (Nice) Cancel in Play → entitled until expiry | ⬜ |

Full 2.1–2.6 matrix: `PLAY_BILLING_GATES.md` / checklist G2.

---

## 4. Device product smoke (G3 abbreviated)

| # | Path | Pass |
|---|------|------|
| 4.1 | Register / login (student only — `LAUNCH_STUDENT_ONLY`) | ⬜ |
| 4.2 | Onboarding complete → Home | ⬜ |
| 4.3 | Core-loop tutorial sheet → “시작할게요” → Learn | ⬜ |
| 4.4 | Concept → practice ≥1 problem | ⬜ |
| 4.5 | Wrong note list opens | ⬜ |
| 4.6 | AI Solver text or photo once (quota meter updates) | ⬜ |
| 4.7 | Free mastery gate: after **10** free problems UI offers upgrade (not at 5) | ⬜ |
| 4.8 | Paywall shows outcome copy + plans (if billing flags on) | ⬜ |

Manual only: photo OCR quality, guardian email **inbox** receive.

---

## 5. Sign-off

| Role | Name | Date | GO / NO-GO |
|------|------|------|------------|
| Eng / agent code | | | |
| Operator Play | | | |
| Product | | | |

**GO** only if DoD 1–6 in `L1-DOD-STATUS.md` are checked or explicitly waived with reason.
