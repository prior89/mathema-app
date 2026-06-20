# Play Billing Gates (G1 / G2)

Operator checklist for Matheo Premium rollout on Google Play. Automated code
readiness lives in `GET /admin/billing/readiness` and `npm run billing:preflight`.

Pricing source of truth: `PLAY_PRICING.md`. The app renders live Google Play
Billing prices, so Play Console must be set to the same regional table before
G1 sign-off.

## G1 — Internal testing upload (조건부 GO)

Upload AAB to **Internal testing** after automated checks pass. License tester
E2E happens **after** upload (not before).

### Automated (CI + scripts)

| Check | How |
|-------|-----|
| Android compile | CI `android-compile` job |
| Server billing tests | CI jest `billing/*` |
| App billing unit tests | CI vitest `billing-*` |
| G1 env | `npm run billing:preflight` |
| Runtime readiness | `GET /admin/billing/readiness` → `g1.ready: true` |

### Operator env (`server/.env`)

```
PLAY_SERVICE_ACCOUNT_JSON=...
PLAY_PACKAGE_NAME=ai.matheo.app
PLAY_OBFUSCATED_ACCOUNT_SECRET=...
RTDN_AUDIENCE=https://<backend>/api/v1/billing/rtdn
RTDN_SERVICE_ACCOUNT_EMAIL=...
BILLING_UI_ENABLED=true
```

### Play Console (manual)

1. **Monetize → Products → Subscriptions**: `premium_monthly`, `premium_yearly` base plans live with the 5-country launch prices from `PLAY_PRICING.md`.
2. **License testers**: add Google accounts under Settings → License testing.
3. **RTDN**: Pub/Sub push subscription → `POST /billing/rtdn`; send **test notification** (expect 200 + inbox PROCESSED).
4. **AAB**: GitHub Actions → **Android Release (AAB)** → download artifact → Internal testing → Create release.
5. **Data Safety / Privacy**: match `PLAY_DATA_SAFETY.md` and in-app legal URLs.

### G1 sign-off

- [ ] `billing:preflight` exit 0
- [ ] `/admin/billing/readiness` → `g1.ready: true`
- [ ] RTDN test notification processed
- [ ] Kill switch: `BILLING_UI_ENABLED=false` hides paywall without rebuild

---

## G2 — License tester E2E (GO 재판정)

Run on a **license tester** device with the Internal testing build.

### Purchase & recovery

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Fresh purchase (monthly) | Play UI → verify → Premium gates open |
| 2 | App kill mid-purchase | Relaunch → onResume sync → entitlement restored |
| 3 | Restore purchases | Paywall “Restore” → `/billing/verify` → Premium |
| 4 | Upgrade monthly → yearly | New token; old token in `SubscriptionPurchaseToken`; entitlement continuous |
| 5 | Cancel (Play manage) | RTDN CANCELED; entitled until `expiryTime` |
| 6 | Refund / voided | RTDN voided → API re-query → entitlement revoked |

### RTDN / ops

| # | Scenario | Expected |
|---|----------|----------|
| 7 | RTDN before client verify | Inbox `ORPHAN` → cron reconcile after verify |
| 8 | Transient Play API down | RTDN 503 → Pub/Sub retry → `RETRYABLE` cleared |
| 9 | Inbox triage | `/admin/billing/rtdn-inbox?status=DEAD` empty before widen rollout |

### Premium gates (403 → Paywall)

| Feature | Trigger |
|---------|---------|
| AI Solver quota | 9th free solve → `/app/paywall?reason=quota` |
| Weekly report | `/app/report` → `PremiumRequired` |
| Adaptive practice | Study adaptive endpoint |

Premium has no graph-specific solver cap at launch; only abuse and
service-protection safeguards apply.

Automated smoke: Playwright `e2e/billing-paywall.spec.ts` (mocked 403 path).

### G2 sign-off

- [ ] Scenarios 1–6 pass on license tester build
- [ ] Scenarios 7–9 verified or documented
- [ ] `/admin/billing/readiness` → `g2.ready: true` (inbox clear)
- [ ] No open `DEAD` RTDN rows

---

## Useful endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /admin/billing/readiness` | G1/G2 automated status |
| `GET /admin/billing/rtdn-inbox?status=ORPHAN` | Orphan backlog |
| `POST /admin/billing/rtdn-inbox/:id/reprocess` | Manual reconcile |

## Rollout order

1. Internal testing (G1)
2. License tester matrix (G2)
3. Closed testing → Open → Production (staged %)
