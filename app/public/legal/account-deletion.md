# Account deletion request

This page lets you request deletion of your **matheo** account and all
associated personal data, without needing to install or open the app. It is
the canonical web destination registered with Google Play under the
**Data deletion URL** field, per the Play User Data policy that took effect
2026-04-15.

## What gets deleted

When you delete your account, we permanently and irreversibly remove every
record listed below within **30 days** of your request (most often within
minutes):

- Account profile — name, email, hashed password, class, study goal,
  exam date, country, school level.
- Practice attempts, wrong notes, mock-exam results, study sessions,
  concept-lesson progress, daily-activity log, mastery snapshots and
  trajectories, weekly reports, recommendation logs, error-pattern
  profile, feedback entries, teacher overrides (if any).
- Push notification device tokens.
- DPDP consent records (Data Processing / Analytics / AI Training /
  Marketing).
- Password-reset and email-verification tokens.

In addition, your `userId` is set to `NULL` in our anonymised
`AnalyticsEvent` table so the row no longer ties any interaction to you,
but the aggregate funnel signal survives.

## What we retain

We are required to keep a narrow audit trail under DPDP §6(1) and Indian
record-keeping law. Specifically:

- **AdminAccessLog** — operator actions taken on the platform, with no
  link back to your identity once your account is deleted. Retention
  365 days, then automatic purge.
- **Backup snapshots** — encrypted offsite backups roll off within an
  additional 30 days after deletion. Your data is unreachable in those
  snapshots for restore purposes during that window.

We do not retain personal data for marketing, analytics enrichment, or any
purpose other than the above.

## How to request deletion

### Easiest — inside the app

1. Open matheo on your device.
2. Tap **Me → Settings → Privacy**.
3. Tap **Delete my account**.
4. Type `DELETE` to confirm.
5. The action is irreversible. You are signed out immediately.

### Web — without opening the app

Email `privacy@mathema.app` from the email address associated with your
matheo account, with subject:

```
Account deletion request — DPDP §12
```

Include:

- Your account email (so we can match the request to your account).
- A short statement: *"I request deletion of my matheo account and all
  associated personal data."*

We confirm receipt within **48 hours** and complete deletion within
**30 days** as required by the Play User Data policy and DPDP §12.

### Identity verification

For account safety we verify that the deletion request comes from the
account holder. If we cannot confirm the request matches the registered
email (for example, because you changed email and never re-verified),
we may ask you to:

- Sign in once from the original email to confirm ownership, or
- Provide the signup date / class / a recent receipt of activity.

We never ask for your password or any government ID.

## Privacy Policy

The detailed data-handling practices are described in
[Privacy Policy](./privacy-policy.md) (DPDP / GDPR / Play Family-Policy
aligned).

## Contact

- **Grievance Officer**: `privacy@mathema.app`
- **General support**: `support@mathema.app`
- **Response window**: 48 hours acknowledgement, 30 days completion.
