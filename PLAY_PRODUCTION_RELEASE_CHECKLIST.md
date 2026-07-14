# Matheo Google Play production release gate

Last verified: 2026-07-15

Package: `ai.matheo.app`

Launch scope: South Korea only

A production-access application or production release is allowed only when
every **BLOCKER** below is checked. Evidence should be attached to the release
run or written next to the item; a green Play Console button is not evidence.

## BLOCKER — policy and review

- [ ] Data Safety says the app collects data and matches the exact matrix in
  `PLAY_DATA_SAFETY.md`; preview reviewed before submission.
- [ ] Privacy policy, terms, and account-deletion URLs return HTTP 200 without
  authentication.
- [ ] In-app account deletion removes the User and every account-linked table,
  including non-FK AI/security logs; automated deletion tests pass.
- [ ] Reviewer credentials log in against production immediately, require no
  OTP/MFA/guardian action, and instructions explain how to reach core learning,
  AI Solver, and Premium-gated screens.
- [ ] Policy status shows no unresolved issue.

## BLOCKER — billing

- [ ] `premium_monthly`: active auto-renewing **P1M**, KRW 9,900, KR only.
- [ ] `premium_yearly`: active auto-renewing **P1Y**, KRW 99,000, KR only.
- [ ] No active Play free trial/intro offer unless the listing, terms, and app
  disclosure explicitly describe it.
- [ ] License-test accounts are selected in Settings > License testing and are
  also eligible for the uploaded test track.
- [ ] License device passes purchase, process-kill recovery, restore, monthly to
  yearly change, cancellation, refund/void, and pending-payment handling.
- [ ] `npm run billing:preflight` exits 0 and `/admin/billing/readiness` reports
  G1/G2 ready with no DEAD/RETRYABLE inbox backlog.

## BLOCKER — RTDN

- [ ] Topic is `projects/matheo-prod/topics/play-rtdn-matheo`.
- [ ] Google Play notification service account has `roles/pubsub.publisher` on
  the topic.
- [ ] Push subscription `play-rtdn-matheo-push` targets the exact HTTPS
  `RTDN_AUDIENCE`, uses the configured OIDC service account, and uses the same
  URL as token audience.
- [ ] Play Console test notification creates a `PROCESSED` RTDN inbox row.
- [ ] A real license-test cancellation/refund produces RTDN and entitlement is
  re-queried through the Google Play Developer API.

## BLOCKER — artifact

- [ ] CI is run from the intended release commit, not a dirty local tree.
- [ ] Explicit `version_code` is greater than every Play artifact and at most
  2,100,000,000. For this release it must be greater than `2026062102`.
- [ ] `GOOGLE_SERVICES_JSON_BASE64`, OAuth, billing, and signing secrets pass
  the Android release workflow's validation steps.
- [ ] Signed AAB installs through a Play test track; never sideload for Billing
  validation.
- [ ] Play pre-launch report has no crash, ANR, login blocker, or severe
  accessibility/security finding.

## RELEASE QUALITY

- [ ] Phone screenshots remain accurate; 7-inch and 10-inch tablet screenshots
  are supplied or the app's tablet presentation is explicitly accepted.
- [ ] Android 15 edge-to-edge/inset warnings are tested on at least one API 35+
  device.
- [ ] FCM registration and a real reminder push work from the Play-delivered
  build.
- [ ] Store contact email and website use the current VeraStudy domain.
- [ ] Production access answers accurately summarize tester feedback, fixes,
  and readiness; save a copy before submitting.

## Rollout

1. Upload the new artifact to an internal/closed track and complete all gates.
2. Apply for production access. This is not the same as publishing a release.
3. After Google grants access, create a staged production release with the
   smallest available rollout, monitor crashes/ANRs/billing/RTDN, then widen.
