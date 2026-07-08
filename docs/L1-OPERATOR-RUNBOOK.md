# L1 Operator Runbook — Play Internal Testing

**Audience:** human with Play Console + device access  
**Code checklist (full detail):** `PLAY_INTERNAL_TESTING_CHECKLIST.md`, `PLAY_BILLING_GATES.md`  
**DoD tracker:** `docs/L1-DOD-STATUS.md`

This runbook is the **minimum path** to Internal Testing GO. Do not invent parallel docs—link and check.

---

## 0. Before you start

- [ ] Latest `main` deployed (backend ACA + frontend SWA green on GitHub Actions)
- [ ] AAB built: `gh workflow run android-release.yml --ref main` (or download latest artifact)
- [ ] Confirm dual flags for **production / internal**:
  - Server: `BILLING_UI_ENABLED=true`
  - AAB/SWA build: `VITE_BILLING_ENABLED=true` (usually from same GH secret)

---

## 1. Automated gates (can be agent-assisted)

```bash
# From repo root with server/.env or env injected
npm run billing:preflight

# Smoke (learner account that can login; guest fallback if unverified)
bash scripts/smoke-prod.sh <BACKEND_URL> <EMAIL> <PASSWORD> [ADMIN_EMAIL] [ADMIN_PASSWORD]

# Admin JWT required
curl -s -H "Authorization: Bearer $ADMIN_JWT" \
  "$BACKEND_URL/api/v1/admin/billing/readiness"
# Expect: "g1": { "ready": true, ... }
```

| Check | Pass | Record |
|-------|------|--------|
| preflight exit 0 | ⬜ | date: |
| smoke fail_count = 0 | ⬜ | date: |
| g1.ready true | ⬜ | date: |

**Warning:** `g2.ready: true` only means RTDN inbox ORPHAN/RETRYABLE empty. It does **not** mean license-tester purchase E2E passed.

---

## 2. Play Console (manual)

| # | Task | Pass |
|---|------|------|
| 2.1 | Subscriptions `premium_monthly` / `premium_yearly` Active; prices = `PLAY_PRICING.md` | ⬜ |
| 2.2 | License testing: ≥2 Google accounts | ⬜ |
| 2.3 | RTDN → Pub/Sub → `POST /api/v1/billing/rtdn` | ⬜ |
| 2.4 | Send **test notification** → inbox PROCESSED (admin or logs) | ⬜ |
| 2.5 | Data Safety / Privacy / Terms URLs match live domain | ⬜ |
| 2.6 | Internal testing: upload AAB, publish, invite testers | ⬜ |

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
