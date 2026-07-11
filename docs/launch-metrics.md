# KR Launch — the two numbers, the kill criteria, and the device smoke

The whole B2C-premium thesis reduces to two measurable numbers (see
`scripts/business-model-sim.mjs` for the model). This doc pins how to measure
them and the pre-committed decision rule, so the 60–90 day review is arithmetic,
not vibes.

## The two numbers

### 1. Organic activated→paid conversion (target ≥ 2.5%, breakeven ≈ 2.0%)

Activated = did ≥1 AI solve. Paid = has a Play subscription row.

```sql
-- Cohort: users created in the window (exclude guests and staff).
WITH cohort AS (
  SELECT id FROM "User"
  WHERE "createdAt" BETWEEN :start AND :end
    AND "isGuest" = false AND role = 'STUDENT'
),
activated AS (
  SELECT DISTINCT sa."userId" FROM "SolverAttempt" sa
  JOIN cohort c ON c.id = sa."userId"
),
paid AS (
  SELECT DISTINCT s."userId" FROM "Subscription" s
  JOIN cohort c ON c.id = s."userId"
  WHERE s.status IN ('ACTIVE', 'GRACE', 'CANCELED')   -- ever-entitled
)
SELECT
  (SELECT count(*) FROM cohort)    AS cohort,
  (SELECT count(*) FROM activated) AS activated,
  (SELECT count(*) FROM paid)      AS paid,
  round(100.0 * (SELECT count(*) FROM paid)
        / nullif((SELECT count(*) FROM activated), 0), 2) AS conv_pct;
```

Cross-check paid counts against Play Console → 수익 창출 → 구독 (source of truth
for money; the DB can lag RTDN by minutes).

### 2. Viral K-factor (target > 0.3)

Numerator = student-initiated parent invites; the referral loop records
`PARENT_LINK_REQUESTED` with `metadata.studentInvited = true`.

```sql
-- Invites sent by students in the window
SELECT count(*) AS invites_sent
FROM "SecurityEvent"
WHERE "eventType" = 'PARENT_LINK_REQUESTED'
  AND (metadata ->> 'studentInvited') = 'true'
  AND "createdAt" BETWEEN :start AND :end;

-- New parent accounts in the window (invite-driven registrations)
SELECT count(*) AS parent_signups
FROM "User"
WHERE role = 'PARENT' AND "createdAt" BETWEEN :start AND :end;
```

K ≈ parent_signups / active_students_in_window (approximation: every parent
signup in the window is invite-driven — true until any parent marketing runs).
Track weekly; the trend matters more than the point value.

## Kill / pivot rule (pre-committed 2026-07)

At day 60–90 of the soft-launch cohort:

- conv < 1% **AND** K ≈ 0 → the B2C-premium hypothesis is rejected.
  Pivot to parent-first or B2B (school / 공부방). No sunk-cost debate.
- conv ≥ 2.5% **AND** K > 0.3 → underwrite growth investment.
- In between → iterate on the conversion engine (mastery gate, weekly report)
  for one more cycle, nothing else.

Tripwires to watch weekly alongside the two numbers:
- wrong-solution reports per 100 solves (accuracy trust — the wedge dies if this climbs)
- D1 activation rate (guest-first should hold it ≥ ~60% of opens)
- paywall-view→purchase at the mastery gate (the sim's H4 lever; healthy ≥ 8%)
- gpt-5.5 fallover spend (429 storms convert volume into cost — see scale audit)

## Real-device smoke (before announcing) — 3건

1. **결제**: 내부테스트 트랙 AAB 설치 → 챕터 mastery 10문제 완료 → 게이트에서
   Premium → Play 시트 ₩9,900 → 결제 → "PREMIUM ACTIVE" 확인 → QuotaMeter가
   사라졌는지 → Play 구독센터에서 해지 → 만료 후 접근 회수 확인.
2. **사진 풀이**: 실제 교과서 문제 촬영 → OCR 미리보기 수식 확인 → 풀이가
   한국어인지, 개념칩이 한국어인지, 신고 버튼이 있는지.
3. **만14 미만 가입**: 나이 13 입력 → 보호자 이메일 → 메일 실도착 → 승인 →
   진단 진입.

Launch switches (all live as of 2026-07-12): `BILLING_UI_ENABLED=true`,
`FEATURE_GUEST_MODE_PCT=100`, FCM Firebase creds (KST reminder crons).
Optional: add a Play Console *offer* on each base plan to show the 60-day
launch-promo badge (the client auto-detects eligible offers; base-plan-only
shows full price, which is also fine).
