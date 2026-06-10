# Play Store Data Safety inventory

Source-of-truth for the **Data Safety form** in Google Play Console. Re-check
this document before every store submission — when a new field is added to
`server/prisma/schema.prisma` or a new 3rd-party SDK lands, the corresponding
row here MUST be updated, otherwise the listing falls out of compliance.

Last updated: 2026-06-11 (Premium / Play Billing)
Backend reference: `server/prisma/schema.prisma`
Frontend reference: `app/src/lib/{api,analytics,queries,mutations}.ts`

---

## 1. Categories collected

Mapping uses Google Play's official categories.
"Required" = the app cannot function without it.
"Optional" = the user can refuse via DPDP `Consent.revokedAt` and the app
still works (degraded for the relevant feature).

### 1.1 Personal info

| Field | Where | Purpose | Req / Opt | Shared with 3P |
|---|---|---|---|---|
| Email | `User.email` | Account management, login, password reset | Required | Sentry (in crash context only) |
| Name | `User.name` | Account management, personalised greeting | Required | — |
| Other (school level, grade level, study goal, country, target grade, exam date) | `User.gradeLevel`, `User.schoolLevel`, `User.studyGoal`, `User.country`, `User.targetGrade`, `User.examDate` | App functionality — NCERT curriculum mapping, recommendation tailoring | Required | — |
| Parent-child link (parent's account references the student's user id) | `User.childOfUserId` | App functionality — PARENT role dashboards | Optional (only PARENT users) | — |
| Password hash | `User.passwordHash` | Account management (bcrypt, never reversible) | Required | — |
| IP address + user agent | `Consent.ipAddress`, `Consent.userAgent`, `PasswordResetToken.requestIp` | Legal — DPDP 2023 evidence of consent | Required (for users granting consent) | — |

### 1.2 Financial info

Matheo offers an optional **Premium subscription** via **Google Play Billing**.
We do **not** collect payment card, UPI, or bank details — Google Play processes
payments. Our servers store purchase-metadata needed for entitlement only.

| Field | Where | Purpose | Req / Opt | Shared with 3P |
|---|---|---|---|---|
| Purchase history (productId, status, start/expiry, autoRenewing, intro offer, countryCode) | `Subscription` | Entitlement gating, renewal handling | Required (Premium subscribers only) | — |
| Google Play purchase token (opaque reference; stored as received for API re-verification) | `Subscription.purchaseToken` | Play Developer API verification | Required (Premium subscribers only) | Google Play Developer API |
| Subscription audit events | `SubscriptionEvent` | RTDN / verify audit trail | Required (Premium subscribers only) | — |

**Not collected:** credit card number, UPI ID, bank account, billing address.

### 1.3 Location
**None precise / approximate.** `User.country` is set by the user at signup —
not derived from GPS, IP geo, or network — and is treated as a profile
preference, not location data.

### 1.4 Web browsing
**None.** The app does not record external browsing history.

### 1.5 App activity

| Field | Where | Purpose | Req / Opt | Shared with 3P |
|---|---|---|---|---|
| Problem attempts (answer, isCorrect, durationSec, confidence, hintUsed, errorCodes, deviceType, timeOfDay) | `Attempt` model | App functionality — grading, mastery, recommendation | Required | OpenAI (LLM analysis on `AI_TRAINING` consent only) |
| Step-by-step solution input | `Attempt.stepByStepInput` | Personalisation — LLM diagnoses misconceptions | Optional (`AI_TRAINING` consent) | OpenAI |
| Wrong notes (errorType, occurrences, insight, SM-2 schedule) | `WrongNote` model | App functionality — review queue, spaced repetition | Required | — |
| Study sessions (sessionNumber, durationSec, focusScore, fatigueSignal) | `StudySession` model | App functionality — session history | Required | — |
| Mock exam results (score, grade, percentile, durationMin) | `MockExamResult` model | App functionality — exam scoring + progress | Required | — |
| Concept lesson progress (currentStep, completedSteps, retrievalScore) | `ConceptProgress` model | App functionality — lesson resume + gating | Required | — |
| Daily activity (durationMin, problemsSolved, accuracyPct, intensity) | `DailyActivity` model | App functionality — streak + heatmap | Required | — |
| Mastery snapshots (per concept score, evidence count, recent accuracy, confidence gap) | `MasterySnapshot`, `MasteryTrajectory`, `MasteryEvent` | App functionality — adaptive recommendation | Required | OpenAI (LLM analysis on `AI_TRAINING` consent only) |
| Error pattern profile (errorCode frequency, severity, status) | `ErrorPatternProfile` model | Personalisation | Optional (`AI_TRAINING` consent) | OpenAI |
| Recommendation log (target concept, expected difficulty, result) | `RecommendationLog` model | Personalisation + algorithm evaluation | Optional (`ANALYTICS` consent) | — |
| Weekly report aggregates | `WeeklyReport` model | App functionality — auto-generated insights | Required | — |
| In-app interaction events (page view, CTA click, perspective change) | `AnalyticsEvent` model | Analytics — funnel + engagement | Optional (`ANALYTICS` consent) | — |
| Feedback (rating, comment) | `Feedback` model | App functionality — feedback + service improvement | Optional (user-initiated) | — |
| Teacher override (manual mastery adjustments by teacher role) | `TeacherOverride` model | App functionality — teacher dashboards | Required (TEACHER role only) | — |

### 1.6 App info and performance

| Field | Where | Purpose | Req / Opt | Shared with 3P |
|---|---|---|---|---|
| Crash logs (stack traces, breadcrumbs, user id) | Sentry (`@sentry/react` + `@sentry/node`) | Diagnostics | Optional (anonymisable; `ANALYTICS` consent recommended) | Sentry |
| Performance telemetry (route timing, server latency, request volume) | Azure Application Insights | Diagnostics | Optional (anonymous) | Microsoft |
| Server-side audit (admin actions, auth events) | `AdminAccessLog`, `LLMAnalysisLog`, `LLMAnalysisJob` | App functionality — operational audit, AI cost tracking | Required (admin/system level — not user data) | — |

### 1.7 Device or other IDs

| Field | Where | Purpose | Req / Opt | Shared with 3P |
|---|---|---|---|---|
| Push notification token | `DeviceToken.token` | App functionality — push notifications via FCM | Optional (`MARKETING` consent, plus per-OS notification permission) | Firebase Cloud Messaging |
| Platform + app version | `DeviceToken.platform`, `DeviceToken.appVersion` | App functionality | Required (when push enabled) | — |
| Session ID (browser sessionStorage UUID) | `AnalyticsEvent.sessionId` | Security — request-tracing | Required | — |

---

## 2. Data shared with third parties

Every third-party recipient enumerated. Each should be cross-checked against
its own data-processing addendum (DPA) and listed in the Privacy Policy.

| Recipient | Purpose | Data sent | Consent gate |
|---|---|---|---|
| **OpenAI (gpt-4o-mini)** | LLM analysis (wrong-note diagnostic), math-helper solver | Problem body, student step-by-step input, student answer, wrong-note context | `AI_TRAINING` (analysis) — fallback to rule-based when absent; math-helper `/solve` always uses OpenAI when enabled |
| **Google Gemini API OCR** | OCR for photo / PDF problem upload | Photo / PDF image bytes | Per-use (the upload action is the consent surface) |
| **Google OAuth 2.0** | Sign-in flow | Email, name, Google `sub` id | User-initiated sign-in |
| **Firebase Cloud Messaging** | Push notification delivery | `DeviceToken.token`, message payload | `MARKETING` consent + OS-level permission |
| **Sentry** | Crash + error capture | Stack trace, user id, breadcrumb, environment | `ANALYTICS` recommended; engineering-only viewers |
| **Microsoft Azure Application Insights** | Backend performance telemetry | Request path, latency, response size, anonymised user id | Required (operational) |

---

## 3. Data security practices

- **In transit**: HTTPS only. `app/capacitor.config.ts` enforces
  `androidScheme=https`, `cleartext=false`, `allowMixedContent=false`. Network
  security config on Android pins to production domain.
- **At rest**: Azure Database for PostgreSQL Flexible Server — Transparent
  Data Encryption (TDE) by Microsoft-managed keys. Sensitive fields
  (`User.passwordHash`) are bcrypt-hashed before persistence.
- **Auth tokens**: JWT access (short-lived) + refresh (Redis-backed
  blacklist for revocation, `jwt:refresh:revoked:*`). Reset / verification
  tokens are stored as SHA-256 hashes in DB, never plaintext.
- **Account deletion**: `DELETE /users/me` cascades through every owned row
  (Attempt, WrongNote, StudySession, MockExamResult, Consent, etc.). Backed
  by Prisma `onDelete: Cascade` on every `User` relation.
- **Data export**: `GET /users/me/export` returns the full per-user dataset
  as JSON for portability (DPDP §13 / GDPR Art. 20).
- **Consent revocation**: `DELETE /privacy/consents/:kind`. `DATA_PROCESSING`
  cannot be revoked while the account is active — revoking deactivates the
  account.
- **Token revocation**: logout writes the JWT `jti` into the Redis blacklist
  with TTL equal to remaining token lifetime.
- **Audit log**: `AdminAccessLog` records every admin-level action (user
  lookups, manual overrides, content-ingest decisions).

---

## 4. Required Play Console answers (cheat sheet)

Use these exact answers when filling the Data Safety wizard:

1. *Does your app collect any of the required user data types?* — **Yes**.
2. *Is all of the user data collected by your app encrypted in transit?* — **Yes**.
3. *Do you provide a way for users to request that their data be deleted?* — **Yes** (`DELETE /users/me` is exposed from Settings → Privacy).
4. *Will users be able to request that their data be deleted, but not through your app?* — **Also yes** (any user can email the developer; the in-app path is canonical).
5. *Has your app committed to the Google Play Families Policy?* — **Yes** (the target audience is Class 7-12, i.e. 13-18 year-olds; parental consent flow exists for under-18s as a PARENT role).

---

## 5. Open items to lock before submitting

- [ ] **Privacy Policy URL** (task A2) and Terms of Service URL — Play Console requires the URL to be public when the listing goes live.
- [ ] **Confirm Sentry / App Insights opt-out** is reachable from Settings → Privacy. Right now `SettingsScreen` toggles `Consent.kind` rows but the wiring to Sentry's `Sentry.setUser(null)` on revocation needs checking.
- [ ] **Google Gemini API + OpenAI DPA** copies on file (no PII redaction guarantees from OpenAI on the gpt-4o-mini tier — flag as a known risk in the Privacy Policy).
- [ ] **FCM project + service account** finalised (task C1).
- [ ] **NCERT attribution** flow surfaced in-app (Phase 2 — listed but not required for v1.0 since raw NCERT extracts were already removed in commit `1c841b1`).
