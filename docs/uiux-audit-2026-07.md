# Matheo UI/UX audit — 2026-07-09

Scope: first-run 사용안내 + full app vs learning-app industry patterns  
(Duolingo, Photomath, Khan Academy, QANDA/Mathpresso, Gauth).

## A. 현재 상태 검증 (repo)

| Item | Status |
|------|--------|
| Local branch at audit start | `fix/reminder-timezone-kr` @ `aafc59a` — **behind** `origin/main` (missing PRs #61–#64) |
| `origin/main` tip | `56fa477` (PR #64 merge) |
| Tutorial on main (pre this PR) | PR #59 modal tokens + PR #61 icons/counter/Back — still **centered Modal width 440** |
| This branch | `fix/tutorial-sheet-fit-app` — tutorial → **bottom sheet** matching `.fb-sheet` / onboarding |

### Recent UI PRs (already merged)

| PR | Title | Verdict |
|----|-------|---------|
| #59 | 사용안내 팝업 스타일 정합 + 모달 토큰화 | Root cause partial fix (shared Modal chrome) |
| #61 | 안내가이드 아이콘 + 카운터 + 이전 | Content polish only; size/pattern still dialog |
| #62 | free mastery 5→10 + solver refund | Conversion/H4 free-tier balance |
| #63 | a11y 44px + choice keyboard | Touch/a11y baseline |
| #64 | KR push timezone + Korean copy | Ops/trust |

### Open product tasks (from board) — verification

| Task | Code reality | Status |
|------|--------------|--------|
| H4 mastery-gate paywall 성과 가시화 | `FREE_TIER_MASTERY_PROBLEMS = 10`; paywall benefits + outcome copy exist; dedicated “성과 리포트 = 세일즈 피치” surface not fully productized | **Partial** — free gate relaxed; sales-pitch report still open |
| 스모크 3건 (photo/SMTP/wrong-note) | `scripts/smoke-prod.sh` exists; no evidence of last green run in this session | **Needs manual re-run** |
| 4 switches ON (billing·guest·FCM·analytics) | `.env.example`: `BILLING_UI_ENABLED=false`; flags via `FEATURE_*_PCT`; guest_mode is kill-switch style | **Config/ops** — not code-complete by itself |
| 전환 성과 리포트 격상 | Admin KPI PR #46 open; student efficacy card flag exists | **Open** |
| 부모초대/추천 루프 K>0.3 | Guardian consent + parent dashboard exist; **no viral referral/invite loop** | **Open / not built** |

## B. 사용안내 팝업 — 진단 → 수정

### Why it still felt “off” after #59/#61

1. **Pattern mismatch**: App is mobile-first (phone ≤428px, bottom sheets for feedback). Tutorial used **desktop-style centered Modal**.
2. **CTA mismatch**: `.btn` is full-width height 54px; tutorial used a **small side-by-side** primary next to text skip.
3. **Progress mismatch**: Onboarding uses full-width segment bars (`.steps .dot`); tutorial used pill dots.
4. **Backdrop dismiss**: Modal closed on outside tap — bad for first-run education.
5. **Width**: 440–460px on a 360–390 content phone felt oversized even with `maxWidth: 100%`.
6. **Title redundancy**: ①/②/③ in copy + step counter + icons.

### Fix (this branch)

- `CoreLoopTutorialModal` → `.tutorial-sheet` bottom sheet (same family as AnswerFeedbackSheet)
- Full-width primary CTA + secondary row (Back / Skip) using `.btn` / `.btn.text`
- Onboarding segment progress; step pill; display title typography
- Backdrop **does not** dismiss; Escape does
- Copy: drop circled numbers from titles
- `FirstAchievementModal` width 480 → 360 (phone-safe)

## C. Full app UI/UX vs competitors

Legend: **S** strong · **P** partial · **W** weak · **M** missing

| Dimension | Matheo | Industry bar | Score | Notes |
|-----------|--------|--------------|-------|-------|
| Visual system / tokens | Sage palette, Lora+Inter, radius scale, dark mode | Duolingo/Khan: strong brand + consistency | **S** | Token discipline is real; prototype → production path solid |
| Phone shell | `.mathema-phone` 428px frame | Mobile-native full bleed | **S** | Correct for Capacitor |
| Nav IA (5 tabs PDCA) | Home→Learn→Study→Notes→Test; Me in avatar | Material 3 max 5; leaders put profile top | **S** | Intentional, documented |
| First-run education | Was dialog; now bottom sheet | Duolingo: full-screen / progressive tooltips | **P→S** | Sheet is right form; next: coachmarks on empty states |
| Onboarding | Multi-step, grade, age, consent | Goal-setting + placement (Duolingo/Khan) | **P** | Strong forms; weaker “goal + first win in <60s” |
| Practice feedback | AnswerFeedbackSheet slide-up | Instant, celebratory, reteach | **S** | Confetti, streak chip, reteach CTA |
| AI Solver | Upload modal, quota meter | Photomath/Gauth: camera-first speed | **P** | UX good; speed/OCR still competitive pressure |
| Wrong notes / weak spots | Auto collect + DNA + review queue | Differentiator vs pure solvers | **S** | Core moat UI — keep foremost |
| Mastery / free gate | Cap 10 of 20; paywall | Khan free core; Photomath freemium | **P** | Better after #62; gate still needs outcome framing |
| Paywall | Benefits, promo, monthly default | Transparent pricing, social proof | **P** | Code mature; needs live proof metrics |
| Empty states | Cold-start hero | Guided next action | **P** | Present; should deep-link into tutorial step 1 |
| a11y | 44px targets, keyboard choices, tab buttons | WCAG AA touch | **S** | Recent #63 |
| Parent / viral loop | Guardian consent only | Referral K-factor (invite codes) | **M** | Highest growth lever still missing |
| Localization | ko/en (+hi partial) | Market-native | **P** | KR copy improved (#64); keep auditing English leaks |

### Priority backlog (UI only)

1. **P0** Ship tutorial bottom-sheet (this branch) + verify on device with `localStorage` clear.
2. **P1** Empty-state coachmarks: Home cold-start → one CTA that starts Learn (not re-open sheet).
3. **P1** Paywall: show real mastery/progress deltas (“10문제 더 → 단원 완성”) not feature bullets alone.
4. **P2** Modal inventory: any remaining wide centered modals on phone routes → sheet or `max-width: min(100%, 360px)`.
5. **P2** Referral invite sheet (parent + friend) — growth, not polish.
6. **P3** Micro-delight: step complete haptics (Capacitor), reduced-motion already gated.

## D. Verdict

- Design system and learning loop UI are **above average** for an early-stage edu app.
- The 사용안내 mismatch was **structural** (dialog vs sheet), not only color tokens — #59/#61 fixed chrome/content; this change fixes **pattern**.
- Competitive gap is less “pretty UI” and more **activation speed + viral loop + outcome-framed paywall**.
