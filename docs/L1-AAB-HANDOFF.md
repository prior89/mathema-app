# L1 AAB Handoff (Internal Testing)

**Date:** 2026-07-09  
**Source commit (deployed backend):** `83e592c` (PR #65)  
**GitHub Actions run:** https://github.com/prior89/mathema-app/actions/runs/28971643679

## Artifact

| Field | Value |
|-------|--------|
| Download | `gh run download 28971643679 -n matheo-aab -D dist-releases/l1-aab-83e592c` |
| Local path (if already downloaded) | `dist-releases/l1-aab-83e592c/app-release.aab` |
| Filename | `app-release.aab` |
| Size | 8 528 918 bytes |
| SHA256 | `AD74A2113EA18C43F00871285EC098285914D71A8E1AE2820EC7D3972B479B58` |

`dist-releases/` is gitignored — keep the binary on the operator machine only.

## Play Console upload

1. Open [Play Console](https://play.google.com/console) → app **Matheo** (`ai.matheo.app`)
2. **Testing → Internal testing → Create new release**
3. Upload `app-release.aab`
4. Release notes example: `L1 after PR #65 — tutorial sheet, free mastery 10, smoke/paywall funnel`
5. **Review → Start rollout to Internal testing**
6. Add license tester emails under **Setup → License testing** if not already
7. Testers install **from Play Store Internal track** (not sideload)

## After upload

| Step | How |
|------|-----|
| RTDN test notification | Monetize → Monetization setup → Send test notification |
| g1.ready | Put admin password in `~/.matheo-smoke-creds` as `SMOKE_ADMIN_EMAIL` / `SMOKE_ADMIN_PASSWORD`, then `node scripts/check-billing-readiness.mjs` |
| G2 purchase + restore | License tester device, `docs/L1-OPERATOR-RUNBOOK.md` §3 |

## Already verified (no Play needed)

- Backend/Frontend deployed for `83e592c`
- `npm run billing:preflight` exit 0 (local secrets)
- `scripts/smoke-prod.sh` → 10 pass / 0 fail / 2 skip
- `GET /billing/status` → `billingUiEnabled: true`
